"use client";

import { useMemo, useState } from "react";

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

export default function QASearch({ initialData = [] }: { initialData?: QuestionRow[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialData;

    return initialData.filter((it) => {
      const hay = [
        it.title ?? "",
        it.body ?? "",
        ...(it.answers ?? []).map((a) => a.body ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [query, initialData]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ara (başlık + açıklama + cevap)..."
        style={{ width: "100%", padding: 10, margin: "12px 0", borderRadius: 10 }}
      />

      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        Gösterilen: <b>{results.length}</b> / {initialData.length}
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {results.map((item) => (
          <div key={item.id} style={{ padding: 14, border: "1px solid #222", borderRadius: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{item.title ?? "Untitled"}</div>

            {item.body ? (
              <div style={{ marginTop: 8, opacity: 0.9, whiteSpace: "pre-wrap" }}>{item.body}</div>
            ) : null}

            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              {(item.answers?.length ?? 0) === 0 ? (
                <i>Henüz cevap yok.</i>
              ) : (
                item.answers.map((a) => (
                  <div key={a.id} style={{ paddingLeft: 10, borderLeft: "2px solid #333" }}>
                    <div style={{ whiteSpace: "pre-wrap" }}>{a.body}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                      {a.author_name || "Anonim"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
