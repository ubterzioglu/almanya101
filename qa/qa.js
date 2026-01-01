(() => {
  const form = document.getElementById("qaForm");
  const questionEl = document.getElementById("question");
  const countEl = document.getElementById("count");
  const submitBtn = document.getElementById("submitBtn");
  const msgEl = document.getElementById("msg");
  const honeypotEl = document.getElementById("website");

  const MIN_LEN = 10;
  const MAX_LEN = 1500;

  function setMsg(kind, text) {
    msgEl.className = "msg " + (kind === "ok" ? "ok" : "err");
    msgEl.textContent = text;
    msgEl.style.display = "block";
  }

  function clearMsg() {
    msgEl.style.display = "none";
    msgEl.textContent = "";
  }

  function updateCount() {
    const n = (questionEl.value || "").length;
    countEl.textContent = String(n);
  }

  questionEl.addEventListener("input", updateCount);
  updateCount();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg();

    const question = (questionEl.value || "").trim();
    const email = (document.getElementById("email").value || "").trim();
    const name = (document.getElementById("name").value || "").trim();
    const website = (honeypotEl.value || "").trim();

    if (website) {
      // bot
      setMsg("err", "Gönderim başarısız. Lütfen tekrar deneyin.");
      return;
    }

    if (question.length < MIN_LEN) {
      setMsg("err", `Soru en az ${MIN_LEN} karakter olmalı.`);
      return;
    }
    if (question.length > MAX_LEN) {
      setMsg("err", `Soru en fazla ${MAX_LEN} karakter olmalı.`);
      return;
    }

    submitBtn.disabled = true;
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
        setMsg("err", err);
        return;
      }

      setMsg("ok", "Gönderildi. Teşekkürler! Sorun mail olarak ulaştı.");
      form.reset();
      updateCount();
    } catch (err) {
      setMsg("err", "Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Gönder";
    }
  });
})();
