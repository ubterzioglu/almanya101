"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type QAItem = {
  id: string;
  slug: string | null;
  title: string | null;
  body: string | null;
};

export default function QASearch({ initialData = [] }: { initialData?: QAItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialData;
    return initialData.filter((it) =>
      (it.title ?? "").toLowerCase().includes(q) ||
      (it.body ?? "").toLowerCase().includes(q)
    );
  }, [query, initialData]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ara..."
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((item) => (
          <li key={item.id} style={{ marginBottom: 12 }}>
            <Link href={`/sorular/${item.slug ?? item.id}`}>
              {item.title ?? "Untitled"}
            </Link>
            <p style={{ margin: "4px 0", color: "#666" }}>
              {(item.body ?? "").slice(0, 200)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
