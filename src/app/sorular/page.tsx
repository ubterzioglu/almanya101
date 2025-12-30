import BrandHeader from "@/app/ui/BrandHeader";
import AskQuestionAccordion from "@/app/ui/AskQuestionAccordion";
import QASearch from "@/app/ui/QASearch";
import { supabasePublic } from "@/lib/supabasePublic";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data, error } = await supabasePublic
    .from("questions")
    .select("id,title,slug,body,status,created_at, answers(id,body,status,created_at)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const questions = data ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <BrandHeader />

      <AskQuestionAccordion />

      <div className="mb-2 text-sm font-semibold">Soru Ara:</div>
      <QASearch initialData={questions} />

      <div className="mt-4 mb-2 text-sm text-gray-600">
        Soru Sayısı: <span className="font-semibold text-gray-900">{questions.length}</span>
      </div>

      {/* QASearch zaten soruları render ediyorsa ekstra liste gerekmeyebilir.
          Eğer QASearch sadece search input ise burada liste componenti eklenir. */}
    </div>
  );
}
