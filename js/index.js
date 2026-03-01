(function () {
  const bar = document.getElementById("scroll-progress");
  const stickyCta = document.getElementById("sticky-cta");
  const ctaClose = document.getElementById("sticky-cta-close");

  let rafPending = false;
  let ctaDismissed = false;
  let ctaShown = false;

  function updateBar() {
    if (!bar) return;
    const s = window.scrollY || 0;
    const h =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const p = h > 0 ? Math.min(100, (s / h) * 100) : 0;
    bar.style.width = `${p}%`;
    bar.setAttribute("aria-valuenow", Math.round(p));
  }

  function updateCta() {
    if (!stickyCta || ctaDismissed) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const show = h > 0 && (window.scrollY / h) * 100 >= 40;
    if (show && !ctaShown) {
      stickyCta.classList.remove(
        "translate-y-full",
        "opacity-0",
        "pointer-events-none",
      );
      stickyCta.classList.add(
        "translate-y-0",
        "opacity-100",
        "pointer-events-auto",
      );
      ctaShown = true;
    } else if (!show && ctaShown) {
      stickyCta.classList.add(
        "translate-y-full",
        "opacity-0",
        "pointer-events-none",
      );
      stickyCta.classList.remove(
        "translate-y-0",
        "opacity-100",
        "pointer-events-auto",
      );
      ctaShown = false;
    }
  }

  function handleScroll() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        updateBar();
        updateCta();
        rafPending = false;
      });
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      if (bar) updateBar();
      if (stickyCta && !ctaDismissed) updateCta();
    },
    { passive: true },
  );

  if (ctaClose) {
    ctaClose.addEventListener("click", () => {
      ctaDismissed = true;
      if (stickyCta) {
        stickyCta.classList.add(
          "translate-y-full",
          "opacity-0",
          "pointer-events-none",
        );
        stickyCta.classList.remove(
          "translate-y-0",
          "opacity-100",
          "pointer-events-auto",
        );
        ctaShown = false;
      }
    });
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);
        const target = parseFloat(el.getAttribute("data-target")) || 0;
        const dur = parseInt(el.getAttribute("data-duration") || "1500", 10);
        const suffix = el.getAttribute("data-suffix") || "";
        const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        const compact = el.getAttribute("data-format") === "compact";
        let start = null;

        function fmt(v) {
          if (compact) {
            if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
            if (v >= 1000) return Math.round(v / 1000) + "K";
          }
          return decimals > 0
            ? v.toFixed(decimals)
            : Math.round(v).toLocaleString();
        }

        el.classList.add("animate-count-in");
        (function tick(ts) {
          if (!start) start = ts;
          const prog = Math.min((ts - start) / dur, 1);
          const ease = 1 - Math.pow(1 - prog, 3);
          el.textContent = fmt(ease * target) + suffix;
          if (prog < 1) requestAnimationFrame(tick);
          else el.textContent = fmt(target) + suffix;
        })(performance.now());
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".counter-value").forEach(function (el) {
    counterObserver.observe(el);
  });

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof lucide !== "undefined") lucide.createIcons();

    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 700,
        once: true,
        easing: "ease-out-cubic",
        offset: 60,
      });
    }

    if (typeof Swiper !== "undefined") {
      new Swiper(".testimonials-swiper", {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active !bg-primary-600",
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
        a11y: {
          prevSlideMessage: "Previous testimonial",
          nextSlideMessage: "Next testimonial",
        },
      });
    }
  });
})();
