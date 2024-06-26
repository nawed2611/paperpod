import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);
export const runtime = "edge";

export async function POST(req: Request) {
  const { conversation } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a useful chatbot.`,
      },
      { role: "user", content: conversation },
    ],
    max_tokens: 1000,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
