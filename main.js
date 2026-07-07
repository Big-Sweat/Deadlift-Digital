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
    initForm();
  });

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
    var burstEl = document.getElementById('chalk-burst');
    if (!stage || !plate3d) return;

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
    setTimeout(function () { chalkImpact(1, burstEl, pileEl); }, DELAY + D * 0.56);
    setTimeout(function () { chalkImpact(0.3, burstEl, pileEl); }, DELAY + D * 0.82);
  }

  // Chalk burst at the plate's landing point. power: 1 = first slam, <1 = rebound tap
  function chalkImpact(power, burstEl, pileEl) {
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
    if (!burstEl || !burstEl.animate) return;

    // low ground wash rolling out from under the plate
    var wash = document.createElement('div');
    wash.style.cssText = 'position:absolute;left:-130px;bottom:-30px;width:260px;height:54px;border-radius:50%;background:radial-gradient(ellipse at 50% 55%,rgba(242,240,236,.5),rgba(242,240,236,0) 72%);filter:blur(10px);will-change:transform,opacity';
    burstEl.appendChild(wash);
    wash.animate([
      { transform: 'scale(.3,.4)', opacity: .85, easing: 'cubic-bezier(.1,.8,.3,1)' },
      { transform: 'scale(3.6,1.7)', opacity: 0 }
    ], { duration: 1200 * (0.6 + 0.4 * power) }).onfinish = function () { wash.remove(); };

    // dense mound of dust right at the impact point
    var core = document.createElement('div');
    core.style.cssText = 'position:absolute;left:-110px;bottom:-34px;width:220px;height:104px;border-radius:44% 56% 52% 48% / 60% 54% 46% 40%;background:radial-gradient(ellipse at 50% 62%,rgba(242,240,236,.6),rgba(242,240,236,.3) 50%,rgba(242,240,236,0) 74%);filter:blur(12px);will-change:transform,opacity';
    burstEl.appendChild(core);
    core.animate([
      { transform: 'scale(.25,.2)', opacity: 0, easing: 'cubic-bezier(.12,.8,.3,1)' },
      { transform: 'scale(1.15,1)', opacity: .95, offset: .1, easing: 'ease-out' },
      { transform: 'scale(1.8,1.5) translateY(-24px)', opacity: .45, offset: .55, easing: 'ease-in-out' },
      { transform: 'scale(2.5,2) translateY(-52px)', opacity: 0 }
    ], { duration: 2400 * (0.6 + 0.4 * power) }).onfinish = function () { core.remove(); };

    // billowing smoke: clusters of overlapping soft lobes that expand, roll, and thin out
    var nCluster = Math.round(9 * power);
    for (var c = 0; c < nCluster; c++) {
      var ang = (14 + Math.random() * 152) * Math.PI / 180;
      var dist = (60 + Math.random() * 300) * power;
      var bx = Math.cos(ang) * dist * 1.5;
      var by = -Math.sin(ang) * dist * 0.5 - 14;
      var rise = 40 + Math.random() * 110;
      var drift = (Math.random() - 0.5) * 90;
      var baseDur = (3000 + Math.random() * 2600) * (0.55 + 0.45 * power);
      var lobes = 3 + Math.floor(Math.random() * 2);
      for (var j = 0; j < lobes; j++) {
        var p = document.createElement('div');
        var s = 44 + Math.random() * 90;
        var ox = (Math.random() - 0.5) * s * 0.9;
        var oy = (Math.random() - 0.5) * s * 0.6;
        var o = 0.3 + Math.random() * 0.25;
        var rot = (Math.random() - 0.5) * 110;
        var endS = 2.1 + Math.random() * 1.3;
        var br = (38 + Math.random() * 24) + '% ' + (38 + Math.random() * 24) + '% ' + (38 + Math.random() * 24) + '% ' + (38 + Math.random() * 24) + '% / ' + (38 + Math.random() * 24) + '% ' + (38 + Math.random() * 24) + '% ' + (38 + Math.random() * 24) + '% ' + (38 + Math.random() * 24) + '%';
        p.style.cssText = 'position:absolute;left:' + (-s / 2 + ox) + 'px;bottom:' + (-s / 2 + oy) + 'px;width:' + s + 'px;height:' + (s * (0.8 + Math.random() * 0.35)) + 'px;border-radius:' + br + ';background:radial-gradient(circle at ' + (36 + Math.random() * 26) + '% ' + (34 + Math.random() * 26) + '%,rgba(240,238,233,.6),rgba(240,238,233,.32) 48%,rgba(240,238,233,0) 72%);filter:blur(' + (9 + Math.random() * 6) + 'px);will-change:transform,opacity';
        burstEl.appendChild(p);
        (function (p) {
          p.animate([
            { transform: 'translate(0,0) rotate(0deg) scale(.22,.18)', opacity: 0, easing: 'cubic-bezier(.15,.8,.3,1)' },
            { transform: 'translate(' + (bx * 0.5) + 'px,' + (by * 0.6) + 'px) rotate(' + (rot * 0.25) + 'deg) scale(.72,.66)', opacity: o, offset: 0.08, easing: 'cubic-bezier(.2,.6,.4,1)' },
            { transform: 'translate(' + (bx * 0.85) + 'px,' + (by * 0.95) + 'px) rotate(' + (rot * 0.55) + 'deg) scale(' + (1.05 + Math.random() * 0.35) + ')', opacity: o * 0.85, offset: 0.32, easing: 'ease-out' },
            { transform: 'translate(' + (bx + drift * 0.6) + 'px,' + (by - rise * 0.55) + 'px) rotate(' + (rot * 0.82) + 'deg) scale(' + (endS * 0.82) + ')', opacity: o * 0.4, offset: 0.68, easing: 'ease-in-out' },
            { transform: 'translate(' + (bx + drift) + 'px,' + (by - rise) + 'px) rotate(' + rot + 'deg) scale(' + endS + ')', opacity: 0 }
          ], { duration: baseDur * (0.85 + Math.random() * 0.3) }).onfinish = function () { p.remove(); };
        })(p);
      }
    }

    // ground-hugging surge: flat clouds that skid outward along the floor
    var nSurge = Math.round(8 * power);
    for (var i = 0; i < nSurge; i++) {
      var g = document.createElement('div');
      var w = 90 + Math.random() * 130, h = w * 0.32;
      var side = Math.random() < 0.5 ? -1 : 1;
      var gdist = side * (110 + Math.random() * 330) * power;
      var go = 0.22 + Math.random() * 0.2;
      g.style.cssText = 'position:absolute;left:' + (-w / 2) + 'px;bottom:' + (-h / 2 + 6) + 'px;width:' + w + 'px;height:' + h + 'px;border-radius:50%;background:radial-gradient(ellipse at 50% 55%,rgba(249,248,245,' + go + '),rgba(246,244,240,0) 70%);filter:blur(' + (8 + Math.random() * 6) + 'px);will-change:transform,opacity';
      burstEl.appendChild(g);
      (function (g, gdist, go) {
        g.animate([
          { transform: 'translate(0,0) scale(.2,.3)', opacity: Math.min(1, go + 0.2), easing: 'cubic-bezier(.08,.82,.25,1)' },
          { transform: 'translate(' + (gdist * 0.7) + 'px,-4px) scale(1,.9)', opacity: go, offset: 0.18, easing: 'ease-out' },
          { transform: 'translate(' + gdist + 'px,' + (-10 - Math.random() * 26) + 'px) scale(' + (1.7 + Math.random() * 0.8) + ',1.5)', opacity: 0 }
        ], { duration: (2000 + Math.random() * 1600) * (0.55 + 0.45 * power) }).onfinish = function () { g.remove(); };
      })(g, gdist, go);
    }

    // lingering haze that hangs in the air before dissolving
    var nHaze = Math.round(4 * power);
    for (var k = 0; k < nHaze; k++) {
      var hz = document.createElement('div');
      var hs = 220 + Math.random() * 240;
      var hx = (Math.random() - 0.5) * 320 * power;
      var ho = 0.10 + Math.random() * 0.09;
      hz.style.cssText = 'position:absolute;left:' + (-hs / 2) + 'px;bottom:' + (-hs / 3) + 'px;width:' + hs + 'px;height:' + (hs * 0.62) + 'px;border-radius:50%;background:radial-gradient(ellipse at 50% 58%,rgba(248,247,244,' + ho + '),rgba(246,244,240,0) 72%);filter:blur(18px);will-change:transform,opacity';
      burstEl.appendChild(hz);
      (function (hz, hx) {
        hz.animate([
          { transform: 'translate(0,10px) scale(.35)', opacity: 0, easing: 'cubic-bezier(.2,.7,.4,1)' },
          { transform: 'translate(' + (hx * 0.5) + 'px,-12px) scale(1)', opacity: 1, offset: 0.14, easing: 'ease-out' },
          { transform: 'translate(' + (hx * 0.8) + 'px,-' + (30 + Math.random() * 30) + 'px) scale(1.35)', opacity: .65, offset: 0.55, easing: 'ease-in-out' },
          { transform: 'translate(' + hx + 'px,-' + (60 + Math.random() * 40) + 'px) scale(1.8)', opacity: 0 }
        ], { duration: (5200 + Math.random() * 3000) * (0.5 + 0.5 * power) }).onfinish = function () { hz.remove(); };
      })(hz, hx);
    }

    // sharp grit specks on a gravity arc, settling before they fade
    var nSpeck = Math.round(16 * power);
    for (var m = 0; m < nSpeck; m++) {
      var sp = document.createElement('div');
      var ss = 2 + Math.random() * 3;
      var sang = (8 + Math.random() * 164) * Math.PI / 180;
      var sv = (160 + Math.random() * 420) * power;
      var dx = Math.cos(sang) * sv * 1.35;
      var up = Math.sin(sang) * sv * 0.85 + 34;
      sp.style.cssText = 'position:absolute;left:0;bottom:0;width:' + ss + 'px;height:' + ss + 'px;border-radius:50%;background:rgba(250,249,246,' + (0.3 + Math.random() * 0.35) + ');will-change:transform,opacity';
      burstEl.appendChild(sp);
      (function (sp, dx, up) {
        sp.animate([
          { transform: 'translate(0,0)', opacity: 1, easing: 'cubic-bezier(.2,.6,.45,1)' },
          { transform: 'translate(' + (dx * 0.6) + 'px,' + (-up) + 'px)', opacity: 1, offset: 0.4, easing: 'cubic-bezier(.55,0,.85,.5)' },
          { transform: 'translate(' + dx + 'px,' + (up * 0.35 + 30) + 'px)', opacity: .9, offset: 0.92, easing: 'linear' },
          { transform: 'translate(' + (dx * 1.02) + 'px,' + (up * 0.35 + 32) + 'px)', opacity: 0 }
        ], { duration: 900 + Math.random() * 700 }).onfinish = function () { sp.remove(); };
      })(sp, dx, up);
    }
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
