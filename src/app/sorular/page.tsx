export const dynamic = "force-dynamic";

import { supabasePublic } from "@/lib/supabasePublic";
import QASearch from "@/app/ui/QASearch";

type AnswerRow = {
  id: string;
  body: string;
  author_name: string | null;
  created_at: string;
};

type QuestionRow = {
  id: string;
  slug: string | null;
  title: string | null;
  body: string | null;
  created_at: string;
  answers: AnswerRow[];
};

export default async function SorularPage() {
  const { data, error } = await supabasePublic
    .from("questions")
    .select("id,slug,title,body,created_at,answers(id,body,author_name,created_at)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
        <h1>Sorular</h1>
        <p>DB error: {error.message}</p>
      </main>
    );
  }

  const items = (data ?? []) as unknown as QuestionRow[];

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1>Sorular + Cevaplar</h1>
      <QASearch initialData={items} />
    </main>
  );
}
