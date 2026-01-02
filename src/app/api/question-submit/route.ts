Set-Content -Path .\src\app\api\question-submit\route.ts -Encoding utf8 @'
import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabasePublic";

const MIN_LEN = 10;
const MAX_LEN = 1500;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const questionRaw = typeof body?.question === "string" ? body.question : "";
    const question = questionRaw.trim();

    if (question.length < MIN_LEN) {
      return NextResponse.json(
        { error: `Soru en az ${MIN_LEN} karakter olmalı.` },
        { status: 400 }
      );
    }

    if (question.length > MAX_LEN) {
      return NextResponse.json(
        { error: `Soru en fazla ${MAX_LEN} karakter olmalı.` },
        { status: 400 }
      );
    }

    const { error } = await supabasePublic.from("question_submissions").insert([
      { question_text: question, status: "pending" },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
'@
