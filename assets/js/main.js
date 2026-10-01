(function () {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const mobile = document.querySelector('.mobilemenu');
  const mclose = document.querySelector('.mclose');
  const yearEls = document.querySelectorAll('[data-year]');

  yearEls.forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-solid', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const openMenu = () => {
    if (!mobile) return;
    mobile.classList.add('is-open');
    document.body.classList.add('menu-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
  };
  const closeMenu = () => {
    if (!mobile) return;
    mobile.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger && hamburger.addEventListener('click', openMenu);
  mclose && mclose.addEventListener('click', closeMenu);
  mobile && mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // Category chips are visual only (no hide/filter)
  document.querySelectorAll('.insight-grid .icard').forEach((el) => el.classList.add('is-in'));

  // Resolve contact.html from existing in-page links (works in subfolders & project pages)
  const contactHref = (() => {
    const existing = document.querySelector('.mobilebar a.inq, a.nav-cta[href*="contact"], a[href*="contact.html"]');
    if (existing) {
      const href = existing.getAttribute('href') || 'contact.html';
      return href.replace(/#.*$/, '') || 'contact.html';
    }
    const path = window.location.pathname.replace(/\\/g, '/');
    const parts = path.split('/').filter(Boolean);
    const inSubdir = parts.length >= 2 && /\.html$/i.test(parts[parts.length - 1] || '') && parts[parts.length - 2] !== undefined && !/^\d/.test(parts[0] || '');
    // Heuristic: known content folders
    const folder = (parts[parts.length - 2] || '').toLowerCase();
    if (['insights','column','case','news','property'].includes(folder)) return '../contact.html';
    return 'contact.html';
  })();

  // Kakao Channel chat CTA — official 제주지사 (profile _MxkfxiX)
  const KAKAO_CHAT = 'http://pf.kakao.com/_MxkfxiX/chat';
  const wireKakao = (el) => {
    if (!el) return;
    el.classList.remove('is-pending');
    el.href = KAKAO_CHAT;
    el.target = '_blank';
    el.rel = 'noopener';
    el.title = '카카오톡 채널 상담';
    if (!el.textContent.trim()) el.textContent = '카카오';
  };
  const bar = document.querySelector('.mobilebar');
  if (bar) {
    let kakao = bar.querySelector('a.kakao');
    if (!kakao) {
      const inq = bar.querySelector('a.inq');
      kakao = document.createElement('a');
      kakao.className = 'kakao';
      kakao.textContent = '카카오';
      if (inq) bar.insertBefore(kakao, inq);
      else bar.appendChild(kakao);
    }
    wireKakao(kakao);
    const call = bar.querySelector('a.call');
    if (call && /전화걸기/.test(call.textContent || '')) call.textContent = '☎ 전화';
  }
  document.querySelectorAll('a.kakao.is-pending, a[href$="#kakao-channel"]').forEach(wireKakao);

  // Desktop floating phone CTA
  if (!document.querySelector('.float-cta')) {
    const float = document.createElement('a');
    float.className = 'float-cta';
    float.href = 'tel:0647572333';
    float.setAttribute('aria-label', '전화 상담 064-757-2333');
    float.innerHTML = '<span class="float-cta__dot" aria-hidden="true"></span>064-757-2333';
    document.body.appendChild(float);
  }

  // Inquiry form → mailto with light validation
  const form = document.getElementById('inquiry-form');
  if (form) {
    const err = document.getElementById('inq-error');
    const fields = {
      name: form.querySelector('#inq-name'),
      phone: form.querySelector('#inq-phone'),
      email: form.querySelector('#inq-email'),
      purpose: form.querySelector('#inq-purpose'),
      place: form.querySelector('#inq-place'),
      message: form.querySelector('#inq-message'),
    };

    const showError = (msg) => {
      if (!err) return;
      err.hidden = !msg;
      err.textContent = msg || '';
    };

    const mark = (el, bad) => {
      if (!el) return;
      el.classList.toggle('is-invalid', !!bad);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      Object.values(fields).forEach((el) => mark(el, false));
      showError('');

      const name = (fields.name && fields.name.value || '').trim();
      const phone = (fields.phone && fields.phone.value || '').trim();
      const email = (fields.email && fields.email.value || '').trim();
      const purpose = (fields.purpose && fields.purpose.value || '').trim();
      const place = (fields.place && fields.place.value || '').trim();
      const message = (fields.message && fields.message.value || '').trim();

      let bad = false;
      if (!name) { mark(fields.name, true); bad = true; }
      if (!phone || phone.replace(/\D/g, '').length < 9) { mark(fields.phone, true); bad = true; }
      if (!purpose) { mark(fields.purpose, true); bad = true; }
      if (!message || message.length < 5) { mark(fields.message, true); bad = true; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mark(fields.email, true); bad = true; }

      if (bad) {
        showError('필수 항목을 확인해 주세요. (이름·연락처·상담목적·메시지)');
        const firstBad = form.querySelector('.is-invalid');
        firstBad && firstBad.focus();
        return;
      }

      const subject = '[가람제주지사 상담문의] ' + purpose + ' / ' + name;
      const lines = [
        '이름: ' + name,
        '연락처: ' + phone,
        '이메일: ' + (email || '(미기재)'),
        '상담목적: ' + purpose,
        '물건지: ' + (place || '(미기재)'),
        '',
        '메시지:',
        message,
        '',
        '— 가람감정평가법인 제주지사 웹 문의 양식',
      ];
      const mailto =
        'mailto:kaaram21@kapaland.co.kr' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = mailto;
    });
  }
})();
