"use client";
import type { QuestionRow } from "@/types/qa";
import { useMemo, useState } from "react";


type Props = {
  initialData?: QuestionRow[];
};

export default function QASearch({ initialData = [] }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.body?.toLowerCase().includes(q) ||
      item.answers.some((a) => a.body.toLowerCase().includes(q))
    );
  }, [query, initialData]);


const MAX_CHARS = 1500;

export default function AskQuestionAccordion() {
  const [question, setQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = useMemo(() => MAX_CHARS - question.length, [question.length]);

  async function onSubmit() {
    setError(null);

    const q = question.trim();
    if (q.length < 10) {
      setError("Lütfen sorunu biraz daha detaylandır (en az 10 karakter).");
      return;
    }
    if (q.length > MAX_CHARS) {
      setError(`Maksimum ${MAX_CHARS} karakter.`);
      return;
    }

    try {
      setIsSending(true);

      const res = await fetch("/api/question-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Gönderim başarısız.");
      }

      setSentOk(true);
      setQuestion("");
    } catch (e: any) {
      setError(e?.message || "Bir hata oluştu.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl border bg-white shadow-sm">
      <details className="group">
        <summary className="cursor-pointer list-none px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="text-base font-bold">Soru Sor</div>
            <div className="text-sm text-gray-500 group-open:hidden">Aç</div>
            <div className="text-sm text-gray-500 hidden group-open:block">Kapat</div>
          </div>
        </summary>

        <div className="px-5 pb-5">
          {sentOk ? (
            <div className="rounded-xl border bg-green-50 px-4 py-3 text-sm">
              Sorunu aldık, teşekkürler! En kısa sürede kataloğa ekleyeceğiz.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className="text-sm font-semibold">Soru Sor:</label>
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSending || question.trim().length === 0}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isSending ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>

              <textarea
                rows={3} // 2 istersen 2 yap; 3 önerim
                value={question}
                onChange={(e) => setQuestion(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Sorunu buraya yaz…"
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
              />

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Maksimum {MAX_CHARS} karakter</span>
                <span>Kalan: {remaining}</span>
              </div>

              {error && (
                <div className="mt-3 rounded-xl border bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </details>
    </div>
  );
}
}
