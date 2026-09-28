/* =====================================================
   Master KOMO — lending skriptlari
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
  tick();
  setInterval(tick, 1000);

  /* ---------- 2. Scroll paytida ochilish animatsiyasi ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('is-visible'); });
  }

  /* ---------- 3. CTA tugma -> ro'yxatga silliq o'tish ---------- */
  document.querySelectorAll('.js-scroll').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = this.getAttribute('href');
      var target = id && document.querySelector(id);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var input = target.querySelector('input');
        if (input) setTimeout(function () { input.focus(); }, 500);
      }
    });
  });

  /* ---------- 3b. Karset slayderi (2-karta) ---------- */
  (function () {
    var root = document.getElementById('korsetSlider');
    if (!root) return;
    var track = root.querySelector('.kslider__track');
    var slides = root.querySelectorAll('.kslide');
    var dots = root.querySelectorAll('.kdot');
    var prev = root.querySelector('.kslider__nav--prev');
    var next = root.querySelector('.kslider__nav--next');
    var n = slides.length, i = 0;

    function go(k) {
      i = (k + n) % n;                       // aylanadi (wrap)
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === i); });
    }
    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });
    dots.forEach(function (d, idx) { d.addEventListener('click', function () { go(idx); }); });

    // Barmoq bilan surish (swipe)
    var x0 = null;
    root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); }
      x0 = null;
    }, { passive: true });

    go(0);
  })();

  /* ---------- 4. Ro'yxat formasi ---------- */
  var form = document.getElementById('regForm');
  var success = document.getElementById('regSuccess');

  function isPhone(v) {
    var digits = v.replace(/\D/g, '');
    return digits.length >= 9;
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.name;
      var phone = form.phone;
      var ok = true;

      [name, phone].forEach(function (f) { f.classList.remove('invalid'); });

      if (name.value.trim().length < 2) { name.classList.add('invalid'); ok = false; }
      if (!isPhone(phone.value)) { phone.classList.add('invalid'); ok = false; }
      if (!ok) {
        var bad = form.querySelector('.invalid');
        if (bad) bad.focus();
        return;
      }

      // ISH: bu yerda ma'lumotni o'z serveringiz / Telegram bot / Google Sheets ga yuborishingiz mumkin.
      // Namuna sifatida ma'lumotlar konsolga chiqariladi:
      var data = { name: name.value.trim(), phone: phone.value.trim(), ts: new Date().toISOString() };
      console.log('Yangi ro\'yxat:', data);

      // Muvaffaqiyat ekranini ko'rsatish
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // yozayotganda "invalid" belgisini olib tashlash
    form.querySelectorAll('input').forEach(function (inp) {
      inp.addEventListener('input', function () { this.classList.remove('invalid'); });
    });
  }

  /* ---------- 5. Yil footerda ---------- */
  // (kelajakda kerak bo'lsa dinamik yil shu yerda qo'yiladi)
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
