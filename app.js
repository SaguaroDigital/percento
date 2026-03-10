// ── LANGUAGE STRINGS ──────────────────────────────────────
const LANG = {
  en: {
    c1q:      "What is",
    c1of:     "percent of",
    c1end:    "?",
    c2is:     "is what percent of",
    c2end:    "?",
    c3from:   "Percent change from",
    c3to:     "to",
    c3end:    "?",
    copy:     "Copy",
    copied:   "Copied!",
    whatsapp: "WhatsApp",
    history:  "Recent Calculations",
    clear:    "Clear",
    tagline:  "Calculate any percentage in seconds.",
    calculate:"Calculate",
    increase: "increase",
    decrease: "decrease",
    nochange: "no change",
  },
  es: {
    c1q:      "¿Cuánto es",
    c1of:     "por ciento de",
    c1end:    "?",
    c2is:     "es qué por ciento de",
    c2end:    "?",
    c3from:   "Cambio porcentual de",
    c3to:     "a",
    c3end:    "?",
    copy:     "Copiar",
    copied:   "¡Copiado!",
    whatsapp: "WhatsApp",
    history:  "Cálculos Recientes",
    clear:    "Borrar",
    tagline:  "Calcula cualquier porcentaje en segundos",
    calculate:"Calcular",
    increase: "aumento",
    decrease: "disminución",
    nochange: "sin cambio",
  }
};
  
  // ── STATE ─────────────────────────────────────────────────
  let currentLang = "en";
  let history = JSON.parse(localStorage.getItem("percento_history")) || [];
  
  // ── UTILITY: round nicely ─────────────────────────────────
  function round(val) {
    return Math.round(val * 10000) / 10000;
  }
  
  // ── UTILITY: save history ─────────────────────────────────
  function saveHistory(entry) {
    history.unshift(entry);
    if (history.length > 10) history.pop();
    localStorage.setItem("percento_history", JSON.stringify(history));
    renderHistory();
  }
  
  // ── UTILITY: show result + buttons ───────────────────────
  function showResult(resultEl, actionsEl, resultText, fullText) {
    resultEl.textContent = resultText;
    actionsEl.innerHTML = `
      <button class="btn-copy" onclick="copyResult('${resultText}', this)">
        ${LANG[currentLang].copy}
      </button>
      <button class="btn-whatsapp" onclick="shareWhatsApp('${encodeURIComponent(fullText)}')">
        ${LANG[currentLang].whatsapp}
      </button>
    `;
  }
  
  // ── COPY ──────────────────────────────────────────────────
  function copyResult(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = LANG[currentLang].copied;
      setTimeout(() => btn.textContent = LANG[currentLang].copy, 2000);
    });
  }
  
  // ── WHATSAPP ──────────────────────────────────────────────
  function shareWhatsApp(encodedText) {
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
  }
  
  // ── CALCULATOR 1: What is X% of Y? ───────────────────────
  function calc1() {
    const a = parseFloat(document.getElementById("c1a").value);
    const b = parseFloat(document.getElementById("c1b").value);
    const resultEl  = document.getElementById("c1result");
    const actionsEl = document.getElementById("c1actions");
  
    if (isNaN(a) || isNaN(b)) {
      resultEl.textContent = "";
      actionsEl.innerHTML = "";
      return;
    }
  
    const result   = round((a / 100) * b);
    const resultText = `= ${result}`;
    const fullText = `${a}% of ${b} = ${result}`;
  
    showResult(resultEl, actionsEl, resultText, fullText);
    saveHistory({ text: fullText, result });
  }
  
  // ── CALCULATOR 2: X is what % of Y? ──────────────────────
  function calc2() {
    const a = parseFloat(document.getElementById("c2a").value);
    const b = parseFloat(document.getElementById("c2b").value);
    const resultEl  = document.getElementById("c2result");
    const actionsEl = document.getElementById("c2actions");
  
    if (isNaN(a) || isNaN(b) || b === 0) {
      resultEl.textContent = "";
      actionsEl.innerHTML = "";
      return;
    }
  
    const result   = round((a / b) * 100);
    const resultText = `= ${result}%`;
    const fullText = `${a} is ${result}% of ${b}`;
  
    showResult(resultEl, actionsEl, resultText, fullText);
    saveHistory({ text: fullText, result });
  }
  
  // ── CALCULATOR 3: % change from X to Y ───────────────────
  function calc3() {
    const a = parseFloat(document.getElementById("c3a").value);
    const b = parseFloat(document.getElementById("c3b").value);
    const resultEl  = document.getElementById("c3result");
    const actionsEl = document.getElementById("c3actions");
  
    if (isNaN(a) || isNaN(b) || a === 0) {
      resultEl.textContent = "";
      actionsEl.innerHTML = "";
      return;
    }
  
    const result = round(((b - a) / Math.abs(a)) * 100);
    const direction = result > 0
      ? LANG[currentLang].increase
      : result < 0
      ? LANG[currentLang].decrease
      : LANG[currentLang].nochange;
  
    const arrow = result > 0 ? "↑" : result < 0 ? "↓" : "→";
    const resultText = `${arrow} ${Math.abs(result)}% ${direction}`;
    const fullText = `% change from ${a} to ${b}: ${resultText}`;
  
    showResult(resultEl, actionsEl, resultText, fullText);
    saveHistory({ text: fullText, result });
  }
  
  // ── RENDER HISTORY ────────────────────────────────────────
  function renderHistory() {
    const list = document.getElementById("historyList");
    const title = document.getElementById("historySection");
  
    if (history.length === 0) {
      title.style.display = "none";
      return;
    }
  
    title.style.display = "block";
    document.querySelector(".history-title").textContent = LANG[currentLang].history;
    list.innerHTML = history
      .map(item => `<li>${item.text} <span>${item.result}</span></li>`)
      .join("");
  }

  // ── CLEAR HISTORY ─────────────────────────────────────────
function clearHistory() {
    history = [];
    localStorage.removeItem("percento_history");
    renderHistory();
  }
  
  // ── LANGUAGE TOGGLE ───────────────────────────────────────
function toggleLang() {
  currentLang = currentLang === "en" ? "es" : "en";
  const L = LANG[currentLang];

  // toggle button
  document.getElementById("langToggle").textContent =
    currentLang === "en" ? "ES" : "EN";
  document.documentElement.lang = currentLang;

  // tagline
  document.getElementById("tagline").textContent = L.tagline;

  // card questions
  document.querySelector("#calc1 .calc-question").innerHTML =
    `${L.c1q} <input type="number" id="c1a" /> ${L.c1of} <input type="number" id="c1b" /> ${L.c1end}`;
  document.querySelector("#calc2 .calc-question").innerHTML =
    `<input type="number" id="c2a" /> ${L.c2is} <input type="number" id="c2b" /> ${L.c2end}`;
  document.querySelector("#calc3 .calc-question").innerHTML =
    `${L.c3from} <input type="number" id="c3a" /> ${L.c3to} <input type="number" id="c3b" /> ${L.c3end}`;

  // calculate buttons
  document.querySelectorAll(".btn-calculate").forEach(btn => {
    btn.textContent = L.calculate;
  });

  // history
  document.getElementById("historyTitle").textContent = L.history;
  document.querySelector(".btn-clear").textContent = L.clear;

  // re-render history with new language
  renderHistory();
}  

  // ── EVENT LISTENERS ───────────────────────────────────────
  document.getElementById("langToggle").addEventListener("click", toggleLang);

// ── INIT ──────────────────────────────────────────────────
const browserLang = navigator.language || navigator.userLanguage;
if (browserLang.startsWith("es")) {
  toggleLang();
} else {
  document.getElementById("historySection").style.display = "none";
  renderHistory();
}