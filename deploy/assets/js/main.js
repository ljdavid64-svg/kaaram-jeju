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


  // Hash targets (#inquiry / #form / #visit): account for fixed header; alias #form → #inquiry
  const scrollToHashTarget = () => {
    let hash = window.location.hash || '';
    if (hash === '#form') {
      const inq = document.getElementById('inquiry');
      if (inq) {
        if (history.replaceState) history.replaceState(null, '', '#inquiry');
        hash = '#inquiry';
      }
    }
    if (!hash || hash.length < 2) return;
    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return;
    // Make sure reveal children are visible when jumping
    el.querySelectorAll('.reveal').forEach((n) => n.classList.add('is-in'));
    el.classList.add('is-in');
    const headerH = (header && header.offsetHeight) || 78;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };
  if (window.location.hash) {
    // defer past layout / font load so offset is correct
    requestAnimationFrame(() => setTimeout(scrollToHashTarget, 50));
    window.addEventListener('load', scrollToHashTarget, { once: true });
  }
  window.addEventListener('hashchange', scrollToHashTarget);

  // Inquiry form → Web3Forms (fetch POST). Config: assets/js/form-config.js
  const form = document.getElementById('inquiry-form');
  if (form) {
    const err = document.getElementById('inq-error');
    const ok = document.getElementById('inq-success');
    const submitBtn = form.querySelector('button[type="submit"]');
    const cfg = window.KAARAM_FORM || {};
    const fields = {
      name: form.querySelector('#inq-name'),
      phone: form.querySelector('#inq-phone'),
      email: form.querySelector('#inq-email'),
      purpose: form.querySelector('#inq-purpose'),
      place: form.querySelector('#inq-place'),
      message: form.querySelector('#inq-message'),
      botcheck: form.querySelector('[name="botcheck"]'),
    };

    const showError = (msg) => {
      if (ok) { ok.hidden = true; ok.textContent = ''; }
      if (!err) return;
      err.hidden = !msg;
      err.textContent = msg || '';
    };

    const showSuccess = (msg) => {
      if (err) { err.hidden = true; err.textContent = ''; }
      if (!ok) return;
      ok.hidden = !msg;
      ok.textContent = msg || '';
    };

    const mark = (el, bad) => {
      if (!el) return;
      el.classList.toggle('is-invalid', !!bad);
    };

    const setBusy = (busy) => {
      form.classList.toggle('is-submitting', !!busy);
      if (submitBtn) {
        submitBtn.disabled = !!busy;
        if (busy) {
          submitBtn.dataset.prevLabel = submitBtn.innerHTML;
          submitBtn.innerHTML = '전송 중…';
        } else if (submitBtn.dataset.prevLabel) {
          submitBtn.innerHTML = submitBtn.dataset.prevLabel;
        }
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      Object.values(fields).forEach((el) => mark(el, false));
      showError('');
      showSuccess('');

      // Honeypot filled → pretend success (bots)
      if (fields.botcheck && fields.botcheck.checked) {
        showSuccess('문의가 접수되었습니다. 확인 후 연락드리겠습니다.');
        form.reset();
        return;
      }

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
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mark(fields.email, true); bad = true; }

      if (bad) {
        showError('필수 항목을 확인해 주세요. (이름·연락처·이메일·상담목적·메시지)');
        const firstBad = form.querySelector('.is-invalid');
        firstBad && firstBad.focus();
        return;
      }

      const accessKey = (cfg.accessKey || form.getAttribute('data-access-key') || '').trim();
      const endpoint = (cfg.endpoint || 'https://api.web3forms.com/submit').trim();

      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        showError('문의 전송 설정이 아직 완료되지 않았습니다. 전화(064-757-2333) 또는 카카오톡으로 문의해 주세요.');
        return;
      }

      const subject = '[가람제주지사 상담문의] ' + purpose + ' / ' + name;
      const payload = {
        access_key: accessKey,
        subject: subject,
        from_name: cfg.fromName || '가람감정평가법인 제주지사 웹문의',
        name: name,
        phone: phone,
        email: email,
        purpose: purpose,
        place: place || '(미기재)',
        message: message,
        botcheck: false,
      };
      payload.replyto = email;

      setBusy(true);
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
        let data = {};
        try { data = await res.json(); } catch (_) {}
        if (res.ok && data.success !== false) {
          showSuccess('문의가 접수되었습니다. 확인 후 연락드리겠습니다. 급한 건은 064-757-2333으로 전화해 주세요.');
          form.reset();
        } else {
          const apiMsg = (data && data.message) ? String(data.message) : '';
          showError(apiMsg
            ? ('전송에 실패했습니다: ' + apiMsg + ' 전화(064-757-2333)로 문의해 주세요.')
            : '전송에 실패했습니다. 잠시 후 다시 시도하거나 전화(064-757-2333)로 문의해 주세요.');
        }
      } catch (errNet) {
        showError('네트워크 오류로 전송하지 못했습니다. 인터넷 연결을 확인하거나 전화(064-757-2333)로 문의해 주세요.');
      } finally {
        setBusy(false);
      }
    });
  }
})();
