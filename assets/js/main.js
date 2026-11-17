// 모바일 메뉴 열기/닫기
(function () {
  // 메인: 스크롤하면 헤더 배경 생기기
  var hd = document.querySelector('.hd');
  if (hd && document.body.classList.contains('is-home')) {
    var onScroll = function () { hd.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var btn = document.getElementById('menuBtn');
  var gnb = document.getElementById('gnb');
  if (btn && gnb) {
    btn.addEventListener('click', function () {
      var open = gnb.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
  }

  // 고객문의 폼: 작성 내용으로 메일 프로그램 열기
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
})();
