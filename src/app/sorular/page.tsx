export const dynamic = "force-dynamic";

import { supabasePublic } from "@/lib/supabasePublic";
import QASearch from "@/app/ui/QASearch";

export default async function Home() {
  const { data, error } = await supabasePublic
    .from("questions")
    .select("id,title,slug,body,created_at,answers(id,body,author_name,created_at)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
        <h1>almanya101</h1>
        <p>DB error: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1>almanya101 — Soru & Cevap</h1>
      <QASearch initialData={(data ?? []) as any[]} />
    </main>
  );
}
