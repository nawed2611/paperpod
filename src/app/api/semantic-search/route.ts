import { openai } from "@/lib/openai";
import { pc } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const { query, categories = null, years = null } = await req.json();

    const embed = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });

    const queryVector = embed.data[0].embedding;

    const pcIndex = pc.index(process.env.PINECONE2_INDEX_NAME!);

    let filterParams: any = {};

    if (categories) {
      filterParams.categories = { $in: categories.split(" ") };
    }

    if (years) {
      filterParams.year = {
        $in: years.split(" ").map((year: string) => parseInt(year)),
      };
    }

    const queryResponse = await pcIndex.query({
      vector: queryVector,
      topK: 25,
      includeValues: true,
      includeMetadata: true,
      filter: filterParams ? filterParams : null,
    });

    const papersList = queryResponse.matches.map((match: any) => {
      return {
        id: match.id,
        title: match.metadata.title,
        summary: match.metadata.abstract,
        authors: match.metadata.authors,
        pdfUrl: `https://arxiv.org/pdf/${match.id}.pdf`,
        date: `${match.metadata.month}, ${parseInt(match.metadata.year)}`,
        categories: match.metadata.categories,
        similarityScore: Math.round(match.score * 100),
      };
    });

    return new Response(JSON.stringify(papersList), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch the papers!", { status: 500 });
  }
}
