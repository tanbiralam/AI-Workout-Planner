import OpenAI from "openai";

export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });
}
//https://youtu.be/bk89LxdS0TE?t=9327
