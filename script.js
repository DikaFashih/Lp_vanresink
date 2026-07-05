(function(){
  "use strict";

  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var navLabel = document.getElementById('navLabel');
  var overlay = document.getElementById('overlayMenu');
  var body = document.body;
  var pathFill = document.getElementById('pathFill');
  var yearEl = document.getElementById('year');

  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------- keep the menu reveal circle centered on the burger icon itself ---------- */
  var burgerIcon = navToggle.querySelector('.burger');
  function updateMenuOrigin(){
    var r = (burgerIcon || navToggle).getBoundingClientRect();
    var ox = r.left + r.width / 2;
    var oy = r.top + r.height / 2;
    document.documentElement.style.setProperty('--menu-ox', ox + 'px');
    document.documentElement.style.setProperty('--menu-oy', oy + 'px');
  }
  updateMenuOrigin();
  window.addEventListener('resize', updateMenuOrigin);
  window.addEventListener('scroll', updateMenuOrigin, { passive: true });

  /* ---------- header scroll state ---------- */
  function onScroll(){
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
    updatePathFill();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- fullscreen overlay menu ---------- */
  function closeMenu(){
    body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navLabel.textContent = 'Menu';
  }
  function openMenu(){
    body.classList.add('menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navLabel.textContent = 'Close';
  }
  navToggle.addEventListener('click', function(){
    if (body.classList.contains('menu-open')) closeMenu();
    else openMenu();
  });
  overlay.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- signature path rail: fills as the guest scrolls the page ---------- */
  function updatePathFill(){
    if (!pathFill) return;
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var max = (doc.scrollHeight - doc.clientHeight) || 1;
    var progress = Math.min(1, Math.max(0, scrollTop / max));
    pathFill.style.strokeDashoffset = String(1 - progress);
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- newsletter form (front-end only demo) ---------- */
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterNote = document.getElementById('newsletterNote');
  if (newsletterForm){
    newsletterForm.addEventListener('submit', function(e){
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      if (newsletterNote){
        newsletterNote.textContent = 'Thank you — check ' + input.value + ' for a confirmation shortly.';
      }
      newsletterForm.reset();
    });
  }

  /* ---------- gentle parallax on the hero smoke plume ---------- */
  var plume = document.querySelector('.plume');
  if (plume && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var t = 0;
    (function animatePlume(){
      t += 0.006;
      var dy = Math.sin(t) * 3;
      plume.style.transform = 'translateY(' + dy + 'px)';
      requestAnimationFrame(animatePlume);
    })();
  }

})();