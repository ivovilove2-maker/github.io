(function () {
  // ─────────────────────────────────────────────
  // 메인: 스크롤하면 헤더 배경 생기기
  // ─────────────────────────────────────────────
  var hd = document.querySelector('.hd');
  if (hd && document.body.classList.contains('is-home')) {
    var onScroll = function () { hd.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 헤더 높이를 CSS에 전달 (파트너존 제목이 헤더에 가리지 않게)
  function setHeaderHeight() {
    if (hd) document.documentElement.style.setProperty('--hd-h', hd.offsetHeight + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  // ─────────────────────────────────────────────
  // 모바일 메뉴 열기/닫기
  // ─────────────────────────────────────────────
  var btn = document.getElementById('menuBtn');
  var gnb = document.getElementById('gnb');
  if (btn && gnb) {
    btn.addEventListener('click', function () {
      var open = gnb.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
  }

  // ─────────────────────────────────────────────
  // 고객문의 폼: 작성 내용으로 메일 프로그램 열기
  // ─────────────────────────────────────────────
  var form = document.getElementById('inqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var subject = '[고객문의][' + f.type.value + '] ' + f.company.value;
      var body =
        '회사명: ' + f.company.value + '\n' +
        '담당자명: ' + f.name.value + '\n' +
        '연락처: ' + f.tel.value + '\n' +
        '이메일: ' + f.email.value + '\n' +
        '문의 구분: ' + f.type.value + '\n\n' +
        '문의 내용:\n' + f.message.value;
      location.href = 'mailto:sehi0401@daum.net?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  // ─────────────────────────────────────────────
  // 메인 제목: 한 글자씩 시간차 등장 (단어 중간 줄바꿈 방지)
  // ─────────────────────────────────────────────
  (function () {
    var el = document.querySelector('[data-split]');
    if (!el) return;
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var i = 0;

    (function walk(node) {
      Array.from(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (tok) {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'w';
            Array.from(tok).forEach(function (c) {
              var s = document.createElement('span');
              s.className = 'ch';
              s.style.setProperty('--i', i++);
              s.textContent = c;
              w.appendChild(s);
            });
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    })(el);

    el.setAttribute('aria-label', label);
    // 설명·버튼은 마지막 글자가 나온 뒤에
    document.documentElement.style.setProperty('--after', (i * 0.055 + 0.6).toFixed(2) + 's');
  })();

    // ─────────────────────────────────────────────
  // 파트너존: 좌측 설명 + 우측 페이지 슬라이드
  // ─────────────────────────────────────────────
  (function () {
    var sec = document.getElementById('partners');
    if (!sec) return;
    var track = sec.querySelector('.pz-track');
    var dotsBox = sec.querySelector('.pz-dots');
    var numBox = sec.querySelector('.pz-num');
    var frame = sec.querySelector('.pz-frame');
    var logos = Array.from(sec.querySelectorAll('.pz-source li'));
    if (!track || !logos.length) return;

    var DELAY = 3000;     // 자동 넘김 간격 (ms)
    var cur = 0, pages = 1, per = 0, timer = null, visible = false;

    // 이미지가 없으면 alt의 회사명으로 대체
    logos.forEach(function (li) {
      var img = li.querySelector('img');
      if (!img) return;
      function fallback() {
        if (!img.parentNode) return;
        var s = document.createElement('span');
        s.textContent = img.alt;
        li.replaceChild(s, img);
        track.querySelectorAll('img').forEach(function (c) {
          if (c.getAttribute('src') === img.getAttribute('src')) {
            var t = document.createElement('span'); t.textContent = img.alt; c.replaceWith(t);
          }
        });
      }
      if (img.complete && img.naturalWidth === 0) fallback();
      else img.addEventListener('error', fallback);
    });

    function layout() {
      var w = window.innerWidth;
      if (w <= 640) return { cols: 2, per: 6 };
      if (w <= 1024) return { cols: 3, per: 6 };
      return { cols: 4, per: 8 };
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function build() {
      var L = layout();
      if (L.per === per) return;
      per = L.per;
      pages = Math.ceil(logos.length / per);
      track.innerHTML = '';
      dotsBox.innerHTML = '';

      for (var p = 0; p < pages; p++) {
        var page = document.createElement('ul');
        page.className = 'pz-page';
        page.style.setProperty('--cols', L.cols);
        logos.slice(p * per, p * per + per).forEach(function (lg, k) {
          var li = lg.cloneNode(true);
          li.style.transitionDelay = (k * 0.06) + 's';
          page.appendChild(li);
        });
        track.appendChild(page);

        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', (p + 1) + '페이지');
        (function (n) { dot.addEventListener('click', function () { go(n); restart(); }); })(p);
        dotsBox.appendChild(dot);
      }
      var single = pages <= 1;
      sec.querySelector('.pz-ctrl').style.visibility = single ? 'hidden' : '';
      dotsBox.style.display = single ? 'none' : '';
      go(Math.min(cur, pages - 1));
    }

    function go(n) {
      cur = (n + pages) % pages;
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      Array.from(track.children).forEach(function (pg, j) { pg.classList.toggle('on', j === cur && visible); });
      Array.from(dotsBox.children).forEach(function (d, j) { d.classList.toggle('on', j === cur); });
      numBox.innerHTML = '<em>' + pad(cur + 1) + '</em> / ' + pad(pages);
    }

    function start() { stop(); if (pages > 1) timer = setInterval(function () { go(cur + 1); }, DELAY); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { if (visible) start(); }

    sec.querySelector('.pz-prev').addEventListener('click', function () { go(cur - 1); restart(); });
    sec.querySelector('.pz-next').addEventListener('click', function () { go(cur + 1); restart(); });

    // 마우스 올리면 멈춤
    frame.addEventListener('mouseenter', stop);
    frame.addEventListener('mouseleave', restart);

    // 모바일 스와이프
    var sx = 0;
    frame.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; stop(); }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
      restart();
    });

    sec.classList.add('is-ready');
    build();

    // 화면에 보일 때만 자동 넘김
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        go(cur);
        visible ? start() : stop();
      }, { threshold: 0.3 }).observe(sec);
    } else { visible = true; go(cur); start(); }

    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
  })();
})();
