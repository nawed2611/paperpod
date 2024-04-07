import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const pc = new Pinecone({
  apiKey: process.env.PINECONE2_API_KEY!,
});
