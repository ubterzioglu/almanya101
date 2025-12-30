"use client";

import { useMemo, useState } from "react";

type Answer = { id: string; body: string; author_name: string | null };
type Question = {
  id: string;
  title: string;
  slug: string;
  body: string | null;
  answers?: Answer[];
};

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function QASearch({ initialData }: { initialData: Question[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = normalize(q);
    if (!needle) return initialData;

    return initialData.filter((item) => {
      const hay = [
        item.title ?? "",
        item.body ?? "",
        ...(item.answers?.map((a) => a.body) ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(needle);
    });
  }, [q, initialData]);

  return (
    <>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ara: anmeldung, schufa, banka hesabı..."
        style={{
          width: "100%",
          padding: 12,
          margin: "16px 0",
          borderRadius: 10,
          border: "1px solid #333",
          background: "#0b0b0b",
          color: "white",
        }}
      />

      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        Gösterilen: <b>{filtered.length}</b> / {initialData.length}
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {filtered.map((x) => (
          <div
            key={x.id}
            style={{
              padding: 14,
              border: "1px solid #222",
              borderRadius: 12,
              background: "#0a0a0a",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18 }}>{x.title}</div>
            {x.body ? (
              <div style={{ marginTop: 8, opacity: 0.9, whiteSpace: "pre-wrap" }}>
                {x.body}
              </div>
            ) : null}

            <div style={{ marginTop: 10, opacity: 0.8 }}>
              {x.answers?.length ? (
                x.answers.map((a) => (
                  <div key={a.id} style={{ marginTop: 8, paddingLeft: 10, borderLeft: "2px solid #333" }}>
                    <div style={{ whiteSpace: "pre-wrap" }}>{a.body}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                      {a.author_name || "Anonim"}
                    </div>
                  </div>
                ))
              ) : (
                <i>Henüz cevap yok.</i>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
