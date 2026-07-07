/* ============================================================
   Deadlift Digital — interactions
   Vanilla port of the design-tool logic: live clock, click feedback,
   headline word-split, scroll reveals, the 3D plate (drop + idle spin +
   scroll rotation + chalk-smoke), a mobile nav drawer, and the wired form.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Config ------------------------------------------------
     Drop in a real endpoint (Formspree, Web3Forms, Getform, Formsubmit,
     Netlify Forms, etc.) to POST the teardown form. Leave it empty and the
     form falls back to the original mailto: behaviour. */
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'jake@deadliftdigital.com';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null; // set in ready(); null = native scroll fallback

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    lenis = initLenis();
    startClock();
    initMobileNav();
    if (!reduceMotion) initClickFeedback();
    initHeadlineSplit();
    initScrollReveals();
    initPlate();
    initWorkPan();
    initDumbbells();
    initForm();
  });

  /* ---- Background dumbbells: rock like nudged iron + chalk poof on hover ---- */
  function initDumbbells() {
    if (reduceMotion) return;
    if (!(window.matchMedia('(hover:hover) and (pointer:fine)').matches)) return;
    document.querySelectorAll('.bg-dumbbell').forEach(function (wrap) {
      var svg = wrap.querySelector('svg');
      if (!svg || !svg.animate) return;
      var busy = false;
      wrap.addEventListener('mouseenter', function () {
        if (busy) return;
        busy = true;
        // decaying rock around the floor contact point
        svg.animate([
          { transform: 'rotate(0deg)', easing: 'cubic-bezier(.2,.7,.3,1)' },
          { transform: 'rotate(-4.2deg)', offset: .18, easing: 'cubic-bezier(.45,0,.55,1)' },
          { transform: 'rotate(2.8deg)', offset: .42, easing: 'cubic-bezier(.45,0,.55,1)' },
          { transform: 'rotate(-1.5deg)', offset: .64, easing: 'cubic-bezier(.45,0,.55,1)' },
          { transform: 'rotate(.7deg)', offset: .82, easing: 'cubic-bezier(.45,0,.55,1)' },
          { transform: 'rotate(0deg)' }
        ], { duration: 950 }).onfinish = function () { busy = false; };
        // mini chalk poof at the floor line, same volumetric language as the burst
        for (var i = 0; i < 5; i++) {
          var p = document.createElement('div');
          var s = 16 + Math.random() * 26;
          var px = 12 + Math.random() * 76;
          var dx = (Math.random() - 0.5) * 46;
          var o = 0.2 + Math.random() * 0.18;
          p.style.cssText = 'position:absolute;left:' + px + '%;bottom:2px;width:' + s + 'px;height:' + (s * 0.8) + 'px;border-radius:46% 54% 50% 50% / 58% 52% 48% 42%;background:radial-gradient(circle at 36% 30%,rgba(248,246,240,' + (o + 0.15).toFixed(3) + '),rgba(213,209,199,' + (o * 0.5).toFixed(3) + ') 45%,rgba(150,146,137,0) 76%);filter:blur(5px);pointer-events:none;will-change:transform,opacity';
          wrap.appendChild(p);
          (function (p, dx) {
            p.animate([
              { transform: 'translate(0,4px) scale(.3)', opacity: 0, easing: 'cubic-bezier(.05,.9,.2,1)' },
              { transform: 'translate(' + (dx * 0.6) + 'px,-8px) scale(1)', opacity: 1, offset: .16, easing: 'ease-out' },
              { transform: 'translate(' + dx + 'px,-16px) scale(1.5)', opacity: .4, offset: .7, easing: 'ease-in-out' },
              { transform: 'translate(' + (dx * 1.1) + 'px,-12px) scale(1.7)', opacity: 0 }
            ], { duration: 800 + Math.random() * 450 }).onfinish = function () { p.remove(); };
          })(p, dx);
        }
      });
    });
  }

  /* ---- Lenis momentum scroll (vendor/lenis.min.js) ----
     Skipped under prefers-reduced-motion; CSS scroll-behavior:smooth
     remains the fallback when Lenis is absent. */
  function initLenis() {
    if (reduceMotion || typeof window.Lenis !== 'function') return null;
    var l = new window.Lenis({ lerp: 0.1 });
    function raf(time) { l.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Targeted scrolling: route hash anchors through lenis.scrollTo,
    // offset for the sticky mobile topbar.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var hash = a.getAttribute('href');
      var el = hash.length > 1 && document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      var offset = window.matchMedia('(max-width:1024px)').matches ? -64 : 0;
      l.scrollTo(el, { offset: offset });
      history.pushState(null, '', hash);
    });
    return l;
  }

  /* ---- Live clock ---- */
  function startClock() {
    var els = document.querySelectorAll('[data-dd-clock]');
    if (!els.length) return;
    function tick() {
      var t = new Date().toLocaleTimeString('en-GB', { hour12: false });
      els.forEach(function (el) { el.textContent = 'LOCAL ' + t; });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Mobile nav drawer ---- */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      // Freeze/resume Lenis so momentum can't scroll the page behind the drawer.
      // Runs before the document-level anchor handler on link clicks (nav is an
      // ancestor, so bubbling hits this first), so scrollTo lands after start().
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    }
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && nav.classList.contains('open')) setOpen(false);
    });
  }

  /* ---- Click feedback: orange ring burst + heading jolt ---- */
  function initClickFeedback() {
    document.addEventListener('click', function (e) {
      // Skip keyboard-synthesised clicks (no real pointer position)
      if (e.detail === 0 && e.clientX === 0 && e.clientY === 0) return;
      var b = document.createElement('div');
      b.style.cssText = 'position:fixed;left:' + (e.clientX - 17) + 'px;top:' + (e.clientY - 17) + 'px;width:34px;height:34px;border-radius:50%;border:3px solid #e85d26;pointer-events:none;z-index:200;animation:dd-burst .5s ease-out forwards';
      var c = document.createElement('div');
      c.style.cssText = 'position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#e85d26';
      b.appendChild(c);
      document.body.appendChild(b);
      setTimeout(function () { b.remove(); }, 550);
      var h = e.target.closest('h1,h2,h3,p');
      if (h) {
        h.style.animation = 'none';
        void h.offsetWidth;
        h.style.animation = 'dd-jolt .45s cubic-bezier(.2,.7,.2,1)';
      }
    });
  }

  /* ---- Headline word-by-word reveal ---- */
  function initHeadlineSplit() {
    var splitEls = Array.prototype.slice.call(document.querySelectorAll('[data-split]'));
    if (!splitEls.length) return;

    // Reduced motion: just make sure the headings are shown, don't animate.
    if (reduceMotion) {
      splitEls.forEach(function (el) {
        el.removeAttribute('data-reveal');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    function makeMask() {
      var mask = document.createElement('span');
      mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.12em;margin-bottom:-0.12em';
      var w = document.createElement('span');
      w.className = 'dd-w';
      w.style.cssText = 'display:inline-block;transform:translateY(115%)';
      mask.appendChild(w);
      return [mask, w];
    }

    splitEls.forEach(function (el) {
      el.removeAttribute('data-reveal');
      el.style.opacity = '1';
      el.style.transform = 'none';
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (tok) {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
            var pair = makeMask();
            pair[1].textContent = tok;
            frag.appendChild(pair[0]);
          });
          el.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          var pair = makeMask();
          el.replaceChild(pair[0], n);
          pair[1].appendChild(n);
        }
      });
    });

    function playSplit(el) {
      Array.prototype.slice.call(el.querySelectorAll('.dd-w')).forEach(function (w, i) {
        w.style.transition = 'transform .7s cubic-bezier(.2,.7,.2,1)';
        w.style.transitionDelay = (i * 45) + 'ms';
        w.style.transform = 'translateY(0)';
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { playSplit(en.target); io.unobserve(en.target); }
        });
      }, { threshold: 0.25 });
      splitEls.forEach(function (el) { io.observe(el); });
    } else {
      splitEls.forEach(playSplit);
    }
  }

  /* ---- Scroll reveals ---- */
  function initScrollReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    function show(el) {
      var i = parseInt(el.getAttribute('data-reveal'), 10) || 0;
      if (!reduceMotion) {
        el.style.transition = 'opacity .75s cubic-bezier(.2,.7,.2,1), transform .75s cubic-bezier(.2,.7,.2,1)';
        el.style.transitionDelay = (i * 90) + 'ms';
      }
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(show);
    }
  }

  /* ---- 3D plate: drop-in, idle spin, scroll rotation, chalk smoke ---- */
  function initPlate() {
    var stage = document.querySelector('.plate-stage');
    var plate3d = document.getElementById('plate-3d');
    var dropEl = document.getElementById('plate-drop');
    var pileEl = document.getElementById('chalk-pile');
    var bursts = {
      coarse: document.getElementById('chalk-burst'),
      fine: document.getElementById('chalk-burst-fine')
    };
    if (!stage || !plate3d) return;

    // Dev hook for tuning the burst without reloading: __ddChalk(0..1)
    window.__ddChalk = function (p) { chalkImpact(typeof p === 'number' ? p : 1, bursts, pileEl); };

    var desktopPlate = window.matchMedia('(min-width:1025px)').matches;

    // Idle Y-axis spin + scroll-linked rotation, pinned to viewport centre
    if (!reduceMotion && desktopPlate) {
      var t0 = performance.now();
      (function loop(now) {
        var idle = (now - t0) * 0.008;
        var rot = idle + window.scrollY * 0.22;
        plate3d.style.transform = 'rotateY(' + rot.toFixed(2) + 'deg)';
        requestAnimationFrame(loop);
      })(performance.now());
    }

    // Plate drop-in on load: fall, thud, chalk everywhere
    var wantDrop = !reduceMotion && desktopPlate && dropEl && dropEl.animate;
    if (!wantDrop) {
      if (dropEl) dropEl.style.transform = 'none';
      if (pileEl && (reduceMotion || !desktopPlate)) pileEl.style.display = 'none';
      return;
    }
    var D = 1250, DELAY = 250;
    dropEl.animate([
      { transform: 'translateY(-120vh)', offset: 0, easing: 'cubic-bezier(.6,0,.95,.45)' },
      { transform: 'translateY(0)', offset: 0.56, easing: 'cubic-bezier(.2,.7,.35,1)' },
      { transform: 'translateY(-32px)', offset: 0.7, easing: 'cubic-bezier(.55,0,.85,.45)' },
      { transform: 'translateY(0)', offset: 0.82, easing: 'cubic-bezier(.25,.7,.4,1)' },
      { transform: 'translateY(-9px)', offset: 0.91, easing: 'cubic-bezier(.55,0,.85,.5)' },
      { transform: 'translateY(0)', offset: 1 }
    ], { duration: D, delay: DELAY, fill: 'both' });
    setTimeout(function () { chalkImpact(1, bursts, pileEl); }, DELAY + D * 0.56);
    setTimeout(function () { chalkImpact(0.3, bursts, pileEl); }, DELAY + D * 0.82);
  }

  // Chalk burst at the plate's landing point. power: 1 = first slam, <1 = rebound tap.
  // Realism model: chalk is heavier than smoke. A drag-damped burst (violent
  // start, near-dead stop), volumetric puffs lit from the upper-left, depth
  // bands split across two turbulence layers, and dust that finally SETTLES
  // downward instead of rising away like smoke.
  function chalkImpact(power, bursts, pileEl) {
    if (pileEl && power === 1 && pileEl.animate) {
      pileEl.style.transformOrigin = '50% 100%';
      pileEl.animate([
        { transform: 'translateX(-50%) scale(1,1)', opacity: 1 },
        { transform: 'translateX(-50%) scale(1.4,.2)', opacity: 0 }
      ], { duration: 420, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    }
    document.querySelectorAll('[data-shake]').forEach(function (el) {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'dd-shake ' + Math.round(420 * power + 120) + 'ms cubic-bezier(.36,.07,.19,.97) 1';
    });
    var coarseEl = bursts && bursts.coarse;
    var fineEl = (bursts && bursts.fine) || coarseEl;
    if (!coarseEl || !coarseEl.animate) return;

    var R = Math.random;
    // irregular blob outline so no two lobes share a silhouette
    function irregular() {
      function v() { return (38 + R() * 24) + '%'; }
      return v() + ' ' + v() + ' ' + v() + ' ' + v() + ' / ' + v() + ' ' + v() + ' ' + v() + ' ' + v();
    }
    // volumetric lobe: bright chalk highlight (upper-left key light), warm-gray
    // body, dusky rim. The shading gradient is what makes puffs read as 3D.
    function lobeBg(a, hx, hy) {
      return 'radial-gradient(circle at ' + hx + '% ' + hy + '%,rgba(248,246,240,' + a.toFixed(3) + '),rgba(213,209,199,' + (a * 0.55).toFixed(3) + ') 42%,rgba(150,146,137,' + (a * 0.22).toFixed(3) + ') 65%,rgba(150,146,137,0) 78%)';
    }

    // pressure shockwave: a thin dust ring kicked out along the ground, gone fast
    var ring = document.createElement('div');
    ring.style.cssText = 'position:absolute;left:-70px;bottom:-16px;width:140px;height:38px;border-radius:50%;border:2px solid rgba(236,233,226,.38);filter:blur(3px);will-change:transform,opacity';
    coarseEl.appendChild(ring);
    ring.animate([
      { transform: 'scale(.25,.3)', opacity: .9, easing: 'cubic-bezier(.05,.85,.2,1)' },
      { transform: 'scale(4.6,2.6)', opacity: 0 }
    ], { duration: 480 * (0.7 + 0.3 * power) }).onfinish = function () { ring.remove(); };

    // low ground wash rolling out from under the plate
    var wash = document.createElement('div');
    wash.style.cssText = 'position:absolute;left:-130px;bottom:-30px;width:260px;height:54px;border-radius:50%;background:radial-gradient(ellipse at 50% 55%,rgba(240,237,229,.42),rgba(240,237,229,0) 72%);filter:blur(10px);will-change:transform,opacity';
    coarseEl.appendChild(wash);
    wash.animate([
      { transform: 'scale(.3,.4)', opacity: .85, easing: 'cubic-bezier(.06,.85,.25,1)' },
      { transform: 'scale(3.6,1.7)', opacity: 0 }
    ], { duration: 1200 * (0.6 + 0.4 * power) }).onfinish = function () { wash.remove(); };

    // dense mound of dust right at the impact point: violent pop (72% size by
    // 7% of the timeline), long dragged dissolve, then a sink back toward the
    // floor at the end — chalk settles, smoke rises
    var core = document.createElement('div');
    core.style.cssText = 'position:absolute;left:-110px;bottom:-34px;width:220px;height:104px;border-radius:44% 56% 52% 48% / 60% 54% 46% 40%;background:' + lobeBg(0.6, 38, 30) + ';filter:blur(11px);will-change:transform,opacity';
    coarseEl.appendChild(core);
    core.animate([
      { transform: 'scale(.22,.16)', opacity: 0, easing: 'cubic-bezier(.05,.9,.25,1)' },
      { transform: 'scale(1.12,.98)', opacity: .95, offset: .07, easing: 'ease-out' },
      { transform: 'scale(1.75,1.45) translateY(-20px)', opacity: .5, offset: .5, easing: 'ease-in-out' },
      { transform: 'scale(2.4,1.9) translateY(-38px)', opacity: .18, offset: .82, easing: 'ease-in' },
      { transform: 'scale(2.6,2.05) translateY(-26px)', opacity: 0 }
    ], { duration: 2600 * (0.6 + 0.4 * power) }).onfinish = function () { core.remove(); };

    // billowing dust: clusters of overlapping shaded lobes. Drag physics —
    // 55% of the travel is spent by 6% of the timeline, 88% by 18%, then the
    // cloud nearly stops, hangs, and settles downward as it thins out.
    var nCluster = Math.round(10 * power);
    for (var c = 0; c < nCluster; c++) {
      var ang = (14 + R() * 152) * Math.PI / 180;
      var dist = (70 + R() * 310) * power;
      var bx = Math.cos(ang) * dist * 1.5;
      var by = -Math.sin(ang) * dist * 0.5 - 14;
      var rise = 30 + R() * 90;
      var drift = (R() - 0.5) * 80;
      var sink = 10 + R() * 16;
      var depth = R();                                  // 0 = near-core crisp, 1 = far soft
      var layerEl = R() < 0.45 ? fineEl : coarseEl;     // split edge character across the two filters
      var lit = ang > Math.PI / 2 ? 1 : 0.72;           // key light upper-left: left-going puffs brighter
      var sx = Math.abs(Math.cos(ang)) > 0.6 ? 1.3 : 0.92; // early stretch along travel direction
      var baseDur = (3200 + R() * 2800) * (0.55 + 0.45 * power);
      var lobes = 3 + Math.floor(R() * 2);
      for (var j = 0; j < lobes; j++) {
        var p = document.createElement('div');
        var s = (40 + R() * 84) * (1 + depth * 0.5);
        var ox = (R() - 0.5) * s * 0.9;
        var oy = (R() - 0.5) * s * 0.55;
        var o = (0.26 + R() * 0.3) * lit * (1 - depth * 0.35);
        var rot = (R() - 0.5) * 100;
        var endS = 2.0 + R() * 1.2;
        var blur = 4 + depth * 11 + R() * 2;
        p.style.cssText = 'position:absolute;left:' + (-s / 2 + ox) + 'px;bottom:' + (-s / 2 + oy) + 'px;width:' + s + 'px;height:' + (s * (0.78 + R() * 0.35)) + 'px;border-radius:' + irregular() + ';background:' + lobeBg(o + 0.18, 28 + R() * 16, 22 + R() * 16) + ';filter:blur(' + blur.toFixed(1) + 'px);will-change:transform,opacity';
        layerEl.appendChild(p);
        (function (p, bx, by, rot, o, endS, rise, drift, sink, sx, baseDur) {
          p.animate([
            { transform: 'translate(0,0) rotate(0deg) scale(' + (0.2 * sx).toFixed(2) + ',.15)', opacity: 0, easing: 'cubic-bezier(.05,.9,.2,1)' },
            { transform: 'translate(' + (bx * 0.55) + 'px,' + (by * 0.6) + 'px) rotate(' + (rot * 0.3) + 'deg) scale(' + (0.8 * sx).toFixed(2) + ',.62)', opacity: o, offset: 0.06, easing: 'cubic-bezier(.1,.75,.3,1)' },
            { transform: 'translate(' + (bx * 0.88) + 'px,' + (by * 0.95) + 'px) rotate(' + (rot * 0.55) + 'deg) scale(' + (1.1 + R() * 0.3).toFixed(2) + ')', opacity: o * 0.92, offset: 0.18, easing: 'ease-out' },
            { transform: 'translate(' + (bx + drift * 0.5) + 'px,' + (by - rise * 0.6) + 'px) rotate(' + (rot * 0.8) + 'deg) scale(' + (endS * 0.85).toFixed(2) + ')', opacity: o * 0.45, offset: 0.6, easing: 'ease-in-out' },
            { transform: 'translate(' + (bx + drift * 0.85) + 'px,' + (by - rise) + 'px) rotate(' + (rot * 0.95) + 'deg) scale(' + (endS * 0.97).toFixed(2) + ')', opacity: o * 0.18, offset: 0.85, easing: 'ease-in' },
            { transform: 'translate(' + (bx + drift) + 'px,' + (by - rise + sink) + 'px) rotate(' + rot + 'deg) scale(' + endS.toFixed(2) + ')', opacity: 0 }
          ], { duration: baseDur * (0.85 + R() * 0.3) }).onfinish = function () { p.remove(); };
        })(p, bx, by, rot, o, endS, rise, drift, sink, sx, baseDur);
      }
    }

    // near-camera puffs: huge, dim, heavily blurred — a depth-of-field pass
    var nFg = Math.round(2 * power);
    for (var f = 0; f < nFg; f++) {
      var fg = document.createElement('div');
      var fs = 240 + R() * 120;
      var fdx = (R() < 0.5 ? -1 : 1) * (120 + R() * 220);
      var fo = 0.07 + R() * 0.04;
      fg.style.cssText = 'position:absolute;left:' + (-fs / 2) + 'px;bottom:' + (-fs / 3) + 'px;width:' + fs + 'px;height:' + (fs * 0.72) + 'px;border-radius:50%;background:radial-gradient(circle at 40% 34%,rgba(230,227,219,' + fo.toFixed(3) + '),rgba(230,227,219,0) 70%);filter:blur(18px);will-change:transform,opacity';
      fineEl.appendChild(fg);
      (function (fg, fdx) {
        fg.animate([
          { transform: 'translate(0,20px) scale(.45)', opacity: 0, easing: 'cubic-bezier(.1,.8,.3,1)' },
          { transform: 'translate(' + (fdx * 0.5) + 'px,-30px) scale(1.15)', opacity: 1, offset: .22, easing: 'ease-out' },
          { transform: 'translate(' + fdx + 'px,-40px) scale(1.9)', opacity: 0 }
        ], { duration: 2400 + R() * 900 }).onfinish = function () { fg.remove(); };
      })(fg, fdx);
    }

    // ground-hugging surge: flat dim clouds that skid outward and stop hard
    var nSurge = Math.round(8 * power);
    for (var i = 0; i < nSurge; i++) {
      var g = document.createElement('div');
      var w = 90 + R() * 130, h = w * 0.32;
      var side = R() < 0.5 ? -1 : 1;
      var gdist = side * (110 + R() * 330) * power;
      var go = 0.16 + R() * 0.16;
      g.style.cssText = 'position:absolute;left:' + (-w / 2) + 'px;bottom:' + (-h / 2 + 6) + 'px;width:' + w + 'px;height:' + h + 'px;border-radius:50%;background:radial-gradient(ellipse at 50% 55%,rgba(228,224,215,' + go.toFixed(3) + '),rgba(228,224,215,0) 70%);filter:blur(' + (8 + R() * 6).toFixed(1) + 'px);will-change:transform,opacity';
      coarseEl.appendChild(g);
      (function (g, gdist, go) {
        g.animate([
          { transform: 'translate(0,0) scale(.2,.3)', opacity: Math.min(1, go + 0.25), easing: 'cubic-bezier(.04,.9,.2,1)' },
          { transform: 'translate(' + (gdist * 0.75) + 'px,-3px) scale(1,.9)', opacity: go, offset: 0.16, easing: 'ease-out' },
          { transform: 'translate(' + gdist + 'px,' + (-8 - R() * 18) + 'px) scale(' + (1.7 + R() * 0.8).toFixed(2) + ',1.5)', opacity: 0 }
        ], { duration: (2200 + R() * 1600) * (0.55 + 0.45 * power) }).onfinish = function () { g.remove(); };
      })(g, gdist, go);
    }

    // lingering haze: near-neutral suspended dust that drifts up briefly,
    // hangs, then settles back down as it dissolves
    var nHaze = Math.round(4 * power);
    for (var k = 0; k < nHaze; k++) {
      var hz = document.createElement('div');
      var hs = 220 + R() * 240;
      var hx = (R() - 0.5) * 320 * power;
      var hrise = 28 + R() * 16;
      var ho = 0.08 + R() * 0.08;
      hz.style.cssText = 'position:absolute;left:' + (-hs / 2) + 'px;bottom:' + (-hs / 3) + 'px;width:' + hs + 'px;height:' + (hs * 0.62) + 'px;border-radius:50%;background:radial-gradient(ellipse at 46% 42%,rgba(203,199,190,' + ho.toFixed(3) + '),rgba(203,199,190,0) 72%);filter:blur(18px);will-change:transform,opacity';
      fineEl.appendChild(hz);
      (function (hz, hx, hrise) {
        hz.animate([
          { transform: 'translate(0,10px) scale(.35)', opacity: 0, easing: 'cubic-bezier(.1,.8,.3,1)' },
          { transform: 'translate(' + (hx * 0.5) + 'px,-10px) scale(1)', opacity: 1, offset: 0.12, easing: 'ease-out' },
          { transform: 'translate(' + (hx * 0.8) + 'px,-' + hrise + 'px) scale(1.3)', opacity: .7, offset: 0.5, easing: 'ease-in-out' },
          { transform: 'translate(' + (hx * 0.95) + 'px,-' + (hrise + 6) + 'px) scale(1.48)', opacity: .35, offset: 0.78, easing: 'ease-in-out' },
          { transform: 'translate(' + hx + 'px,-' + (hrise - 10) + 'px) scale(1.6)', opacity: 0 }
        ], { duration: (5600 + R() * 2800) * (0.5 + 0.5 * power) }).onfinish = function () { hz.remove(); };
      })(hz, hx, hrise);
    }

    // grit: launches as a motion streak (elongated along its path), rounds out
    // mid-flight, arcs under gravity, settles on the floor, then fades
    var nSpeck = Math.round(22 * power);
    for (var m = 0; m < nSpeck; m++) {
      var sp = document.createElement('div');
      var ss = 1.5 + R() * 4;
      var sang = (8 + R() * 164) * Math.PI / 180;
      var sv = (160 + R() * 420) * power;
      var dx = Math.cos(sang) * sv * 1.35;
      var up = Math.sin(sang) * sv * 0.85 + 34;
      var aim = (Math.atan2(-up, dx) * 180 / Math.PI).toFixed(1);
      sp.style.cssText = 'position:absolute;left:0;bottom:0;width:' + ss.toFixed(1) + 'px;height:' + ss.toFixed(1) + 'px;border-radius:50%;background:rgba(246,243,236,' + (0.3 + R() * 0.35).toFixed(3) + ');will-change:transform,opacity';
      coarseEl.appendChild(sp);
      (function (sp, dx, up, aim) {
        sp.animate([
          { transform: 'translate(0,0) rotate(' + aim + 'deg) scale(2.8,.9)', opacity: 1, easing: 'cubic-bezier(.2,.6,.45,1)' },
          { transform: 'translate(' + (dx * 0.35) + 'px,' + (-up * 0.7) + 'px) rotate(' + aim + 'deg) scale(1.6,1)', opacity: 1, offset: 0.22, easing: 'cubic-bezier(.3,.6,.6,1)' },
          { transform: 'translate(' + (dx * 0.6) + 'px,' + (-up) + 'px) rotate(' + aim + 'deg) scale(1)', opacity: 1, offset: 0.4, easing: 'cubic-bezier(.55,0,.85,.5)' },
          { transform: 'translate(' + dx + 'px,' + (up * 0.35 + 30) + 'px) rotate(' + aim + 'deg) scale(1)', opacity: .9, offset: 0.92, easing: 'linear' },
          { transform: 'translate(' + (dx * 1.02) + 'px,' + (up * 0.35 + 32) + 'px) rotate(' + aim + 'deg) scale(1)', opacity: 0 }
        ], { duration: 900 + R() * 700 }).onfinish = function () { sp.remove(); };
      })(sp, dx, up, aim);
    }
  }

  /* ---- Work section: horizontal pan on vertical scroll (desktop) ----
     The section is made (100vh + distance) tall; a sticky pin holds the
     cards on screen while a rAF scrub maps scroll progress 1:1 onto
     translate3d. When the distance is spent the sticky releases and the
     page scrolls on normally. Collapses to the plain grid on mobile,
     under prefers-reduced-motion, and without JS. */
  function initWorkPan() {
    var section = document.getElementById('work');
    var pin = section && section.querySelector('.work-pin');
    var track = section && section.querySelector('.work-track');
    if (!section || !pin || !track || reduceMotion) return;

    var mq = window.matchMedia('(min-width:1025px)');
    var distance = 0, top = 0, active = false, lastX = null;

    function measure() {
      if (!mq.matches) {
        if (active) {
          section.classList.remove('work-pan-active');
          section.style.removeProperty('--work-distance');
          track.style.transform = '';
          active = false; lastX = null;
        }
        return;
      }
      section.classList.add('work-pan-active');
      track.style.transform = 'none';
      section.style.setProperty('--work-distance', '0px');
      // one card = one screen: slide width tracks the wrap's inner width
      var wrap = pin.querySelector('.wrap');
      if (wrap) section.style.setProperty('--work-slide', wrap.clientWidth + 'px');
      var pinR = pin.getBoundingClientRect();
      var trackR = track.getBoundingClientRect();
      // horizontal travel: everything past the pin's right edge + end padding
      distance = Math.max(0, Math.round((trackR.left - pinR.left) + track.scrollWidth - pin.clientWidth + 48));
      if (!distance) {
        // track already fits (very wide viewport): no pan needed
        section.classList.remove('work-pan-active');
        section.style.removeProperty('--work-distance');
        track.style.transform = '';
        active = false; lastX = null;
        return;
      }
      section.style.setProperty('--work-distance', distance + 'px');
      top = section.getBoundingClientRect().top + window.scrollY;
      active = true; lastX = null;
    }

    (function frame() {
      if (active && distance) {
        var p = Math.min(1, Math.max(0, (window.scrollY - top) / distance));
        var x = Math.round(-p * distance * 100) / 100;
        if (x !== lastX) {
          track.style.transform = 'translate3d(' + x + 'px,0,0)';
          lastX = x;
        }
      }
      requestAnimationFrame(frame);
    })();

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (mq.addEventListener) mq.addEventListener('change', measure);
  }

  /* ---- Teardown form: real endpoint (fetch) with mailto: fallback ---- */
  function initForm() {
    var form = document.getElementById('teardown-form');
    if (!form) return;
    var btn = document.getElementById('form-button');
    var statusEl = document.getElementById('form-status');
    var note = form.querySelector('[data-default-note]');
    var nameEl = document.getElementById('form-name');
    var siteEl = document.getElementById('form-site');
    var emailEl = document.getElementById('form-email');
    var defaultLabel = btn.textContent;

    function setStatus(msg, kind) {
      statusEl.textContent = msg || '';
      statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
      statusEl.hidden = !msg;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (nameEl.value || '').trim();
      var site = (siteEl.value || '').trim();
      var email = (emailEl.value || '').trim();

      if (!name || !email) {
        setStatus("Add your name and email and we'll take it from there.", 'err');
        (name ? emailEl : nameEl).focus();
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setStatus('That email looks off. Mind checking it?', 'err');
        emailEl.focus();
        return;
      }

      if (FORM_ENDPOINT) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
        if (note) note.hidden = true;
        setStatus('', '');
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name: name, website: site, email: email })
        }).then(function (r) {
          if (!r.ok) throw new Error('bad status');
          form.reset();
          btn.textContent = 'Sent ✓';
          setStatus("Got it. We'll reply within one business day.", 'ok');
        }).catch(function () {
          btn.disabled = false;
          btn.textContent = defaultLabel;
          setStatus('Something went wrong. Email us at ' + CONTACT_EMAIL + '.', 'err');
        });
      } else {
        // Faithful fallback to the original design-tool behaviour
        var subject = encodeURIComponent('Free teardown request' + (name ? ' — ' + name : ''));
        var body = encodeURIComponent('Name: ' + name + '\nWebsite: ' + site + '\nReply-to: ' + email + '\n\nTell us anything else about your business here.');
        btn.textContent = 'Opening your email app...';
        if (note) note.hidden = true;
        setStatus('Opening your email app...', 'ok');
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
        setTimeout(function () {
          btn.textContent = defaultLabel;
          setStatus('', '');
          if (note) note.hidden = false;
        }, 3000);
      }
    });
  }

})();
