/* FUJI WEB DESIGN 0円キャンペーンLP
   リビール / 数字カウントアップ / 進捗バー（固定CTAは常時表示でJS不要） */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* スクロールリビール（同じ親で少しずつ遅らせる） */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!reduce && 'IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (c) { return c.classList.contains('reveal'); });
        el.style.transitionDelay = (Math.max(0, sibs.indexOf(el)) % 6 * 70) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* 数字カウントアップ */
  var counters = Array.prototype.slice.call(document.querySelectorAll('.count'));
  var fmt = function (n) { return Math.round(n).toLocaleString('ja-JP'); };
  var run = function (el) {
    var to = parseFloat(el.getAttribute('data-to')) || 0;
    if (reduce || to === 0) { el.textContent = fmt(to); return; }
    var dur = 1400, t0 = null;
    var tick = function (t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* 進捗バー（data-fill のパーセントまで伸ばす） */
  var bars = Array.prototype.slice.call(document.querySelectorAll('.bar__fill'));
  var fillBar = function (el) {
    var pct = Math.max(0, Math.min(100, parseFloat(el.getAttribute('data-fill')) || 0));
    el.style.width = pct + '%';
  };

  if ('IntersectionObserver' in window) {
    var aio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.classList.contains('count')) run(e.target);
        if (e.target.classList.contains('bar__fill')) fillBar(e.target);
        aio.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { aio.observe(el); });
    bars.forEach(function (el) { aio.observe(el); });
  } else {
    counters.forEach(run); bars.forEach(fillBar);
  }
})();
