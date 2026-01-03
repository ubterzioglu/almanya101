// almanya101 — Banka Seçici (15 soru)
// Profil skorları: DIGITAL, DIRECT, LOCAL, EXPAT, BUSINESS
// Sonuç: en yüksek 3 profil + kısa kontrol listesi

const PROFILES = {
  DIGITAL: { key: "DIGITAL", title: "Dijital Banka (app-first)", color: "purple" },
  DIRECT: { key: "DIRECT", title: "Direkt Banka (online + sağlam)", color: "" },
  LOCAL: { key: "LOCAL", title: "Yerel Banka (şube + danışman)", color: "red" },
  EXPAT: { key: "EXPAT", title: "Expat/Dil-dostu Bankacılık", color: "purple" },
  BUSINESS: { key: "BUSINESS", title: "İş/Serbest Hesap Odaklı", color: "red" },
};

const QUESTIONS = [
  {
    id: "q1",
    title: "Bankayı tamamen telefondan yönetmek istiyor musun?",
    desc: "Şube, kağıt ve uzun süreçler istemiyorsan dijital/direkt bankalar avantajlı olur.",
    type: "yesno",
    weight: { yes: { DIGITAL: 3, DIRECT: 2 }, no: { LOCAL: 3 } }
  },
  {
    id: "q2",
    title: "Nakit (cash) yatırma ihtiyacın var mı?",
    desc: "Sık nakit yatırıyorsan şube/ATM ağı kritik olur.",
    type: "yesno",
    weight: { yes: { LOCAL: 3 }, no: { DIGITAL: 1, DIRECT: 1 } }
  },
  {
    id: "q3",
    title: "Almanca müşteri hizmeti seni zorlar mı?",
    desc: "İngilizce destek veya daha basit süreçler önemliyse işaretle.",
    type: "yesno",
    weight: { yes: { EXPAT: 3, DIGITAL: 1 }, no: { DIRECT: 1, LOCAL: 1 } }
  },
  {
    id: "q4",
    title: "Sık yurt dışı/Euro dışı harcama yapıyor musun?",
    desc: "FX ücretleri, kart döviz kurları ve yurt dışı kullanım kolaylığı fark yaratır.",
    type: "single",
    options: [
      { key: "often", label: "Evet, sık", add: { DIGITAL: 3, EXPAT: 2 } },
      { key: "sometimes", label: "Ara sıra", add: { DIRECT: 2, DIGITAL: 1 } },
      { key: "rare", label: "Neredeyse hiç", add: { LOCAL: 1, DIRECT: 1 } },
    ]
  },
  {
    id: "q5",
    title: "Hesap açılışı mümkün olduğunca hızlı olsun mu?",
    desc: "Aynı gün/çok hızlı açılış genelde app-first tarafta daha güçlüdür.",
    type: "yesno",
    weight: { yes: { DIGITAL: 3, EXPAT: 1 }, no: { DIRECT: 1, LOCAL: 1 } }
  },
  {
    id: "q6",
    title: "Gelir durumun düzensiz mi? (freelance/kontrat/arasıra)",
    desc: "Hesap modeli, ücretler ve iş hesabı ihtiyacı farklılaşabilir.",
    type: "single",
    options: [
      { key: "yes_business", label: "Evet, serbest/iş hesabı gerekebilir", add: { BUSINESS: 4, DIRECT: 1 } },
      { key: "mixed", label: "Kısmen düzensiz", add: { BUSINESS: 2, DIGITAL: 1 } },
      { key: "no", label: "Hayır, düzenli maaş", add: { DIRECT: 2, LOCAL: 1 } },
    ]
  },
  {
    id: "q7",
    title: "Ortak hesap (joint account) ihtiyacın var mı?",
    desc: "Bazı dijital bankalarda seçenekler kısıtlı olabilir.",
    type: "yesno",
    weight: { yes: { DIRECT: 2, LOCAL: 2 }, no: { DIGITAL: 1 } }
  },
  {
    id: "q8",
    title: "Kağıt posta/ekstre yerine dijital bildirim tercih eder misin?",
    desc: "Her şeyi push/email ile takip etmek istiyorsan bu puan kazandırır.",
    type: "yesno",
    weight: { yes: { DIGITAL: 2, DIRECT: 1 }, no: { LOCAL: 2 } }
  },
  {
    id: "q9",
    title: "Maaş hesabı gibi 'ana banka' mı arıyorsun, yoksa ikinci hesap mı?",
    desc: "Ana banka daha 'stabil + ürün çeşitliliği' isteyebilir.",
    type: "single",
    options: [
      { key: "main", label: "Ana banka (maaş, faturalar, her şey)", add: { DIRECT: 3, LOCAL: 2 } },
      { key: "secondary", label: "İkinci hesap (harcama/seyahat)", add: { DIGITAL: 3, EXPAT: 1 } },
      { key: "both", label: "İkisi de (kombin)", add: { DIRECT: 2, DIGITAL: 2 } },
    ]
  },
  {
    id: "q10",
    title: "Kredi/overdraft (Dispo) gibi ürünlere yakın zamanda ihtiyaç olabilir mi?",
    desc: "Kredi süreçleri ve koşullar bankadan bankaya ciddi değişebilir.",
    type: "yesno",
    weight: { yes: { DIRECT: 3, LOCAL: 2 }, no: { DIGITAL: 1 } }
  },
  {
    id: "q11",
    title: "Şubeye gidip danışmanla konuşmak senin için değerli mi?",
    desc: "Birebir destek istiyorsan yerel banka öne çıkar.",
    type: "yesno",
    weight: { yes: { LOCAL: 4 }, no: { DIGITAL: 2, DIRECT: 1 } }
  },
  {
    id: "q12",
    title: "Nakit çekimi senin için ne kadar kritik?",
    desc: "ATM ağı ve ücret politikaları önemli olabilir.",
    type: "single",
    options: [
      { key: "very", label: "Çok kritik (sık çekim)", add: { LOCAL: 3, DIRECT: 2 } },
      { key: "normal", label: "Normal (ara sıra)", add: { DIRECT: 2, DIGITAL: 1 } },
      { key: "low", label: "Düşük (nadiren)", add: { DIGITAL: 2 } },
    ]
  },
  {
    id: "q13",
    title: "Harcama takibi / kategoriler / bütçe araçları ister misin?",
    desc: "Uygulama içi analiz isteyenlere dijital bankalar iyi gelir.",
    type: "yesno",
    weight: { yes: { DIGITAL: 3 }, no: { DIRECT: 1, LOCAL: 1 } }
  },
  {
    id: "q14",
    title: "Kimlik doğrulama için video-ident gibi dijital sürece rahat mısın?",
    desc: "Bazı bankalar tamamen dijital kimlik doğrulama ister.",
    type: "single",
    options: [
      { key: "ok", label: "Rahatım", add: { DIGITAL: 2, DIRECT: 1 } },
      { key: "maybe", label: "Emin değilim", add: { DIRECT: 1, LOCAL: 1, EXPAT: 1 } },
      { key: "no", label: "Şubeden yapmak isterim", add: { LOCAL: 3 } },
    ]
  },
  {
    id: "q15",
    title: "Ücret hassasiyetin ne düzeyde?",
    desc: "Aylık hesap ücreti, kart ücreti, ATM ücretleri gibi kalemleri düşün.",
    type: "single",
    options: [
      { key: "high", label: "Çok hassasım (minimum ücret)", add: { DIRECT: 3, DIGITAL: 2 } },
      { key: "mid", label: "Orta", add: { DIRECT: 2, LOCAL: 1 } },
      { key: "low", label: "Çok değil", add: { LOCAL: 2 } },
    ]
  },
];

const state = { index: 0, answers: {} };

const el = {
  qTitle: document.getElementById("qTitle"),
  qDesc: document.getElementById("qDesc"),
  answers: document.getElementById("answers"),
  backBtn: document.getElementById("backBtn"),
  nextBtn: document.getElementById("nextBtn"),
  editBtn: document.getElementById("editBtn"),
  restartBtn: document.getElementById("restartBtn"),
  resultCard: document.getElementById("resultCard"),
  resultBoxes: document.getElementById("resultBoxes"),
  progressText: document.getElementById("progressText"),
  progressBar: document.getElementById("progressBar"),
  copyBtn: document.getElementById("copyBtn"),
  hintText: document.getElementById("hintText"),
};

function init(){
  bindEvents();
  render();
}

function bindEvents(){
  el.backBtn.addEventListener("click", () => {
    if (state.index > 0){
      state.index--;
      render();
    }
  });

  el.nextBtn.addEventListener("click", () => {
    if (!hasAnswerForCurrent()) return;

    if (state.index < QUESTIONS.length - 1){
      state.index++;
      render();
      return;
    }
    showResult();
  });

  el.editBtn.addEventListener("click", () => {
    el.resultCard.classList.add("hidden");
    render();
  });

  el.restartBtn.addEventListener("click", resetAll);

  el.copyBtn.addEventListener("click", async () => {
    const text = buildCopyText();
    try{
      await navigator.clipboard.writeText(text);
      el.copyBtn.textContent = "Kopyalandı";
      setTimeout(() => (el.copyBtn.textContent = "Sonucu kopyala"), 1200);
    } catch {
      alert("Kopyalama başarısız. Tarayıcı izinlerini kontrol et.");
    }
  });
}

function resetAll(){
  state.index = 0;
  state.answers = {};
  el.resultCard.classList.add("hidden");
  el.copyBtn.textContent = "Sonucu kopyala";
  render();
}

function render(){
  el.resultCard.classList.add("hidden");

  const q = QUESTIONS[state.index];
  el.qTitle.textContent = q.title;
  el.qDesc.textContent = q.desc || "";

  renderAnswers(q);
  renderNav();
  renderProgress();
}

function renderAnswers(q){
  el.answers.innerHTML = "";

  const selected = state.answers[q.id];

  if (q.type === "yesno"){
    const opts = [
      { key: "yes", label: "Evet", desc: "Bana uyuyor." },
      { key: "no", label: "Hayır", desc: "Bana uymuyor." },
    ];
    opts.forEach((o, i) => el.answers.appendChild(answerCard(q, o, i+1, selected === o.key)));
    return;
  }

  if (q.type === "single"){
    q.options.forEach((o, i) => el.answers.appendChild(answerCard(q, o, i+1, selected === o.key)));
    return;
  }
}

function answerCard(q, option, badge, isSelected){
  const wrap = document.createElement("div");
  wrap.className = `answer ${isSelected ? "selected" : ""}`;
  wrap.setAttribute("role", "button");
  wrap.setAttribute("tabindex", "0");

  wrap.innerHTML = `
    <div class="badge">${badge}</div>
    <div>
      <div class="answer-title">${option.label}</div>
      ${option.desc ? `<p class="answer-desc">${option.desc}</p>` : ``}
    </div>
  `;

  const select = () => {
    state.answers[q.id] = option.key;
    render();
  };

  wrap.addEventListener("click", select);
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      select();
    }
  });

  return wrap;
}

function renderNav(){
  el.backBtn.disabled = state.index === 0;
  el.nextBtn.disabled = !hasAnswerForCurrent();

  const isLast = state.index === QUESTIONS.length - 1;
  el.nextBtn.textContent = isLast ? "Sonucu gör" : "Devam";
  el.hintText.textContent = isLast ? "Son sorudasın." : "";
}

function renderProgress(){
  const current = state.index + 1;
  const total = QUESTIONS.length;
  el.progressText.textContent = `Soru ${current} / ${total}`;
  el.progressBar.style.width = `${Math.round((current / total) * 100)}%`;
}

function hasAnswerForCurrent(){
  const q = QUESTIONS[state.index];
  return typeof state.answers[q.id] !== "undefined";
}

function computeScores(){
  const scores = { DIGITAL:0, DIRECT:0, LOCAL:0, EXPAT:0, BUSINESS:0 };

  for (const q of QUESTIONS){
    const a = state.answers[q.id];
    if (typeof a === "undefined") continue;

    if (q.type === "yesno"){
      const w = q.weight[a];
      for (const k of Object.keys(w || {})) scores[k] += w[k];
      continue;
    }

    if (q.type === "single"){
      const opt = q.options.find(o => o.key === a);
      const add = opt?.add || {};
      for (const k of Object.keys(add)) scores[k] += add[k];
      continue;
    }
  }
  return scores;
}

function pickTop3(scores){
  const arr = Object.entries(scores)
    .map(([k,v]) => ({ key:k, score:v, ...PROFILES[k] }));

  arr.sort((a,b) => {
    if (b.score !== a.score) return b.score - a.score;
    const prio = { DIRECT:5, LOCAL:4, DIGITAL:3, EXPAT:2, BUSINESS:1 };
    return (prio[b.key]||0) - (prio[a.key]||0);
  });

  return arr.slice(0,3);
}

function buildRecommendations(top3, scores){
  const rec = [];
  for (const p of top3){
    const bullets = [];

    if (p.key === "DIGITAL"){
      bullets.push("App üzerinden hızlı hesap açma ve günlük kullanım kolaylığı.");
      bullets.push("Kartla harcama + bütçe/analiz özellikleri genelde güçlü.");
      bullets.push("Kontrol et: nakit yatırma seçenekleri, destek dili, ücretler.");
    } else if (p.key === "DIRECT"){
      bullets.push("Online odaklı ama daha ‘ana banka’ kullanımına uygun yapı.");
      bullets.push("Kredi/Dispo ve ürün çeşitliliği ihtimali olanlara iyi gelir.");
      bullets.push("Kontrol et: aylık ücret koşulları, ATM/çekim politikası, kimlik doğrulama.");
    } else if (p.key === "LOCAL"){
      bullets.push("Şube erişimi ve yüz yüze destek arayanlar için ideal.");
      bullets.push("Nakit yatırma/çekme ve yerel ağ avantajı olabilir.");
      bullets.push("Kontrol et: hesap ücreti, kart ücretleri, randevu/şube yoğunluğu.");
    } else if (p.key === "EXPAT"){
      bullets.push("Dil bariyeri olanlar için daha rahat onboarding ve destek.");
      bullets.push("Yurt dışı harcamalar/transferler senaryosunda daha konforlu olabilir.");
      bullets.push("Kontrol et: destek dili kapsamı, ücretler, limitler, doğrulama süreçleri.");
    } else if (p.key === "BUSINESS"){
      bullets.push("Serbest/iş amaçlı işlemlerde ayrı hesap ve kayıt düzeni sağlar.");
      bullets.push("Fatura/transfer/raporlama ihtiyaçları daha iyi karşılanabilir.");
      bullets.push("Kontrol et: ticari hesap ücretleri, işlem başı masraflar, muhasebe uyumu.");
    }

    if (scores.LOCAL >= 6 && p.key !== "LOCAL"){
      bullets.push("Nakit/şube ihtiyacın yüksek görünüyor: hibrit kullanım (ana banka + dijital ikinci hesap) düşünebilirsin.");
    }
    if (scores.DIGITAL >= 6 && p.key !== "DIGITAL"){
      bullets.push("App-first beklentin yüksek: kart/uygulama deneyimi kıyasını özellikle yap.");
    }

    rec.push({ profile:p, bullets });
  }
  return rec;
}

function showResult(){
  const scores = computeScores();
  const top3 = pickTop3(scores);
  const recs = buildRecommendations(top3, scores);

  el.resultBoxes.innerHTML = "";

  recs.forEach((r, idx) => {
    const box = document.createElement("div");
    box.className = "result-box";

    const tagClass = r.profile.color ? `tag ${r.profile.color}` : "tag";
    box.innerHTML = `
      <div class="${tagClass}">
        <span class="dot"></span>
        <span>#${idx+1} • ${r.profile.title}</span>
      </div>
      <h3>Uygunluk Skoru: ${r.profile.score}</h3>
      <ul>
        ${r.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
      </ul>
    `;

    el.resultBoxes.appendChild(box);
  });

  el.resultCard.classList.remove("hidden");
  el.resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildCopyText(){
  const scores = computeScores();
  const top3 = pickTop3(scores);
  const lines = [];
  lines.push("almanya101 — Banka Seçici Sonuç");
  lines.push("--------------------------------");
  lines.push("Top 3 Profil:");
  top3.forEach((p, i) => lines.push(`${i+1}) ${p.title} — skor: ${p.score}`));
  lines.push("");
  lines.push("Notlar:");
  lines.push("- Ücretler (hesap/kart/ATM), nakit yatırma, destek dili, doğrulama, kredi/Dispo koşullarını bankanın kendi sayfasından kontrol et.");
  lines.push("");
  lines.push("Cevaplar:");
  for (const q of QUESTIONS){
    const a = state.answers[q.id];
    if (typeof a === "undefined") continue;
    let label = a;
    if (q.type === "yesno") label = (a === "yes" ? "Evet" : "Hayır");
    if (q.type === "single") label = q.options.find(o => o.key === a)?.label || a;
    lines.push(`- ${q.title} → ${label}`);
  }
  return lines.join("\n");
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

init();
