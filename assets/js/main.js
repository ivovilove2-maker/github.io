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
  // 파트너존: 지역 탭 + 페이지 슬라이드 + 진행 막대 + 숫자 카운트
  // ─────────────────────────────────────────────
  (function () {
    var sec = document.getElementById('partners');
    if (!sec) return;
    var track = sec.querySelector('.pz-track');
    var bars = sec.querySelector('.pz-bars');
    var numBox = sec.querySelector('.pz-num');
    var frame = sec.querySelector('.pz-frame');
    var tabs = Array.from(sec.querySelectorAll('.pz-tab'));
    var all = Array.from(sec.querySelectorAll('.pz-source li'));
    if (!track || !all.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var filter = 'all', list = all, cur = 0, pages = 1, per = 0, visible = false, counted = false;

    // 로고 이미지가 없으면 회사명 글자로 대체
    all.forEach(function (li) {
      var img = li.querySelector('img');
      if (!img) return;
      function fallback() {
        if (!img.parentNode) return;
        var s = document.createElement('span');
        s.textContent = img.alt;
        li.replaceChild(s, img);
        build(true);
      }
      if (img.complete && img.naturalWidth === 0) fallback();
      else img.addEventListener('error', fallback);
    });

    function layout() {
      var w = window.innerWidth;
      if (w <= 760) return { cols: 2, per: 6 };
      if (w <= 1024) return { cols: 3, per: 9 };
      return { cols: 4, per: 12 };
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function build(force) {
      var L = layout();
      if (!force && L.per === per) return;
      per = L.per;
      list = filter === 'all' ? all : all.filter(function (li) { return li.dataset.region === filter; });
      pages = Math.max(1, Math.ceil(list.length / per));
      cur = Math.min(cur, pages - 1);
      track.innerHTML = '';
      bars.innerHTML = '';

      for (var p = 0; p < pages; p++) {
        var page = document.createElement('ul');
        page.className = 'pz-page';
        page.style.setProperty('--cols', L.cols);
        for (var k = 0; k < per; k++) {
          var src = list[p * per + k];
          var li = src ? src.cloneNode(true) : document.createElement('li');
          if (!src) { li.className = 'pz-empty'; li.setAttribute('aria-hidden', 'true'); }
          li.style.transitionDelay = (k * 0.04) + 's';
          page.appendChild(li);
        }
        track.appendChild(page);

        var bar = document.createElement('button');
        bar.type = 'button';
        bar.setAttribute('aria-label', (p + 1) + '페이지');
        bar.appendChild(document.createElement('i'));
        (function (n) { bar.addEventListener('click', function () { go(n); }); })(p);
        bars.appendChild(bar);
      }
      bars.classList.toggle('static', pages <= 1 || reduce);
      sec.querySelector('.pz-prev').style.visibility = pages <= 1 ? 'hidden' : '';
      sec.querySelector('.pz-next').style.visibility = pages <= 1 ? 'hidden' : '';
      go(cur);
    }

    function go(n) {
      cur = (n + pages) % pages;
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      Array.from(track.children).forEach(function (pg, j) { pg.classList.toggle('on', j === cur && visible); });
      Array.from(bars.children).forEach(function (b, j) {
        b.classList.remove('on');
        b.classList.toggle('done', j < cur);
      });
      var active = bars.children[cur];
      if (active) { void active.offsetWidth; active.classList.add('on'); }   // 진행 막대 처음부터 다시
      numBox.innerHTML = '<em>' + pad(cur + 1) + '</em> / ' + pad(pages);
    }

    // 진행 막대가 끝까지 차면 다음 페이지
    bars.addEventListener('animationend', function () { if (pages > 1) go(cur + 1); });

    sec.querySelector('.pz-prev').addEventListener('click', function () { go(cur - 1); });
    sec.querySelector('.pz-next').addEventListener('click', function () { go(cur + 1); });

    // 지역 탭
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        if (tab.dataset.filter === filter) return;
        filter = tab.dataset.filter;
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('on', on);
          t.setAttribute('aria-selected', on);
        });
        cur = 0;
        build(true);
      });
    });

    // 모바일 스와이프
    var sx = 0;
    frame.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    });

    // 숫자 0부터 올라가기
    function countUp() {
      if (counted || reduce) return;
      counted = true;
      sec.querySelectorAll('.pz-count').forEach(function (el) {
        var to = parseInt(el.dataset.to, 10) || 0, t0 = null;
        (function step(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / 1200);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }

    sec.classList.add('is-ready');
    build(true);

    // 화면에 보일 때만 자동 넘김
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sec.classList.toggle('is-visible', visible);
        if (visible) { countUp(); go(cur); }
      }, { threshold: 0.35 }).observe(sec);
    } else { visible = true; sec.classList.add('is-visible'); go(cur); }

    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { build(false); }, 200); });
  })();
})();
