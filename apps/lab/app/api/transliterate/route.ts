import { NextRequest, NextResponse } from "next/server";
import { nlp } from "@/lib/nlp";

export async function POST(req: NextRequest) {
  try {
    const { text, direction = "to-sera" } = await req.json();
    if (typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text input" }, { status: 400 });
    }

    const langMode = direction === "to-geez" ? "en" : "am";
    const result = nlp.feligTransliterate(text, langMode);

    return NextResponse.json({ input: text, result, direction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}
