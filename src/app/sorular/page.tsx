export const dynamic = "force-dynamic";
import Link from "next/link";
import { supabasePublic } from "@/lib/supabasePublic";

type QuestionRow = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

export default async function Sorular() {
  const { data, error } = await supabasePublic
    .from("questions")
    .select("id,title,slug,created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <main style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
        <h1>Sorular</h1>
        <p>DB error: {error.message}</p>
      </main>
    );
  }

  const rows = (data ?? []) as QuestionRow[];

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
      <h1>Sorular</h1>

      {rows.length === 0 ? (
        <p>Henüz soru yok.</p>
      ) : (
        <ul>
          {rows.map((q) => (
            <li key={q.id}>
              <Link href={`/q/${q.slug}`}>{q.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
