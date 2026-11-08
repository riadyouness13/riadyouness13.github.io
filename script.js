/* ==========================================================
   CONFIGURATION — à compléter quand tu as les liens
   ========================================================== */
const CONFIG = {
  // Exemple : "https://www.linkedin.com/in/riad-youness"
  linkedin: "",
  // Identifiant YouTube de la vidéo pitch (ce qui suit "v=" dans l'URL).
  // Exemple : pour https://www.youtube.com/watch?v=abc123XYZ → "abc123XYZ"
  youtubeId: "8kWOdm09W7Q"
};

/* ==========================================================
   Langue FR / EN
   ========================================================== */
const TITLES = {
  fr: "Youness Riad — ePortfolio",
  en: "Youness Riad — ePortfolio"
};

function getStoredLang() {
  try { return localStorage.getItem("lang"); } catch (e) { return null; }
}
function storeLang(lang) {
  try { localStorage.setItem("lang", lang); } catch (e) { /* stockage indisponible */ }
}

function setLang(lang) {
  document.documentElement.lang = lang;
  document.title = TITLES[lang];
  document.querySelectorAll("[data-set-lang]").forEach(b => {
    b.setAttribute("aria-pressed", String(b.dataset.setLang === lang));
  });
  storeLang(lang);
  if (window.tspDemo) window.tspDemo.refreshLabels();
}

const initialLang = getStoredLang() ||
  ((navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en");
setLang(initialLang);

document.querySelectorAll("[data-set-lang]").forEach(b => {
  b.addEventListener("click", () => setLang(b.dataset.setLang));
});

/* ==========================================================
   Onglets et sous-onglets (adresse : #onglet ou #onglet/sous-onglet)
   ========================================================== */
const panels = [...document.querySelectorAll("[data-panel]")];
const tabLinks = [...document.querySelectorAll("[data-tab]")];

function showSub(panel, subId) {
  const buttons = [...panel.querySelectorAll("[data-sub]")];
  if (!buttons.length) return;
  const subs = [...panel.querySelectorAll("[data-subpanel]")];
  const target = subs.find(s => s.dataset.subpanel === subId) || subs[0];
  subs.forEach(s => { s.hidden = s !== target; });
  buttons.forEach(b => b.setAttribute("aria-selected", String(b.dataset.sub === target.dataset.subpanel)));
}

function route() {
  const [tabId, subId] = (location.hash.slice(1) || "welcome").split("/");
  const panel = panels.find(p => p.dataset.panel === tabId) || panels[0];
  panels.forEach(p => { p.hidden = p !== panel; });
  tabLinks.forEach(a => {
    if (a.dataset.tab === panel.dataset.panel) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  showSub(panel, subId);
  const active = tabLinks.find(a => a.dataset.tab === panel.dataset.panel);
  if (active) active.scrollIntoView({ block: "nearest", inline: "nearest" });
  window.scrollTo(0, 0);
}

panels.forEach(panel => {
  panel.querySelectorAll("[data-sub]").forEach(b => {
    b.addEventListener("click", () => {
      history.replaceState(null, "", "#" + panel.dataset.panel + "/" + b.dataset.sub);
      showSub(panel, b.dataset.sub);
    });
  });
});

window.addEventListener("hashchange", route);
route();

/* ==========================================================
   Liens LinkedIn et vidéo
   ========================================================== */
const liBtn = document.getElementById("linkedin-btn");
if (CONFIG.linkedin) {
  liBtn.href = CONFIG.linkedin;
  document.getElementById("footer-linkedin").innerHTML =
    '&nbsp;&nbsp;<a href="' + CONFIG.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>';
} else {
  liBtn.setAttribute("aria-disabled", "true");
  liBtn.removeAttribute("href");
  document.getElementById("linkedin-note").innerHTML =
    '<span data-l="fr">Profil bientôt en ligne.</span><span data-l="en">Profile coming soon.</span>';
}

if (CONFIG.youtubeId) {
  document.getElementById("video").innerHTML =
    '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(CONFIG.youtubeId) +
    '" title="Pitch vidéo de Youness Riad" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}

/* ==========================================================
   Démo : problème du voyageur de commerce (TIPE)
   ========================================================== */
(function () {
  const svg = document.getElementById("tsp-svg");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CITIES = [
    { fr: "Toulouse", en: "Toulouse", lat: 43.60, lon: 1.44 },
    { fr: "Paris", en: "Paris", lat: 48.86, lon: 2.35 },
    { fr: "Londres", en: "London", lat: 51.51, lon: -0.13 },
    { fr: "Amsterdam", en: "Amsterdam", lat: 52.37, lon: 4.90 },
    { fr: "Bruxelles", en: "Brussels", lat: 50.85, lon: 4.35 },
    { fr: "Berlin", en: "Berlin", lat: 52.52, lon: 13.40 },
    { fr: "Prague", en: "Prague", lat: 50.08, lon: 14.44 },
    { fr: "Vienne", en: "Vienna", lat: 48.21, lon: 16.37 },
    { fr: "Munich", en: "Munich", lat: 48.14, lon: 11.58, left: true },
    { fr: "Milan", en: "Milan", lat: 45.46, lon: 9.19 },
    { fr: "Rome", en: "Rome", lat: 41.90, lon: 12.50 },
    { fr: "Barcelone", en: "Barcelona", lat: 41.39, lon: 2.17 },
    { fr: "Madrid", en: "Madrid", lat: 40.42, lon: -3.70 },
    { fr: "Lisbonne", en: "Lisbon", lat: 38.72, lon: -9.14 }
  ];
  const N = CITIES.length;

  // Projection équirectangulaire centrée sur 46° N
  const W = 520, H = 400, PAD = 26;
  const LON_MIN = -11, LON_MAX = 19, LAT_MIN = 37, LAT_MAX = 54.5;
  const k = Math.cos(46 * Math.PI / 180);
  const sx = (W - 2 * PAD) / ((LON_MAX - LON_MIN) * k);
  const sy = (H - 2 * PAD) / (LAT_MAX - LAT_MIN);
  const s = Math.min(sx, sy);
  const offX = (W - (LON_MAX - LON_MIN) * k * s) / 2;
  const offY = (H - (LAT_MAX - LAT_MIN) * s) / 2;
  const px = lon => offX + (lon - LON_MIN) * k * s;
  const py = lat => offY + (LAT_MAX - lat) * s;

  // Distances (formule de haversine, en km)
  const D = [];
  for (let i = 0; i < N; i++) {
    D[i] = [];
    for (let j = 0; j < N; j++) {
      const a = CITIES[i], b = CITIES[j];
      const toR = Math.PI / 180;
      const dLat = (b.lat - a.lat) * toR, dLon = (b.lon - a.lon) * toR;
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLon / 2) ** 2;
      D[i][j] = 2 * 6371 * Math.asin(Math.sqrt(h));
    }
  }
  const tourLength = t => t.reduce((acc, c, i) => acc + D[c][t[(i + 1) % t.length]], 0);

  // --- Algorithmes ---
  function randomTour() {
    const rest = [...Array(N).keys()].slice(1);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return [0, ...rest];
  }

  function nearestNeighbour() {
    const tour = [0], seen = new Set([0]);
    while (tour.length < N) {
      const last = tour[tour.length - 1];
      let best = -1;
      for (let j = 0; j < N; j++) if (!seen.has(j) && (best < 0 || D[last][j] < D[last][best])) best = j;
      tour.push(best); seen.add(best);
    }
    return tour;
  }

  function twoOpt(start) {
    const t = start.slice();
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 1; i < N - 1; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = t[i - 1], b = t[i], c = t[j], d = t[(j + 1) % N];
          if (D[a][c] + D[b][d] < D[a][b] + D[c][d] - 1e-9) {
            let l = i, r = j;
            while (l < r) { [t[l], t[r]] = [t[r], t[l]]; l++; r--; }
            improved = true;
          }
        }
      }
    }
    return t;
  }

  function simulatedAnnealing() {
    let t = randomTour(), cur = tourLength(t);
    let best = t.slice(), bestLen = cur;
    let T = 3000;
    for (let it = 0; it < 60000; it++) {
      const i = 1 + Math.floor(Math.random() * (N - 1));
      const j = 1 + Math.floor(Math.random() * (N - 1));
      if (i === j) continue;
      const l0 = Math.min(i, j), r0 = Math.max(i, j);
      const a = t[l0 - 1], b = t[l0], c = t[r0], d = t[(r0 + 1) % N];
      const delta = D[a][c] + D[b][d] - D[a][b] - D[c][d];
      if (delta < 0 || Math.random() < Math.exp(-delta / T)) {
        let l = l0, r = r0;
        while (l < r) { [t[l], t[r]] = [t[r], t[l]]; l++; r--; }
        cur += delta;
        if (cur < bestLen) { bestLen = cur; best = t.slice(); }
      }
      T *= 0.9998;
    }
    return best;
  }

  // Optimum exact par programmation dynamique (Held-Karp), pour mesurer l'écart
  function heldKarp() {
    const M = N - 1, FULL = 1 << M;
    const dp = new Float64Array(FULL * M).fill(Infinity);
    for (let j = 0; j < M; j++) dp[(1 << j) * M + j] = D[0][j + 1];
    for (let mask = 1; mask < FULL; mask++) {
      for (let j = 0; j < M; j++) {
        const v = dp[mask * M + j];
        if (!(mask & (1 << j)) || v === Infinity) continue;
        for (let k2 = 0; k2 < M; k2++) {
          if (mask & (1 << k2)) continue;
          const nm = mask | (1 << k2), nv = v + D[j + 1][k2 + 1];
          if (nv < dp[nm * M + k2]) dp[nm * M + k2] = nv;
        }
      }
    }
    let best = Infinity;
    for (let j = 0; j < M; j++) best = Math.min(best, dp[(FULL - 1) * M + j] + D[j + 1][0]);
    return best;
  }
  let OPT = null;

  // --- Dessin ---
  function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k2 in attrs) e.setAttribute(k2, attrs[k2]);
    (parent || svg).appendChild(e);
    return e;
  }

  const grat = el("g", {});
  for (let lon = -10; lon <= 15; lon += 5) {
    el("line", { class: "graticule", x1: px(lon), y1: py(LAT_MAX), x2: px(lon), y2: py(LAT_MIN) }, grat);
    const t = el("text", { class: "grat-label", x: px(lon) + 3, y: H - 6 }, grat);
    t.textContent = Math.abs(lon) + "°" + (lon < 0 ? "W" : "E");
  }
  for (let lat = 40; lat <= 50; lat += 5) {
    el("line", { class: "graticule", x1: px(LON_MIN), y1: py(lat), x2: px(LON_MAX), y2: py(lat) }, grat);
    const t = el("text", { class: "grat-label", x: 4, y: py(lat) - 3 }, grat);
    t.textContent = lat + "°N";
  }

  const path = el("path", { class: "route" });
  const labels = [];
  CITIES.forEach((c, i) => {
    const g = el("g", { class: "city" + (i === 0 ? " start" : "") });
    el("circle", { cx: px(c.lon), cy: py(c.lat), r: i === 0 ? 5.5 : 4.5 }, g);
    const right = !c.left;
    const t = el("text", {
      x: px(c.lon) + (right ? 8 : -8), y: py(c.lat) + 3.5,
      "text-anchor": right ? "start" : "end"
    }, g);
    labels.push(t);
  });

  const distEl = document.getElementById("tsp-dist");
  const algoEl = document.getElementById("tsp-algo");
  const gapEl = document.getElementById("tsp-gap");
  const ALGO_NAMES = {
    random: { fr: "Ordre aléatoire", en: "Random order" },
    nn: { fr: "Plus proche voisin", en: "Nearest neighbour" },
    twoopt: { fr: "Plus proche voisin + 2-opt", en: "Nearest neighbour + 2-opt" },
    sa: { fr: "Recuit simulé", en: "Simulated annealing" }
  };
  let current = { tour: null, algo: null };

  const lang = () => document.documentElement.lang === "en" ? "en" : "fr";
  const fmt = n => Math.round(n).toLocaleString(lang() === "fr" ? "fr-FR" : "en-GB") + " km";

  function refreshLabels() {
    labels.forEach((t, i) => { t.textContent = CITIES[i][lang()]; });
    if (current.tour) updateStats();
  }

  function updateStats() {
    const len = tourLength(current.tour);
    distEl.textContent = fmt(len);
    algoEl.textContent = ALGO_NAMES[current.algo][lang()];
    if (OPT) {
      const gap = (len - OPT) / OPT * 100;
      gapEl.textContent = gap < 0.05
        ? (lang() === "fr" ? "optimum atteint" : "optimal")
        : (lang() === "fr" ? "+" + gap.toFixed(1).replace(".", ",") + " % vs optimum" : "+" + gap.toFixed(1) + "% vs optimal");
    }
  }

  function draw(tour, algo) {
    current = { tour, algo };
    const pts = tour.concat(tour[0]).map(i => px(CITIES[i].lon).toFixed(1) + "," + py(CITIES[i].lat).toFixed(1));
    path.setAttribute("d", "M" + pts.join(" L"));
    if (!reduceMotion) {
      const L = path.getTotalLength();
      if (!L) return updateStats();
      path.style.transition = "none";
      path.style.strokeDasharray = L;
      path.style.strokeDashoffset = L;
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.6,.05,.3,1)";
      path.style.strokeDashoffset = "0";
    }
    document.querySelectorAll("[data-algo]").forEach(b => b.classList.toggle("is-active", b.dataset.algo === algo));
    updateStats();
  }

  const RUN = {
    random: randomTour,
    nn: nearestNeighbour,
    twoopt: () => twoOpt(nearestNeighbour()),
    sa: simulatedAnnealing
  };
  document.querySelectorAll("[data-algo]").forEach(b => {
    b.addEventListener("click", () => draw(RUN[b.dataset.algo](), b.dataset.algo));
  });

  window.tspDemo = { refreshLabels };
  OPT = heldKarp();
  refreshLabels();
  draw(RUN.twoopt(), "twoopt");
})();
