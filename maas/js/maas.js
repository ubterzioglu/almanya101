(function(){
  const form = document.getElementById("salaryForm");
  const formMsg = document.getElementById("formMsg");

  const netEl = document.getElementById("netValue");
  const grossEl = document.getElementById("grossValue");
  const deductionsEl = document.getElementById("deductionsValue");

  const taxList = document.getElementById("taxList");
  const socialList = document.getElementById("socialList");

  const reportLink = document.getElementById("reportLink");
  const reportAnchor = document.getElementById("reportAnchor");

  const SESSION_KEY = "maas-session-id";
  const SESSION_HEADER = "x-session-id";

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    formMsg.textContent = "Hesaplanıyor…";

    const payload = collectFormData();
    if (!payload) {
      formMsg.textContent = "Lütfen zorunlu alanları doldurun.";
      return;
    }

    const sessionId = localStorage.getItem(SESSION_KEY) || undefined;

    try {
      const res = await fetch("/api/net-salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionId ? { [SESSION_HEADER]: sessionId } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Hesaplama hatası");
      }

      const data = await res.json();
      renderResult(data);

      if (data.session_id) localStorage.setItem(SESSION_KEY, data.session_id);
      if (data.submission_id) {
        reportAnchor.href = `/maas/report.html?id=${encodeURIComponent(data.submission_id)}`;
        reportLink.hidden = false;
      }

      formMsg.textContent = "";
    } catch (err) {
      formMsg.textContent = err.message;
    }
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      formMsg.textContent = "";
      resetResultUI();
      reportLink.hidden = true;
    }, 0);
  });

  function collectFormData(){
    const gross = Number(document.getElementById("gross").value);
    const year = Number(document.getElementById("year").value);
    const taxClass = Number(document.getElementById("taxClass").value);
    const hasChild = document.getElementById("hasChild").value === "true";
    const churchTax = document.getElementById("churchTax").value === "true";
    const healthExtra = Number(document.getElementById("healthExtra").value || "0");

    if (!gross || !year || !taxClass) return null;

    return {
      gross_monthly: gross,
      year,
      tax_class: taxClass,
      has_child: hasChild,
      church_tax: churchTax,
      health_extra_rate: healthExtra
    };
  }

  function renderResult(res){
    const gross = res.gross ?? 0;
    const net = res.net ?? 0;

    netEl.textContent = formatCurrency(net);
    grossEl.textContent = formatCurrency(gross);

    const taxTotal = (res.taxes && res.taxes.total) ? res.taxes.total : 0;
    const socialTotal = (res.social && res.social.total) ? res.social.total : 0;
    deductionsEl.textContent = formatCurrency(taxTotal + socialTotal);

    if (res.taxes) {
      setListValues(taxList, [
        { label: "Gelir vergisi", value: res.taxes.incomeTax },
        { label: "Dayanışma", value: res.taxes.solidarity },
        { label: "Kilise vergisi", value: res.taxes.church },
        { label: "Toplam", value: res.taxes.total, strong: true }
      ]);
    }

    if (res.social) {
      setListValues(socialList, [
        { label: "Emeklilik", value: res.social.pension },
        { label: "İşsizlik", value: res.social.unemployment },
        { label: "Sağlık", value: res.social.health },
        { label: "Bakım", value: res.social.care },
        { label: "Toplam", value: res.social.total, strong: true }
      ]);
    }
  }

  function setListValues(listEl, rows){
    if (!listEl) return;
    listEl.innerHTML = rows.map(r => `
      <div class="list__row ${r.strong ? "list__row--bold" : ""}">
        <dt>${r.label}</dt>
        <dd>${formatCurrency(r.value || 0)}</dd>
      </div>
    `).join("");
  }

  function formatCurrency(value){
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(value || 0));
  }

  function resetResultUI(){
    netEl.textContent = "—";
    grossEl.textContent = "—";
    deductionsEl.textContent = "—";
    if (taxList) taxList.innerHTML = defaultRows(["Gelir vergisi","Dayanışma","Kilise vergisi","Toplam"]);
    if (socialList) socialList.innerHTML = defaultRows(["Emeklilik","İşsizlik","Sağlık","Bakım","Toplam"]);
  }

  function defaultRows(labels){
    return labels.map((label, idx) => `
      <div class="list__row ${idx === labels.length - 1 ? "list__row--bold" : ""}">
        <dt>${label}</dt><dd>—</dd>
      </div>
    `).join("");
  }
})();
