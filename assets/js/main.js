/* =========================================================
   Amisha Yadav — Portfolio · interactions & animations
   ========================================================= */
(function () {
  "use strict";
  const SHOT = location.hash === "#shot"; // static render for screenshots
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || SHOT;
  const canHover = window.matchMedia("(hover: hover)").matches && !SHOT;

  /* ---------- Preloader with counter ---------- */
  function preloader() {
    const el = document.querySelector(".preloader");
    if (SHOT && el) { el.remove(); document.body.classList.add("loaded"); return; }
    if (!el) { document.body.classList.add("loaded"); return; }
    const count = el.querySelector(".preloader__count");
    const bar = el.querySelector(".preloader__bar");
    let n = 0;
    const dur = reduce ? 1 : 1200;
    const start = performance.now();
    function tick(t) {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      n = Math.round(eased * 100);
      if (count) count.textContent = String(n).padStart(2, "0");
      if (bar) bar.style.width = eased * 100 + "%";
      if (p < 1) requestAnimationFrame(tick);
      else {
        el.classList.add("done");
        document.body.classList.add("loaded");
        setTimeout(() => el.remove(), 700);
        window.dispatchEvent(new Event("intro:done"));
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Custom cursor ---------- */
  function cursor() {
    if (!canHover) return;
    const ring = document.createElement("div");
    ring.className = "cursor";
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.append(ring, dot);
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2, mx = rx, my = ry;
    document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hoverables = "a, button, .proj-row, .work-card, .archive-row, input, textarea, .cta__mail";
    document.addEventListener("mouseover", (e) => { if (e.target.closest(hoverables)) ring.classList.add("is-hover"); });
    document.addEventListener("mouseout", (e) => { if (e.target.closest(hoverables)) ring.classList.remove("is-hover"); });
  }

  /* ---------- Scroll reveal + stagger ---------- */
  function reveals() {
    const items = document.querySelectorAll(".reveal, .stagger");
    if (reduce) { items.forEach(i => i.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((i) => io.observe(i));
  }

  /* ---------- Wrap .stagger headings into line masks ---------- */
  function buildStagger() {
    document.querySelectorAll(".stagger[data-lines]").forEach((el) => {
      const lines = el.getAttribute("data-lines").split("|");
      el.innerHTML = lines.map(l => `<span class="line"><span>${l}</span></span>`).join("");
    });
  }

  /* ---------- Count-up numbers ---------- */
  function countUp() {
    const els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const raw = el.getAttribute("data-count");
        const target = parseFloat(raw);
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        const decimals = (raw.split(".")[1] || "").length;
        if (reduce) { el.textContent = prefix + raw + suffix; return; }
        const dur = 1600; const start = performance.now();
        function tick(t) {
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = (target * eased).toFixed(decimals);
          el.textContent = prefix + val + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = prefix + raw + suffix;
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Duplicate marquee track for seamless loop ---------- */
  function marquee() {
    document.querySelectorAll(".marquee__track").forEach((tr) => {
      tr.innerHTML += tr.innerHTML;
    });
  }

  /* ---------- Project row hover preview follows cursor ---------- */
  function hoverPreview() {
    if (!canHover) return;
    const rows = document.querySelectorAll(".proj-row[data-img]");
    if (!rows.length) return;
    const prev = document.createElement("div");
    prev.className = "hover-preview";
    const img = document.createElement("img");
    prev.appendChild(img);
    document.body.appendChild(prev);
    let tx = 0, ty = 0, cx = 0, cy = 0, active = false;
    document.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      prev.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%) scale(${active ? 1 : 0.8})`;
      requestAnimationFrame(loop);
    })();
    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => { img.src = row.getAttribute("data-img"); active = true; prev.classList.add("show"); });
      row.addEventListener("mouseleave", () => { active = false; prev.classList.remove("show"); });
    });
  }

  /* ---------- Header hide on scroll down ---------- */
  function header() {
    const h = document.querySelector(".header");
    if (!h) return;
    let last = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > last && y > 200) h.classList.add("hide");
      else h.classList.remove("hide");
      last = y;
    }, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function mobileMenu() {
    const toggle = document.querySelector(".nav-toggle");
    const overlay = document.querySelector(".menu-overlay");
    if (!toggle || !overlay) return;
    const close = () => { toggle.classList.remove("open"); overlay.classList.remove("open"); document.body.style.overflow = ""; };
    toggle.addEventListener("click", () => {
      const open = overlay.classList.toggle("open");
      toggle.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    overlay.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  }

  /* ---------- Hero parallax on scroll ---------- */
  function heroParallax() {
    if (reduce) return;
    const bg = document.querySelector(".hero__bg img");
    if (!bg) return;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      bg.style.transform = `scale(1.08) translateY(${y * 0.12}px)`;
    }, { passive: true });
  }

  /* ---------- Magnetic buttons ---------- */
  function magnetic() {
    if (!canHover) return;
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Active nav link ---------- */
  function activeNav() {
    const path = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    document.querySelectorAll(".nav a, .footer__nav a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const norm = href.replace(/^\.?\//, "/").replace(/\.html$/, "").replace(/\/$/, "") || "/";
      const cur = path.replace(/\/$/, "") || "/";
      if ((norm === "/" && (cur === "/" || cur.endsWith("/index"))) || (norm !== "/" && cur.endsWith(norm))) {
        a.classList.add("active");
      }
    });
  }

  /* ---------- Contact form (front-end only) ---------- */
  function contactForm() {
    const form = document.querySelector(".form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector(".btn");
      const label = btn.querySelector(".btn-label") || btn;
      const original = label.textContent;
      label.textContent = "Sent — thank you";
      form.reset();
      setTimeout(() => { label.textContent = original; }, 3000);
    });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (SHOT) document.documentElement.classList.add("shot");
    buildStagger();
    preloader();
    cursor();
    reveals();
    countUp();
    marquee();
    hoverPreview();
    header();
    mobileMenu();
    heroParallax();
    magnetic();
    activeNav();
    contactForm();
    // set current year
    document.querySelectorAll("[data-year]").forEach(e => e.textContent = new Date().getFullYear());
  });
})();
