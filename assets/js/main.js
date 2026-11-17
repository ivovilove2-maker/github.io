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
  // 파트너존: 한 화면 가득 로고가 흐르는 벽
  // ─────────────────────────────────────────────
  (function () {
    var sec = document.getElementById('partners');
    if (!sec) return;
    var wall = sec.querySelector('.pz-wall');
    var logos = Array.from(sec.querySelectorAll('.pz-source li'));
    if (!wall || !logos.length) return;

    var SPEED = 35;        // 흐르는 속도 (초당 px). 클수록 빠름
    var MIN_PER_ROW = 4;   // 한 줄 최소 로고 수
    var seen = false;

        // 로고 이미지가 없으면 alt에 적힌 회사명으로 대신 표시
    var rebuildT;
    logos.forEach(function (li) {
      var img = li.querySelector('img');
      if (!img) return;
      function fallback() {
        var s = document.createElement('span');
        s.textContent = img.alt;
        if (img.parentNode) li.replaceChild(s, img);
        clearTimeout(rebuildT);
        rebuildT = setTimeout(build, 100);
      }
      if (img.complete && img.naturalWidth === 0) fallback();
      else img.addEventListener('error', fallback);
    });

    function build() {
      wall.innerHTML = '';

      // 로고 박스 크기 재기
      var probe = document.createElement('ul');
      probe.className = 'pz-row';
      probe.appendChild(logos[0].cloneNode(true));
      wall.appendChild(probe);
      var li = probe.firstChild;
      var h = li.offsetHeight;
      var w = li.offsetWidth + parseFloat(getComputedStyle(li).marginRight);
      var gap = parseFloat(getComputedStyle(wall).rowGap) || 12;
      wall.innerHTML = '';

      // 화면 높이에 맞는 줄 수
      var fit = Math.max(1, Math.floor((wall.clientHeight + gap) / (h + gap)));
      var rows = Math.max(1, Math.min(fit, Math.ceil(logos.length / MIN_PER_ROW)));

      // 로고를 줄마다 골고루 나누기
      var buckets = [];
      for (var r = 0; r < rows; r++) buckets.push([]);
      logos.forEach(function (lg, n) { buckets[n % rows].push(lg); });

      buckets.forEach(function (bucket, r) {
        var row = document.createElement('ul');
        row.className = 'pz-row' + (r % 2 ? ' rev' : '');

        // 화면 폭보다 길게 반복 → 한 번 더 복제해서 끊김 없이 순환
        var set = [];
        while (set.length * w < window.innerWidth + w) set = set.concat(bucket);
        set.concat(set).forEach(function (lg) { row.appendChild(lg.cloneNode(true)); });

        row.style.setProperty('--dur', (set.length * w / SPEED).toFixed(1) + 's');
        row.style.transitionDelay = (0.3 + r * 0.12) + 's';
        wall.appendChild(row);
      });

      if (seen) reveal();
    }

    function reveal() {
      sec.querySelectorAll('.pz-up, .pz-row').forEach(function (el) { el.classList.add('pz-in'); });
    }

    sec.querySelectorAll('.pz-up').forEach(function (el, n) { el.style.transitionDelay = (n * 0.12) + 's'; });

    build();

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { seen = true; reveal(); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(sec);
    } else { seen = true; reveal(); }

    var lastW = window.innerWidth, lastH = window.innerHeight, t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 80) return;
        lastW = window.innerWidth; lastH = window.innerHeight;
        build();
      }, 200);
    });

    // 로고 이미지가 늦게 로드돼도 크기 다시 맞추기
    window.addEventListener('load', build);
  })();
})();
