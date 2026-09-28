/* =====================================================
   Master KOMO — VARIANT B skriptlari
   ===================================================== */
(function () {
  'use strict';

  /* ---------- 1. 2 daqiqalik sanoq — har refreshda 02:00 dan orqaga ---------- */
  var cdMins = document.querySelector('[data-cd="mins"]');
  var cdSecs = document.querySelector('[data-cd="secs"]');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var remain = 120;   // 02:00
  function tick() {
    if (!cdMins || !cdSecs) return;
    cdMins.textContent = pad(Math.floor(remain / 60));
    cdSecs.textContent = pad(remain % 60);
    if (remain > 0) remain--;
  }
  tick(); setInterval(tick, 1000);

  /* ---------- 2. Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('is-visible'); });
  }

  /* ---------- 3. Karset galereyasi (auto + nuqta) ---------- */
  (function () {
    var g = document.getElementById('korsetGallery');
    if (!g) return;
    var imgs = g.querySelectorAll('img');
    var dots = g.querySelectorAll('.gdot');
    var n = imgs.length, i = 0, timer = null;
    function go(k) {
      i = (k + n) % n;
      imgs.forEach(function (im, idx) { im.classList.toggle('is-active', idx === i); });
      dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === i); });
    }
    dots.forEach(function (d, idx) { d.addEventListener('click', function () { go(idx); restart(); }); });
    function restart() { if (timer) clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 3200); }
    restart();
  })();

  /* ---------- 4. Ro'yxat formasi ---------- */
  var form = document.getElementById('regForm');
  var success = document.getElementById('regSuccess');
  function isPhone(v) { return v.replace(/\D/g, '').length >= 9; }
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.name, phone = form.phone, ok = true;
      [name, phone].forEach(function (el) { el.classList.remove('err'); });
      if (!name.value.trim()) { name.classList.add('err'); ok = false; }
      if (!isPhone(phone.value)) { phone.classList.add('err'); ok = false; }
      if (!ok) return;
      // ISH: bu yerda ma'lumotni CRM/Telegram botga yuboring
      form.querySelectorAll('.field, .btn, .regform__note').forEach(function (el) { el.style.display = 'none'; });
      if (success) success.hidden = false;
    });
  }
})();
/* ===================== RO'YXAT MODALI ===================== */
(function () {
  'use strict';
  var modal = document.getElementById('regModal');
  if (!modal) return;
  var form = document.getElementById('modalForm');
  var ok = document.getElementById('modalOk');
  function openModal(e) {
    if (e) e.preventDefault();
    modal.hidden = false; document.body.style.overflow = 'hidden';
    var n = form && form.querySelector('input[name="name"]');
    if (n) setTimeout(function () { n.focus(); }, 60);
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
  document.querySelectorAll('.btn--cta, .mcta__btn, .cta, .btn--gold').forEach(function (b) {
    b.addEventListener('click', openModal);
  });
  if (location.search.indexOf('modal=1') > -1) openModal();
  modal.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeModal); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  function isPhone(v) { return v.replace(/\D/g, '').length === 9; }
  var phoneInput = form && form.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.setAttribute('inputmode', 'numeric');
    phoneInput.addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '').slice(0, 9);
      this.value = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
    });
  }
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.name, phone = form.phone, valid = true;
      [name, phone].forEach(function (el) { el.classList.remove('err'); });
      if (!name.value.trim()) { name.classList.add('err'); valid = false; }
      if (!isPhone(phone.value)) { phone.classList.add('err'); valid = false; }
      if (!valid) return;
      window.location.href = 'thanks.html';
    });
  }
})();
