// almanya101 — TR ↔ DE Para Transferi Seçici (15 soru)
// Profil skorları: BANK_SWIFT, TRANSFER_SERVICE, CASH_PICKUP, MULTICURRENCY, BUSINESS, CRYPTO
// Amaç: doğru "kategori"yi seçtirmek (marka bağımsız), sonra kullanıcı sağlayıcılarını kıyaslar.

const PROFILES = {
  BANK_SWIFT: { key: "BANK_SWIFT", title: "Banka Transferi (SWIFT/şube/online)", color: "red" },
  TRANSFER_SERVICE: { key: "TRANSFER_SERVICE", title: "Transfer Servisi (kur+ücret optimize)", color: "" },
  CASH_PICKUP: { key: "CASH_PICKUP", title: "Nakit Teslim / Nakit Yatırma Ağı", color: "red" },
  MULTICURRENCY: { key: "MULTICURRENCY", title: "Çoklu Döviz Hesap (TRY+EUR bakiyeli)", color: "purple" },
  BUSINESS: { key: "BUSINESS", title: "İş/Serbest Transfer (fatura/uyum odaklı)", color: "purple" },
  CRYPTO: { key: "CRYPTO", title: "Kripto (yüksek risk/karmaşıklık)", color: "red" },
};

const QUESTIONS = [
  {
    id: "q1",
    title: "Gönderim yönü hangisi?",
    desc: "Yöntem seçimi iki yönde de benzer olsa da bazı servisler tek yönde daha iyi olabilir.",
    type: "single",
    options: [
      { key: "tr_to_de", label: "Türkiye → Almanya", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 1 } },
      { key: "de_to_tr", label: "Almanya → Türkiye", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 1 } },
      { key: "both", label: "İkisi de (düzenli)", add: { MULTICURRENCY: 3, TRANSFER_SERVICE: 2 } },
    ]
  },
  {
    id: "q2",
    title: "Transfer sıklığın nasıl?",
    desc: "Sık transferlerde “kur farkı + düşük ücret” toplam maliyette daha belirleyici olur.",
    type: "single",
    options: [
      { key: "weekly", label: "Haftalık / çok sık", add: { MULTICURRENCY: 3, TRANSFER_SERVICE: 3 } },
      { key: "monthly", label: "Aylık", add: { TRANSFER_SERVICE: 3, MULTICURRENCY: 2 } },
      { key: "rare", label: "Nadiren", add: { BANK_SWIFT: 2, TRANSFER_SERVICE: 1 } },
    ]
  },
  {
    id: "q3",
    title: "Tutarlar genelde ne seviyede?",
    desc: "Yüksek tutarda bankalar/uyum süreçleri ve limitler daha kritik olabilir.",
    type: "single",
    options: [
      { key: "small", label: "Küçük (örn. < 500€)", add: { TRANSFER_SERVICE: 3, CASH_PICKUP: 1 } },
      { key: "mid", label: "Orta (örn. 500€–3.000€)", add: { TRANSFER_SERVICE: 3, BANK_SWIFT: 1 } },
      { key: "large", label: "Yüksek (örn. > 3.000€)", add: { BANK_SWIFT: 3, BUSINESS: 2 } },
    ]
  },
  {
    id: "q4",
    title: "En kritik şey hangisi?",
    desc: "Birincil hedefini seç: maliyet mi hız mı basitlik mi?",
    type: "single",
    options: [
      { key: "cost", label: "En düşük toplam maliyet", add: { TRANSFER_SERVICE: 4, MULTICURRENCY: 2 } },
      { key: "speed", label: "Hız (aynı gün/ertesi gün)", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 2 } },
      { key: "simplicity", label: "En basit süreç", add: { BANK_SWIFT: 3, TRANSFER_SERVICE: 2 } },
    ]
  },
  {
    id: "q5",
    title: "Alıcı (veya sen) bankaya gitmeden tamamen online olsun istiyor mu?",
    desc: "Tam online kullanım genelde transfer servisleri / çoklu döviz hesaplarda daha rahattır.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 3, MULTICURRENCY: 2 }, no: { BANK_SWIFT: 2, CASH_PICKUP: 2 } }
  },
  {
    id: "q6",
    title: "Alıcının banka hesabı var mı (IBAN)?",
    desc: "IBAN yoksa nakit teslim/ağ çözümleri devreye girebilir.",
    type: "single",
    options: [
      { key: "yes_iban", label: "Evet, IBAN var", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 2, MULTICURRENCY: 1 } },
      { key: "no_iban", label: "Hayır, IBAN yok / kullanmak istemiyor", add: { CASH_PICKUP: 5 } },
      { key: "sometimes", label: "Bazen var bazen yok", add: { CASH_PICKUP: 3, TRANSFER_SERVICE: 2 } },
    ]
  },
  {
    id: "q7",
    title: "Alıcı nakit çekmek/teslim almak istiyor mu?",
    desc: "Nakit teslim opsiyonu isteyenlerde transfer ağı kritik olur.",
    type: "yesno",
    weight: { yes: { CASH_PICKUP: 5 }, no: { TRANSFER_SERVICE: 2, BANK_SWIFT: 2 } }
  },
  {
    id: "q8",
    title: "Kur farkı (spread) senin için çok önemli mi?",
    desc: "Bazı yöntemlerde “gizli maliyet” kur farkında saklı olabilir.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 4, MULTICURRENCY: 2 }, no: { BANK_SWIFT: 1 } }
  },
  {
    id: "q9",
    title: "Belgeler/uyum (kaynak, amaç, fatura) göstermen gerekebilir mi?",
    desc: "Yüksek tutar ve iş transferlerinde bu daha sık görülür.",
    type: "yesno",
    weight: { yes: { BUSINESS: 4, BANK_SWIFT: 2 }, no: { TRANSFER_SERVICE: 1 } }
  },
  {
    id: "q10",
    title: "Gönderimde açıklama/fatura/referans gibi alanlar kritik mi?",
    desc: "İş, kira, eğitim, kurumsal süreçlerde açıklama alanı önemli olabilir.",
    type: "yesno",
    weight: { yes: { BUSINESS: 3, BANK_SWIFT: 2 }, no: { TRANSFER_SERVICE: 1 } }
  },
  {
    id: "q11",
    title: "Aynı gün içinde kesin teslim istiyor musun?",
    desc: "Kesin süre beklentisi varsa hızlı kanallar öne çıkar; SWIFT bazen daha değişken olabilir.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 2, CASH_PICKUP: 1 }, no: { BANK_SWIFT: 1, MULTICURRENCY: 1 } }
  },
  {
    id: "q12",
    title: "Hafta sonu/mesai dışı gönderim yapıyor musun?",
    desc: "Bazı bankalar mesai dışı daha sınırlı çalışabilir.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 2, MULTICURRENCY: 2 }, no: { BANK_SWIFT: 1 } }
  },
  {
    id: "q13",
    title: "Sık sık TRY ve EUR bakiyesi tutuyor musun (maaş+harcama gibi)?",
    desc: "Çoklu döviz hesapları (bakiyeli) bu senaryoda avantajlı olabilir.",
    type: "yesno",
    weight: { yes: { MULTICURRENCY: 5 }, no: { TRANSFER_SERVICE: 1 } }
  },
  {
    id: "q14",
    title: "Kullanım kolaylığı için 'tek uygulama' (hesap+karta kadar) ister misin?",
    desc: "Bazı çözümler kart+hesap+transferi tek yerde toplar.",
    type: "yesno",
    weight: { yes: { MULTICURRENCY: 3, TRANSFER_SERVICE: 2 }, no: { BANK_SWIFT: 1 } }
  },
  {
    id: "q15",
    title: "Kripto kullanmayı düşünüyor musun?",
    desc: "Bu yol daha riskli/karmaşık olabilir; sadece bilinçli kullanıcılar için anlamlıdır.",
    type: "single",
    options: [
      { key: "no", label: "Hayır", add: { TRANSFER_SERVICE: 1, BANK_SWIFT: 1 } },
      { key: "maybe", label: "Belki / emin değilim", add: { CRYPTO: 1 } },
      { key: "yes", label: "Evet (riskleri biliyorum)", add: { CRYPTO: 5 } },
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
  const scores = { BANK_SWIFT:0, TRANSFER_SERVICE:0, CASH_PICKUP:0, MULTICURRENCY:0, BUSINESS:0, CRYPTO:0 };

  for (const q of QUESTIONS){
    const a = state.answers[q.id];
    if (typeof a === "undefined") continue;

    if (q.type === "yesno"){
      const w = q.weight[a] || {};
      for (const k of Object.keys(w)) scores[k] += w[k];
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
  const arr = Object.entries(scores).map(([k,v]) => ({ key:k, score:v, ...PROFILES[k] }));

  // Tie-break preference (genelde güvenli/kolay): TRANSFER_SERVICE > BANK_SWIFT > MULTICURRENCY > BUSINESS > CASH_PICKUP > CRYPTO
  arr.sort((a,b) => {
    if (b.score !== a.score) return b.score - a.score;
    const prio = { TRANSFER_SERVICE: 6, BANK_SWIFT: 5, MULTICURRENCY: 4, BUSINESS: 3, CASH_PICKUP: 2, CRYPTO: 1 };
    return (prio[b.key]||0) - (prio[a.key]||0);
  });

  return arr.slice(0,3);
}

function buildRecommendations(top3, scores){
  const rec = [];
  for (const p of top3){
    const bullets = [];

    if (p.key === "TRANSFER_SERVICE"){
      bullets.push("Genelde ‘toplam maliyet’ (kur + ücret) açısından güçlü olur, özellikle küçük/orta tutarlarda.");
      bullets.push("Online süreç + hızlı teslim seçenekleri bulunabilir.");
      bullets.push("Kontrol et: alıcı ülke/destek, kimlik doğrulama, limitler, iptal/iade politikası.");
    } else if (p.key === "BANK_SWIFT"){
      bullets.push("Yüksek tutar veya resmi açıklama/fatura gereken senaryolarda daha uygun olabilir.");
      bullets.push("Bankadan bankaya ücret ve süre ciddi değişebilir (aracı bankalar dahil olabilir).");
      bullets.push("Kontrol et: SWIFT ücretleri, kur marjı, aracı banka kesintisi, tahmini süre.");
    } else if (p.key === "MULTICURRENCY"){
      bullets.push("TRY ve EUR bakiyesini tutup doğru zamanda dönüştürmek isteyenler için iyi bir model.");
      bullets.push("Düzenli iki yönlü transfer yapanlarda pratikleşir.");
      bullets.push("Kontrol et: hesap/IBAN türleri, kart ücretleri, dönüşüm ücreti, limitler.");
    } else if (p.key === "CASH_PICKUP"){
      bullets.push("Alıcı IBAN istemiyorsa veya nakit teslim gerekiyorsa bu kategori öne çıkar.");
      bullets.push("Şube/ağ erişimi ve teslim noktaları kritik olur.");
      bullets.push("Kontrol et: teslim ağı, kimlik şartları, toplam ücret (kur dahil), çalışma saatleri.");
    } else if (p.key === "BUSINESS"){
      bullets.push("Fatura/referans, uyum (KYC/AML) ve kayıt düzeni önemliyse bu profil uygun.");
      bullets.push("Belgeler istenebileceği için süreç daha ‘resmi’ ilerleyebilir.");
      bullets.push("Kontrol et: ticari kullanım koşulları, belge gereksinimi, limitler, destek.");
    } else if (p.key === "CRYPTO"){
      bullets.push("Bu yol volatilite, vergi/uyum ve platform riskleri nedeniyle karmaşıktır.");
      bullets.push("Sadece riskleri anlayan ve süreçleri yönetebilen kişiler için düşün.");
      bullets.push("Kontrol et: borsa güvenliği, çekim ücretleri, transfer süreleri, vergi/raporlama yükümlülükleri.");
    }

    // Small extra hints
    if (scores.CASH_PICKUP >= 6 && p.key !== "CASH_PICKUP"){
      bullets.push("Alıcı nakit istiyorsa ‘nakit teslim’ opsiyonu olan sağlayıcıları filtrele.");
    }
    if (scores.MULTICURRENCY >= 6 && p.key !== "MULTICURRENCY"){
      bullets.push("Sık çift yön yapıyorsan TRY+EUR bakiyeli model toplam maliyeti düşürebilir.");
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
  lines.push("almanya101 — TR ↔ DE Para Transferi Seçici Sonuç");
  lines.push("------------------------------------------------");
  lines.push("Top 3 Profil:");
  top3.forEach((p, i) => lines.push(`${i+1}) ${p.title} — skor: ${p.score}`));
  lines.push("");
  lines.push("Notlar:");
  lines.push("- Aynı tutar için sağlayıcıların kendi hesaplayıcısında ‘toplam maliyet’i (kur + ücret) karşılaştır.");
  lines.push("- Limit, KYC/uyum, teslim süresi ve iade/iptal koşullarını kontrol et.");
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
