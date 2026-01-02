(() => {
  // ---------- CONFIG ----------
  const SUPABASE_URL = "https://ldptefnpiudquipdsezr.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHRlZm5waXVkcXVpcGRzZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTg5MDYsImV4cCI6MjA4MjYzNDkwNn0.SjeCmVUhEWpPxkGojaGh6qSOwr8EbZx1Tq_ntpvaLnc";

  const MIN_LEN = 10;
  const MAX_LEN = 1500;

  // ---------- HELPERS ----------
  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setMsg(msgEl, kind, text) {
    if (!msgEl) return;
    msgEl.className = "msg " + (kind === "ok" ? "ok" : "err");
    msgEl.textContent = text;
    msgEl.style.display = "block";
  }

  function clearMsg(msgEl) {
    if (!msgEl) return;
    msgEl.style.display = "none";
    msgEl.textContent = "";
  }

  // ---------- FORM (mail to /api/qa-ask) ----------
  function initForm() {
    const form = $("qaForm");
    if (!form) return; // sayfada form yoksa çalıştırma

    const questionEl = $("question");
    const countEl = $("count");
    const submitBtn = $("submitBtn");
    const msgEl = $("msg");
    const honeypotEl = $("website");
    const emailEl = $("email");
    const nameEl = $("name");

    if (!questionEl || !countEl || !submitBtn || !msgEl || !honeypotEl) {
      // form markup eksikse sessizce çık
      return;
    }

    function updateCount() {
      const n = (questionEl.value || "").length;
      countEl.textContent = String(n);
    }

    questionEl.addEventListener("input", updateCount);
    updateCount();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearMsg(msgEl);

      const question = (questionEl.value || "").trim();
      const email = (emailEl?.value || "").trim();
      const name = (nameEl?.value || "").trim();
      const website = (honeypotEl.value || "").trim();

      if (website) {
        setMsg(msgEl, "err", "Gönderim başarısız. Lütfen tekrar deneyin.");
        return;
      }

      if (question.length < MIN_LEN) {
        setMsg(msgEl, "err", `Soru en az ${MIN_LEN} karakter olmalı.`);
        return;
      }
      if (question.length > MAX_LEN) {
        setMsg(msgEl, "err", `Soru en fazla ${MAX_LEN} karakter olmalı.`);
        return;
      }

      submitBtn.disabled = true;
      const oldText = submitBtn.textContent;
      submitBtn.textContent = "Gönderiliyor...";

      try {
        const res = await fetch("/api/qa-ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, email, name })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const err = data?.error || "Bir hata oluştu. Lütfen tekrar deneyin.";
          setMsg(msgEl, "err", err);
          return;
        }

        setMsg(msgEl, "ok", "Gönderildi. Teşekkürler! Sorun mail olarak ulaştı.");
        form.reset();
        updateCount();
      } catch {
        setMsg(msgEl, "err", "Bağlantı hatası. Lütfen tekrar deneyin.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = oldText || "Gönder";
      }
    });
  }

  // ---------- QA LIST (read from Supabase) ----------
  async function loadQA() {
    const container = $("qa-list");
    if (!container) return; // list container yoksa çalıştırma

    // küçük bir loading durumu
    container.innerHTML = `<div class="qa-item"><p>Yükleniyor...</p></div>`;

    try {
      const url =
        `${SUPABASE_URL}/rest/v1/qa1` +
        `?select=topic,subtopic,question,answer,slug` +
        `&is_published=eq.true` +
        `&order=created_at.desc`;

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        container.innerHTML = "";
        container.insertAdjacentHTML(
          "beforeend",
          `<div class="qa-item"><p>Liste yüklenemedi. (${res.status})</p><small>${escapeHtml(txt)}</small></div>`
        );
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<div class="qa-item"><p>Henüz yayınlanmış soru yok.</p></div>`;
        return;
      }

      renderQA(container, data);
    } catch {
      container.innerHTML = `<div class="qa-item"><p>Bağlantı hatası. Lütfen sayfayı yenileyin.</p></div>`;
    }
  }

  function renderQA(container, items) {
    container.innerHTML = "";

    items.forEach((q) => {
      const slug = (q.slug || "").trim();
      const topic = (q.topic || "").trim();
      const subtopic = (q.subtopic || "").trim();

      const div = document.createElement("div");
      div.className = "qa-item";
      if (slug) div.id = slug;

      div.innerHTML = `
        <h3>${escapeHtml(q.question)}</h3>
        <p>${escapeHtml(q.answer)}</p>
        <small>${escapeHtml(topic)}${subtopic ? " / " + escapeHtml(subtopic) : ""}</small>
      `;

      container.appendChild(div);
    });
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    initForm();
    loadQA();
  });
})();
