import { NextRequest, NextResponse } from "next/server";
import { nlp } from "@/lib/nlp";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text input" }, { status: 400 });
    }
    const result = nlp.normalize(text);
    return NextResponse.json({ input: text, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}
