(function(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const heroNet = document.getElementById("heroNet");
  const heroMeta = document.getElementById("heroMeta");
  const taxDetails = document.getElementById("taxDetails");
  const socialDetails = document.getElementById("socialDetails");
  const inputSummary = document.getElementById("inputSummary");

  if (!id) {
    heroMeta.textContent = "Rapor id parametresi bulunamadı.";
    return;
  }

  loadReport(id).catch(err => {
    heroMeta.textContent = err.message;
  });

  async function loadReport(reportId){
    heroMeta.textContent = "Yükleniyor…";
    const res = await fetch(`/api/reports-get?id=${encodeURIComponent(reportId)}`);
    if (!res.ok) {
      throw new Error("Rapor bulunamadı veya sunucu hatası.");
    }
    const data = await res.json();
    render(data);
  }

  function render(data){
    if (!data.output_json) return;

    const out = data.output_json;
    const input = data.input_json || {};

    heroNet.textContent = formatCurrency(out.net);
    heroMeta.textContent = `Hesaplanan tarih: ${new Date(data.created_at).toLocaleString("tr-TR")}`;

    setList(taxDetails, [
      { label: "Gelir vergisi", value: out.taxes?.incomeTax },
      { label: "Dayanışma", value: out.taxes?.solidarity },
      { label: "Kilise vergisi", value: out.taxes?.church },
      { label: "Toplam", value: out.taxes?.total, strong: true },
    ]);

    setList(socialDetails, [
      { label: "Emeklilik", value: out.social?.pension },
      { label: "İşsizlik", value: out.social?.unemployment },
      { label: "Sağlık", value: out.social?.health },
      { label: "Bakım", value: out.social?.care },
      { label: "Toplam", value: out.social?.total, strong: true },
    ]);

    setInputs(input);
  }

  function setList(el, rows){
    if (!el) return;
    el.innerHTML = rows.map(r => `
      <div class="list__row ${r.strong ? "list__row--bold" : ""}">
        <dt>${r.label}</dt>
        <dd>${formatCurrency(r.value || 0)}</dd>
      </div>
    `).join("");
  }

  function setInputs(input){
    if (!inputSummary) return;

    const pairs = [
      ["Aylık brüt", formatCurrency(input.gross_monthly)],
      ["Yıl", input.year],
      ["Vergi sınıfı", input.tax_class],
      ["Çocuk", input.has_child ? "Evet" : "Hayır"],
      ["Kilise vergisi", input.church_tax ? "Var" : "Yok"],
      ["Sağlık ek oran (%)", (input.health_extra_rate ?? 0)]
    ];

    inputSummary.innerHTML = pairs.map(([label, value]) => `
      <div class="input-list__item">
        <div class="input-list__label">${label}</div>
        <div class="input-list__value">${value ?? "—"}</div>
      </div>
    `).join("");
  }

  function formatCurrency(value){
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(value || 0));
  }
})();
