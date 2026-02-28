(function () {
  var bar = document.getElementById("scroll-progress");
  var rafPending = false;

  function updateBar() {
    var s = window.scrollY || 0;
    var h =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var p = h > 0 ? Math.min(100, (s / h) * 100) : 0;
    bar.style.width = p + "%";
    bar.setAttribute("aria-valuenow", Math.round(p));
    rafPending = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateBar);
      }
    },
    { passive: true },
  );

  var stickyCta = document.getElementById("sticky-cta");
  var ctaClose = document.getElementById("sticky-cta-close");
  var ctaDismissed = false;
  var ctaShown = false;
  var ctaRaf = false;

  function updateCta() {
    if (ctaDismissed) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var show = h > 0 && (window.scrollY / h) * 100 >= 40;
    if (show && !ctaShown) {
      stickyCta.classList.add("cta-visible");
      ctaShown = true;
    } else if (!show && ctaShown) {
      stickyCta.classList.remove("cta-visible");
      ctaShown = false;
    }
    ctaRaf = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ctaRaf) {
        ctaRaf = true;
        requestAnimationFrame(updateCta);
      }
    },
    { passive: true },
  );

  if (ctaClose) {
    ctaClose.addEventListener("click", function () {
      ctaDismissed = true;
      stickyCta.classList.remove("cta-visible");
      ctaShown = false;
    });
  }

  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        counterObserver.unobserve(el);
        var target = parseFloat(el.getAttribute("data-target"));
        var dur = parseInt(el.getAttribute("data-duration") || "1500", 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var compact = el.getAttribute("data-format") === "compact";
        var start = null;

        function fmt(v) {
          if (compact) {
            if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
            if (v >= 1000) return Math.round(v / 1000) + "K";
          }
          return decimals > 0
            ? v.toFixed(decimals)
            : Math.round(v).toLocaleString();
        }

        el.classList.add("counter-animate");
        (function tick(ts) {
          if (!start) start = ts;
          var prog = Math.min((ts - start) / dur, 1);
          var ease = 1 - Math.pow(1 - prog, 3);
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
    lucide.createIcons();

    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-out-cubic",
      offset: 60,
    });

    new Swiper(".testimonials-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: { el: ".swiper-pagination", clickable: true },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
      a11y: {
        prevSlideMessage: "Previous testimonial",
        nextSlideMessage: "Next testimonial",
      },
    });
  });
})();
