// almanya101 — Sigorta Prioritizer (15 soru)
// Çıktı: 3 katman (Önce Al / Güçlü Öneri / Opsiyonel)
// NOT: Bilgilendirme amaçlı. Kişisel durum ve mevzuat detayları değişebilir.

const QUESTIONS = [
  {
    id: "q1",
    title: "Almanya’da ikamet edeceksin ve resmi kayıt (Anmeldung) yapacak mısın?",
    desc: "Genel sistemlere giriş için ikamet ve kayıt süreçleri çoğu senaryoda temel kabul edilir.",
    type: "yesno",
    weight: { yes: { HEALTH: 3 }, no: { HEALTH: 1 } }
  },
  {
    id: "q2",
    title: "Çalışan mısın? (tam zamanlı/yarı zamanlı/mini-job dışı düzenli iş)",
    desc: "Çalışma şekli bazı sigorta kararlarını etkiler.",
    type: "single",
    options: [
      { key: "employee", label: "Evet, çalışanım", add: { HEALTH: 2, LIABILITY: 2, LEGAL: 1, BU: 2 } },
      { key: "self", label: "Serbest/şirket (freelance)", add: { HEALTH: 2, LIABILITY: 2, LEGAL: 2, BU: 3 } },
      { key: "student", label: "Öğrenciyim", add: { HEALTH: 2, LIABILITY: 3 } },
      { key: "other", label: "Diğer/şu an çalışmıyorum", add: { HEALTH: 2, LIABILITY: 2 } },
    ]
  },
  {
    id: "q3",
    title: "Aileni (eş/çocuk) da kapsayan bir yapı gerekir mi?",
    desc: "Aile durumu bazı poliçe tercihlerini değiştirir.",
    type: "yesno",
    weight: { yes: { HEALTH: 2, LIFE: 2, HOUSEHOLD: 1 }, no: { BU: 1 } }
  },
  {
    id: "q4",
    title: "Araba kullanıyor musun veya Almanya’da araba almayı planlıyor musun?",
    desc: "Araç varsa sigorta tarafı farklı bir “zorunlu” kalem doğurabilir.",
    type: "yesno",
    weight: { yes: { CAR: 5 }, no: { CAR: -2 } }
  },
  {
    id: "q5",
    title: "Evde pahalı eşyaların var mı? (laptop/TV/kamera, vs.)",
    desc: "Hırsızlık/yangın/su basması gibi riskler değerlendirilir.",
    type: "yesno",
    weight: { yes: { HOUSEHOLD: 3 }, no: { HOUSEHOLD: 1 } }
  },
  {
    id: "q6",
    title: "Kiracı mısın, ev sahibi mi olacaksın?",
    desc: "Ev sahipliği bazı ek sigorta türlerini gündeme getirir.",
    type: "single",
    options: [
      { key: "rent", label: "Kiracı", add: { HOUSEHOLD: 2, LIABILITY: 1 } },
      { key: "own", label: "Ev sahibi", add: { BUILDING: 5, LIABILITY: 1, HOUSEHOLD: 2 } },
      { key: "not_sure", label: "Henüz belli değil", add: { HOUSEHOLD: 1 } },
    ]
  },
  {
    id: "q7",
    title: "Çocukların var mı?",
    desc: "Aile riskleri ve gelir güvenliği daha kritik hale gelebilir.",
    type: "yesno",
    weight: { yes: { LIFE: 3, BU: 2, HEALTH: 1 }, no: { LIABILITY: 1 } }
  },
  {
    id: "q8",
    title: "Düzenli olarak bisiklet/e-scooter kullanıyor musun?",
    desc: "Günlük şehir içi kullanımda üçüncü şahıs zararları önemli olabilir.",
    type: "yesno",
    weight: { yes: { LIABILITY: 2, ACCIDENT: 1 }, no: { ACCIDENT: 0 } }
  },
  {
    id: "q9",
    title: "Sık seyahat ediyor musun? (AB içi/dışı)",
    desc: "Seyahat sağlık ekleri ve iptal gibi konular ancak bazı senaryolarda anlamlıdır.",
    type: "single",
    options: [
      { key: "often", label: "Evet, sık", add: { TRAVEL: 4 } },
      { key: "sometimes", label: "Ara sıra", add: { TRAVEL: 2 } },
      { key: "rare", label: "Nadiren", add: { TRAVEL: 0 } },
    ]
  },
  {
    id: "q10",
    title: "Bir hata yapıp başkasına zarar verme riskin yüksek mi? (çocuk, evcil hayvan, yoğun sosyal hayat)",
    desc: "Örneğin birine maddi/bedeni zarar verme gibi riskler.",
    type: "yesno",
    weight: { yes: { LIABILITY: 4 }, no: { LIABILITY: 2 } }
  },
  {
    id: "q11",
    title: "Gelirin kesilmesi seni ciddi zorlar mı? (tek gelir, az birikim, kredi/taahhüt)",
    desc: "Çalışamaz hale gelme gibi senaryolarda “gelir koruma” daha anlamlı hale gelebilir.",
    type: "yesno",
    weight: { yes: { BU: 5 }, no: { BU: 1 } }
  },
  {
    id: "q12",
    title: "Hukuki ihtilaf yaşama ihtimalin var mı? (iş/ev/komşu/taşınma)",
    desc: "Kiracı-ev sahibi, iş sözleşmesi, tüketici anlaşmazlıkları gibi.",
    type: "yesno",
    weight: { yes: { LEGAL: 4 }, no: { LEGAL: 1 } }
  },
  {
    id: "q13",
    title: "Diş masrafları seni düşündürüyor mu? (ortodonti, implant, vb.)",
    desc: "Tamamlayıcı diş sigortası bazı kişilerde anlamlı olabilir.",
    type: "yesno",
    weight: { yes: { DENTAL: 4 }, no: { DENTAL: 0 } }
  },
  {
    id: "q14",
    title: "Riskli/hobisel aktivitelerin var mı? (dağ sporu, motor, ekstrem spor)",
    desc: "Kaza ihtimali artıyorsa kaza sigortası öne çıkabilir.",
    type: "yesno",
    weight: { yes: { ACCIDENT: 4 }, no: { ACCIDENT: 1 } }
  },
  {
    id: "q15",
    title: "Evcil hayvanın var mı? (özellikle köpek)",
    desc: "Bazı hayvanlarda üçüncü şahıs riski artar.",
    type: "single",
    options: [
      { key: "dog", label: "Köpek", add: { PET_LIAB: 5 } },
      { key: "cat", label: "Kedi", add: { PET_LIAB: 1 } },
      { key: "none", label: "Yok", add: { PET_LIAB: 0 } },
    ]
  },
];

// Sigorta “kalemleri”
const INS = {
  HEALTH: {
    key: "HEALTH",
    title: "Sağlık Sigortası (Krankenversicherung)",
    base: 10,
    mustAt: 12,
    shouldAt: 9,
    reasons: [
      "Almanya’da sağlık sigortası çoğu senaryoda temel/olmazsa olmazdır.",
      "Kapsam türü (GKV/PKV) iş durumu ve gelire göre değişebilir.",
      "Kontrol et: GKV/PKV uygunluğu, aile kapsamı, ek katkılar, bekleme/şartlar."
    ]
  },
  LIABILITY: {
    key: "LIABILITY",
    title: "Özel Sorumluluk (Privathaftpflicht)",
    base: 8,
    mustAt: 11,
    shouldAt: 8,
    reasons: [
      "Üçüncü kişiye verilen maddi/bedeni zararlar çok pahalıya çıkabilir.",
      "Günlük hayatta en çok ‘fayda/ücret’ oranı yüksek kalemlerden biridir.",
      "Kontrol et: teminat limiti, aile kapsamı, anahtar kaybı gibi ekler."
    ]
  },
  CAR: {
    key: "CAR",
    title: "Araç Sigortası (Kfz-Haftpflicht + opsiyonel kasko)",
    base: 0,
    mustAt: 5,
    shouldAt: 3,
    reasons: [
      "Araç varsa trafik sorumluluk sigortası çoğu durumda zorunlu kabul edilir.",
      "Kasko ihtiyacı aracın değeri ve risk iştahına göre değişir.",
      "Kontrol et: sınıf/prim, hasarsızlık indirimi, kasko kapsamı."
    ]
  },
  HOUSEHOLD: {
    key: "HOUSEHOLD",
    title: "Ev Eşyası (Hausrat)",
    base: 2,
    mustAt: 8,
    shouldAt: 5,
    reasons: [
      "Hırsızlık/yangın/su gibi risklerde eşyayı korumaya yarar.",
      "Pahalı eşyalar ve kiracılık senaryosunda daha anlamlı hale gelebilir.",
      "Kontrol et: teminat tutarı, bisiklet kapsamı, muafiyet."
    ]
  },
  LEGAL: {
    key: "LEGAL",
    title: "Hukuk Koruma (Rechtsschutz)",
    base: 1,
    mustAt: 9,
    shouldAt: 5,
    reasons: [
      "İş/ev/taşınma dönemlerinde ihtilaf çıkarsa masrafları azaltabilir.",
      "Kapsam paketleri (iş, kira, trafik) ayrı ayrı değerlidir.",
      "Kontrol et: bekleme süresi, kapsam dışı haller, limitler."
    ]
  },
  BU: {
    key: "BU",
    title: "Çalışamazlık / Gelir Koruma (Berufsunfähigkeit)",
    base: 1,
    mustAt: 10,
    shouldAt: 6,
    reasons: [
      "Gelir kesilmesi seni zorluyorsa güçlü bir “risk yönetimi” kalemidir.",
      "Primler yaş, meslek ve sağlık beyanlarına göre değişir.",
      "Kontrol et: tanım (BU), aylık ödeme, beyan/sağlık şartları."
    ]
  },
  LIFE: {
    key: "LIFE",
    title: "Risk Hayat (Risikolebensversicherung)",
    base: 0,
    mustAt: 8,
    shouldAt: 4,
    reasons: [
      "Bakmakla yükümlü olunan kişiler varsa gelir kaybı riskini yönetir.",
      "Mortgage/uzun vadeli taahhütlerde anlamı artar.",
      "Kontrol et: teminat süresi, lehtar, prim/sağlık beyanı."
    ]
  },
  DENTAL: {
    key: "DENTAL",
    title: "Diş Tamamlayıcı (Zahnzusatz)",
    base: 0,
    mustAt: 7,
    shouldAt: 4,
    reasons: [
      "Diş işlemleri pahalı olabilir; beklentin yüksekse değerlendirilebilir.",
      "Kapsam ve bekleme süreleri poliçeye göre değişir.",
      "Kontrol et: bekleme süresi, yıllık limitler, kapsam oranları."
    ]
  },
  ACCIDENT: {
    key: "ACCIDENT",
    title: "Kaza Sigortası (Unfallversicherung)",
    base: 0,
    mustAt: 7,
    shouldAt: 4,
    reasons: [
      "Riskli aktivite/yoğun hareket varsa ek koruma sağlar.",
      "Kaza tanımı ve ödeme şartları ürün bazında farklıdır.",
      "Kontrol et: kaza tanımı, sürekli sakatlık teminatı, kapsam dışıları."
    ]
  },
  TRAVEL: {
    key: "TRAVEL",
    title: "Seyahat Sağlık (Auslandsreise-KV) / İptal (opsiyonel)",
    base: 0,
    mustAt: 7,
    shouldAt: 3,
    reasons: [
      "Sık yurt dışı seyahatinde acil sağlık masrafını yönetebilir.",
      "İptal sigortası sadece belirli senaryolarda mantıklıdır.",
      "Kontrol et: ülke kapsamı, azami süre, muafiyetler."
    ]
  },
  BUILDING: {
    key: "BUILDING",
    title: "Konut Bina (Wohngebäude) — ev sahibiysen",
    base: 0,
    mustAt: 7,
    shouldAt: 3,
    reasons: [
      "Ev sahibiysen bina riskleri (yangın/su/ fırtına) önemli olabilir.",
      "Kredi veren kuruluş koşul koyabilir (duruma göre).",
      "Kontrol et: kapsam (Elementar dahil mi), muafiyet, yeniden yapım değeri."
    ]
  },
  PET_LIAB: {
    key: "PET_LIAB",
    title: "Evcil Hayvan Sorumluluk (Tierhalterhaftpflicht) — özellikle köpek",
    base: 0,
    mustAt: 7,
    shouldAt: 2,
    reasons: [
      "Köpek gibi hayvanlarda üçüncü şahıs riski artabilir.",
      "Kapsam hayvan türüne ve koşullara göre değişir.",
      "Kontrol et: teminat limiti, ırk/koşul istisnaları, aile kapsamı."
    ]
  }
};

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
  qaCard: document.getElementById("qaCard"),
  progressText: document.getElementById("progressText"),
  progressBar: document.getElementById("progressBar"),
  copyBtn: document.getElementById("copyBtn"),
  hintText: document.getElementById("hintText"),
  tierMust: document.getElementById("tierMust"),
  tierShould: document.getElementById("tierShould"),
  tierNice: document.getElementById("tierNice"),
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
    el.qaCard.classList.remove("hidden");
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
  el.qaCard.classList.remove("hidden");
  el.copyBtn.textContent = "Sonucu kopyala";
  render();
}

function render(){
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
      { key: "yes", label: "Evet", desc: "Bu durum bende var." },
      { key: "no", label: "Hayır", desc: "Bu durum bende yok." },
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
  const scores = {};
  Object.keys(INS).forEach(k => scores[k] = INS[k].base || 0);

  for (const q of QUESTIONS){
    const a = state.answers[q.id];
    if (typeof a === "undefined") continue;

    if (q.type === "yesno"){
      const add = q.weight[a] || {};
      for (const k of Object.keys(add)){
        scores[k] = (scores[k] || 0) + add[k];
      }
      continue;
    }

    if (q.type === "single"){
      const opt = q.options.find(o => o.key === a);
      const add = opt?.add || {};
      for (const k of Object.keys(add)){
        scores[k] = (scores[k] || 0) + add[k];
      }
      continue;
    }
  }

  return scores;
}

function classify(scores){
  const must = [];
  const should = [];
  const nice = [];

  for (const key of Object.keys(INS)){
    const item = INS[key];
    const s = scores[key] || 0;

    if (key === "HEALTH"){
      must.push({ ...item, score: s });
      continue;
    }

    if (s >= item.mustAt) must.push({ ...item, score: s });
    else if (s >= item.shouldAt) should.push({ ...item, score: s });
    else nice.push({ ...item, score: s });
  }

  const sortDesc = (a,b) => b.score - a.score;

  must.sort(sortDesc);
  should.sort(sortDesc);
  nice.sort(sortDesc);

  nice.sort((a,b) => (b.score - a.score));

  return { must, should, nice };
}

function renderTier(container, items){
  container.innerHTML = "";
  if (!items.length){
    container.innerHTML = `<div class="item"><h3>—</h3><ul><li>Bu katmanda öneri çıkmadı.</li></ul></div>`;
    return;
  }

  items.forEach(it => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <h3>${escapeHtml(it.title)} <span class="muted">• skor: ${it.score}</span></h3>
      <ul>
        ${it.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join("")}
      </ul>
    `;
    container.appendChild(div);
  });
}

function showResult(){
  const scores = computeScores();
  const { must, should, nice } = classify(scores);

  renderTier(el.tierMust, must);
  renderTier(el.tierShould, should);
  renderTier(el.tierNice, nice);

  el.qaCard.classList.add("hidden");
  el.resultCard.classList.remove("hidden");
  el.resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildCopyText(){
  const scores = computeScores();
  const { must, should, nice } = classify(scores);

  const lines = [];
  lines.push("almanya101 — Sigorta Prioritizer Sonuç");
  lines.push("--------------------------------------");
  lines.push("ÖNCE AL:");
  must.forEach(x => lines.push(`- ${x.title} (skor: ${x.score})`));
  lines.push("");
  lines.push("GÜÇLÜ ÖNERİ:");
  should.forEach(x => lines.push(`- ${x.title} (skor: ${x.score})`));
  lines.push("");
  lines.push("OPSİYONEL:");
  nice.forEach(x => lines.push(`- ${x.title} (skor: ${x.score})`));
  lines.push("");
  lines.push("Cevaplar:");
  for (const q of QUESTIONS){
    const a = state.answers[q.id];
    if (typeof a === "undefined") continue;

    let label = a;
    if (q.type === "yesno") label = (a === "yes" ? "Evet" : "Hayır");
    if (q.type === "single"){
      label = q.options.find(o => o.key === a)?.label || a;
    }
    lines.push(`- ${q.title} → ${label}`);
  }
  lines.push("");
  lines.push("Not: Bu çıktı bilgilendirme amaçlıdır; sözleşme öncesi kapsam/şartları kontrol et.");

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
