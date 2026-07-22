/* ============================================================
   OXYNITI — site interactions (no dependencies)
   ============================================================ */
"use strict";

/* ---------- CONTACT PLACEHOLDERS — TODO: fill these in ---------- */
const CONTACT = {
  phone: "",            // e.g. "+917382127722"
  whatsapp: "",         // e.g. "917382127722"  (country code, no +)
  email: "",            // e.g. "hello@oxyniti.in"
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* dev flag: ?shot=1 disables preloader + animations for clean screenshots */
const SHOT_MODE = new URLSearchParams(location.search).has("shot");
if (SHOT_MODE) {
  document.documentElement.style.scrollBehavior = "auto";
  document.documentElement.classList.add("shot");
  document.addEventListener("DOMContentLoaded", () => {
    const pre = document.getElementById("preloader");
    if (pre) pre.remove();
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  });
}

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => pre.classList.add("done"), 500);
});
// Fallback: never trap the user behind the preloader
setTimeout(() => {
  const pre = document.getElementById("preloader");
  if (pre) pre.classList.add("done");
}, 4000);

/* ============================================================
   NAV
   ============================================================ */
const nav = document.querySelector(".nav");
const links = document.querySelector(".nav-links");
const burger = document.querySelector(".hamburger");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  links.classList.toggle("open");
});
links.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    links.classList.remove("open");
  })
);

/* active link highlight */
const sections = [...document.querySelectorAll("section[id]")];
const navAnchors = [...links.querySelectorAll("a")];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navAnchors.forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`)
    );
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(s => spy.observe(s));

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
const revealer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      revealer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealer.observe(el));

/* ============================================================
   HERO BUBBLE CANVAS
   ============================================================ */
(function bubbles() {
  const canvas = document.getElementById("bubble-canvas");
  if (!canvas || reducedMotion) return;
  const ctx = canvas.getContext("2d");
  let w, h, pts = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener("resize", resize);

  const N = Math.min(46, Math.floor(window.innerWidth / 30));
  function spawn(init) {
    return {
      x: Math.random() * w,
      y: init ? Math.random() * h : h + 20,
      r: (1 + Math.random() * 3.4) * devicePixelRatio,
      v: (0.35 + Math.random() * 0.9) * devicePixelRatio,
      drift: Math.random() * Math.PI * 2,
      driftAmp: (0.2 + Math.random() * 0.5) * devicePixelRatio,
      a: 0.12 + Math.random() * 0.3,
    };
  }
  for (let i = 0; i < N; i++) pts.push(spawn(true));

  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; })
    .observe(canvas);

  (function tick() {
    requestAnimationFrame(tick);
    if (!heroVisible) return;
    ctx.clearRect(0, 0, w, h);
    pts.forEach((p, i) => {
      p.y -= p.v;
      p.drift += 0.02;
      p.x += Math.sin(p.drift) * p.driftAmp * 0.3;
      if (p.y < -20) pts[i] = spawn(false);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140, 235, 255, ${p.a})`;
      ctx.lineWidth = devicePixelRatio;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a * 0.9})`;
      ctx.fill();
    });
  })();
})();

/* ============================================================
   TANK COMPARISON (regular vs nano bubbles)
   ============================================================ */
(function tanks() {
  const reg = document.querySelector(".tank.regular .bubble-layer");
  const nano = document.querySelector(".tank.nano .bubble-layer");
  if (!reg || !nano || reducedMotion) return;

  function make(layer, opts) {
    const b = document.createElement("span");
    const size = opts.min + Math.random() * (opts.max - opts.min);
    b.style.cssText = `
      position:absolute; border-radius:50%;
      left:${8 + Math.random() * 84}%;
      bottom:-${size}px;
      width:${size}px; height:${size}px;
      border:1px solid rgba(160,240,255,${opts.alpha});
      background:radial-gradient(circle at 32% 30%, rgba(255,255,255,${opts.alpha * 0.75}), rgba(160,240,255,0.05));
      animation:${opts.anim} ${opts.dur + Math.random() * opts.durVar}s linear forwards;
    `;
    layer.appendChild(b);
    b.addEventListener("animationend", () => b.remove());
  }

  // keyframes injected once
  const style = document.createElement("style");
  style.textContent = `
    @keyframes rise-burst {
      0% { transform: translateY(0); opacity: 0 }
      8% { opacity: 1 }
      86% { opacity: 1 }
      100% { transform: translateY(-320px); opacity: 0 }
    }
    @keyframes rise-hang {
      0% { transform: translateY(0) translateX(0); opacity: 0 }
      12% { opacity: 1 }
      50% { transform: translateY(-130px) translateX(8px) }
      100% { transform: translateY(-235px) translateX(-6px); opacity: 0.85 }
    }
  `;
  document.head.appendChild(style);

  let tanksVisible = false;
  new IntersectionObserver(([e]) => { tanksVisible = e.isIntersecting; })
    .observe(reg.closest(".tanks"));

  setInterval(() => {
    if (!tanksVisible) return;
    make(reg, { min: 14, max: 30, alpha: 0.5, anim: "rise-burst", dur: 1.6, durVar: 0.8 });
  }, 380);
  setInterval(() => {
    if (!tanksVisible) return;
    for (let i = 0; i < 4; i++)
      make(nano, { min: 2, max: 4.5, alpha: 0.75, anim: "rise-hang", dur: 6, durVar: 5 });
  }, 300);
})();

/* ============================================================
   DO CURVE DRAW-IN
   ============================================================ */
(function doCurve() {
  const wrap = document.querySelector(".do-curve-wrap");
  if (!wrap) return;
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { wrap.classList.add("animate"); obs.disconnect(); }
  }, { threshold: 0.4 }).observe(wrap);
})();

/* ============================================================
   DRONE PARALLAX
   ============================================================ */
(function droneParallax() {
  const stage = document.querySelector(".drone-stage");
  const vid = stage && stage.querySelector("video");
  if (!stage || !vid || reducedMotion) return;
  let ticking = false;
  function update() {
    ticking = false;
    const r = stage.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    // progress 0 → 1 as the stage crosses the viewport
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    vid.style.transform = `scale(${1.22 - p * 0.1}) translateY(${(p - 0.5) * -7}%)`;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* pause offscreen autoplay videos to save battery */
document.querySelectorAll("video[autoplay]").forEach(v => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) v.play().catch(() => {});
    else v.pause();
  }, { threshold: 0.15 }).observe(v);
});

/* ============================================================
   COUNTERS
   ============================================================ */
document.querySelectorAll("[data-count]").forEach(el => {
  const target = parseFloat(el.dataset.count);
  const decimals = (el.dataset.count.split(".")[1] || "").length;
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    const t0 = performance.now(), dur = 1600;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }, { threshold: 0.5 }).observe(el);
});

/* ============================================================
   GALLERY — tap / hover to play
   ============================================================ */
document.querySelectorAll(".g-card").forEach(card => {
  const v = card.querySelector("video");
  function toggle() {
    if (v.paused) {
      document.querySelectorAll(".g-card video").forEach(o => { if (o !== v) { o.pause(); o.closest(".g-card").classList.remove("playing"); } });
      v.play().catch(() => {});
      card.classList.add("playing");
    } else {
      v.pause();
      card.classList.remove("playing");
    }
  }
  card.addEventListener("click", toggle);
  card.addEventListener("mouseenter", () => { v.play().catch(() => {}); card.classList.add("playing"); });
  card.addEventListener("mouseleave", () => { v.pause(); card.classList.remove("playing"); });
  v.addEventListener("ended", () => { v.currentTime = 0; card.classList.remove("playing"); });
});

/* ============================================================
   ROI CALCULATOR (illustrative)
   ============================================================ */
(function roi() {
  const acres = document.getElementById("roi-acres");
  const price = document.getElementById("roi-price");
  if (!acres || !price) return;
  const acresOut = document.getElementById("roi-acres-out");
  const priceOut = document.getElementById("roi-price-out");
  const kgOut = document.getElementById("roi-kg");
  const moneyOut = document.getElementById("roi-money");

  const BASE_YIELD_KG_PER_ACRE = 2500;  // typical semi-intensive pond, per year
  const UPLIFT_LO = 0.20, UPLIFT_HI = 0.30; // published nano-bubble study range

  const fmtINR = n => "₹" + Math.round(n).toLocaleString("en-IN");

  function paintFill(input) {
    const p = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty("--fill", p + "%");
  }

  function update() {
    paintFill(acres); paintFill(price);
    const a = parseFloat(acres.value);
    const pr = parseInt(price.value, 10);
    acresOut.textContent = a + (a === 1 ? " acre" : " acres");
    priceOut.textContent = fmtINR(pr) + "/kg";
    const lo = a * BASE_YIELD_KG_PER_ACRE * UPLIFT_LO;
    const hi = a * BASE_YIELD_KG_PER_ACRE * UPLIFT_HI;
    kgOut.textContent = `+${Math.round(lo).toLocaleString("en-IN")} – ${Math.round(hi).toLocaleString("en-IN")} kg / year`;
    moneyOut.textContent = `${fmtINR(lo * pr)} – ${fmtINR(hi * pr)}`;
  }
  acres.addEventListener("input", update);
  price.addEventListener("input", update);
  update();
})();

/* ============================================================
   CONTACT FORM + toast
   ============================================================ */
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._h);
  toast._h = setTimeout(() => t.classList.remove("show"), 3600);
}

document.getElementById("lead-form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const msg =
    `Vanakkam Oxyniti! New demo request:\n` +
    `Name: ${f.get("name")}\nPhone: ${f.get("phone")}\n` +
    `Place: ${f.get("place")}\nPond size: ${f.get("size")}\n` +
    `Species: ${f.get("species")}`;
  if (CONTACT.whatsapp) {
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  } else if (CONTACT.email) {
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Oxyniti demo request")}&body=${encodeURIComponent(msg)}`;
  } else {
    toast("Demo request captured ✔ — add your WhatsApp number in js/main.js (CONTACT) to receive these.");
    console.log(msg);
  }
});

/* wire placeholder rails */
document.querySelectorAll("[data-contact]").forEach(el => {
  el.addEventListener("click", e => {
    const kind = el.dataset.contact;
    if (kind === "phone" && CONTACT.phone) { location.href = `tel:${CONTACT.phone}`; return; }
    if (kind === "whatsapp" && CONTACT.whatsapp) { window.open(`https://wa.me/${CONTACT.whatsapp}`, "_blank"); return; }
    if (kind === "email" && CONTACT.email) { location.href = `mailto:${CONTACT.email}`; return; }
    e.preventDefault();
    toast("Placeholder — set your real number in js/main.js (CONTACT object).");
  });
});

/* footer year */
document.getElementById("year").textContent = new Date().getFullYear();
