/* NaapBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero delivery board comes alive — Farhan's
      finished shirts move stitched -> ready -> pickup message sent, and
      the "ready to hand over" count ticks up. A live demo of the promise. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the delivery board works itself ---------- */
  var rows = document.getElementById("reg-rows");
  var liveTag = document.getElementById("reg-live-tag");
  var caption = document.getElementById("reg-caption");
  var readyEl = document.getElementById("reg-collected");
  var overdueEl = document.getElementById("reg-pending");

  if (!rows || !liveTag || !readyEl || !overdueEl) return;

  // Farhan Sheikh's row is the one that "finishes itself".
  var farhanRow = rows.querySelector('[data-state="due"]');

  // Cycle: stitched (due) -> reaches ready -> pickup message queued -> reset.
  var stages = [
    {
      tag: "Stitched",
      tagClass: "tag--due",
      caption: "Farhan's 3 shirts are stitched — one tap advances them to “ready”.",
      ready: "1 order",
      overdue: "1 order",
      state: "due",
      flash: false
    },
    {
      tag: "Ready ✓",
      tagClass: "tag--paid",
      caption: "Marked ready — a “ready for pickup” WhatsApp is queued automatically.",
      ready: "2 orders",
      overdue: "1 order",
      state: "paid",
      flash: true
    },
    {
      tag: "Pickup sent",
      tagClass: "tag--paid",
      caption: "Pickup message delivered with the balance due. Nothing slipped past.",
      ready: "2 orders",
      overdue: "1 order",
      state: "paid",
      flash: false
    }
  ];

  var i = 0;

  function applyStage(s) {
    liveTag.textContent = s.tag;
    liveTag.className = "reg-row__tag " + s.tagClass;
    if (farhanRow) farhanRow.setAttribute("data-state", s.state);
    caption.textContent = s.caption;
    readyEl.textContent = s.ready;
    overdueEl.textContent = s.overdue;
    if (farhanRow && s.flash) {
      farhanRow.classList.add("flash");
      setTimeout(function () {
        farhanRow.classList.remove("flash");
      }, 900);
    }
  }

  // If the user prefers reduced motion, just show the fulfilled end-state
  // once (the promise kept) and don't loop.
  if (reduceMotion) {
    applyStage(stages[1]);
    liveTag.textContent = "Ready ✓";
    caption.textContent =
      "Stitched → ready → pickup message — the order finishes itself.";
    return;
  }

  // Only animate while the widget is on screen (saves work, feels intentional).
  var running = false;
  var timer = null;

  function loop() {
    timer = setTimeout(function () {
      i = (i + 1) % stages.length;
      applyStage(stages[i]);
      loop();
    }, i === 0 ? 2600 : 2000);
  }

  var vis = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
        }
      });
    },
    { threshold: 0.35 }
  );
  vis.observe(rows.closest(".register"));
})();
