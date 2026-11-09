(function () {
  const header = document.getElementById("header");
  const slides = [...document.querySelectorAll(".hero-slides img")];
  const dots = [...document.querySelectorAll(".hero-dots button")];
  const sections = [...document.querySelectorAll(".fp")];
  const pagerNow = document.getElementById("pager-now");
  const pagerDot = document.getElementById("pager-dot");
  const toggle = document.querySelector(".nav-toggle");
  const gnb = document.getElementById("gnb");
  let idx = 0;

  function show(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach((el, n) => el.classList.toggle("is-on", n === idx));
    dots.forEach((el, n) => el.classList.toggle("is-on", n === idx));
  }
  dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
  setInterval(() => show(idx + 1), 6500);

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > window.innerHeight * 0.7);
    let current = 0;
    sections.forEach((s, i) => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.45) current = i;
    });
    pagerNow.textContent = String(current + 1).padStart(2, "0");
    if (pagerDot) pagerDot.style.top = (current / Math.max(sections.length - 1, 1)) * 67 + "px";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const open = gnb.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    header.classList.add("is-solid");
  });
  gnb.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => gnb.classList.remove("is-open"))
  );
})();
