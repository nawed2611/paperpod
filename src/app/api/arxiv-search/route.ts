const arxiv = require("arxiv-api");

export async function POST(req: Request) {
  try {
    const { input, startBy, sortBy } = await req.json();

    const papers = await arxiv.search({
      searchQueryParams: [
        {
          include: [{ name: input }],
        },
      ],
      sortBy: sortBy ? sortBy : "",
      start: startBy ? startBy : 0,
      maxResults: 25,
    });

    const filteredPapers = papers.map((paper: any) => {
      const date = new Date(paper.published);
      const formattedDate = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      const categories = paper.categories.map((category: any) => category.term);

      return {
        id: paper.id,
        title: paper.title,
        summary: paper.summary,
        authors: paper.authors.join(", "),
        categories: categories,
        date: formattedDate,
      };
    });

    return new Response(JSON.stringify(filteredPapers), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch the papers!", { status: 500 });
  }
}
