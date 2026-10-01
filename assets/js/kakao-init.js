/* Kakao JS SDK init + Channel Add button. Key from build env; client-side by design. */
(function () {
  var CHANNEL_PUBLIC_ID = '_MxkfxiX';
  var FALLBACK_ADD = 'https://pf.kakao.com/_MxkfxiX/friend';
  var JS_KEY = '8a1cbc1361d79dcdd2af8c47f310ba5a';

  function containers() {
    return Array.prototype.slice.call(document.querySelectorAll('[id^="kakao-add-channel"]'));
  }

  function assetPrefix(el) {
    var img = el && el.querySelector('img[src*="kakao-friendadd"]');
    if (img) {
      var src = img.getAttribute('src') || '';
      var i = src.lastIndexOf('assets/');
      if (i >= 0) return src.slice(0, i);
    }
    var scripts = document.querySelectorAll('script[src*="kakao-init.js"]');
    if (scripts.length) {
      var s = scripts[scripts.length - 1].getAttribute('src') || '';
      return s.replace(/assets\/js\/kakao-init\.js.*$/, '');
    }
    return '';
  }

  function renderFallback(el) {
    if (!el) return;
    if (el.querySelector('a[href*="pf.kakao.com"]')) return;
    var prefix = assetPrefix(el);
    el.innerHTML = '';
    var a = document.createElement('a');
    a.href = FALLBACK_ADD;
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = '카카오톡 채널 추가';
    a.setAttribute('data-kakao-add', '');
    var img = document.createElement('img');
    img.src = prefix + 'assets/img/kakao-friendadd-large.png';
    img.width = 114;
    img.height = 45;
    img.alt = '카카오톡 채널 추가';
    a.appendChild(img);
    el.appendChild(a);
  }

  function mountOne(el) {
    if (!el || !el.id) return;
    try {
      el.innerHTML = '';
      Kakao.Channel.createAddChannelButton({
        container: '#' + el.id,
        channelPublicId: CHANNEL_PUBLIC_ID,
        size: 'large'
      });
    } catch (err) {
      renderFallback(el);
    }
  }

  function boot() {
    var nodes = containers();
    if (!window.Kakao) {
      nodes.forEach(renderFallback);
      return;
    }
    try {
      if (!Kakao.isInitialized()) Kakao.init(JS_KEY);
    } catch (e) {
      nodes.forEach(renderFallback);
      return;
    }
    if (!Kakao.isInitialized()) {
      nodes.forEach(renderFallback);
      return;
    }
    nodes.forEach(mountOne);
  }

  function waitForSdk(attempts) {
    if (window.Kakao) {
      boot();
      return;
    }
    if (attempts <= 0) {
      containers().forEach(renderFallback);
      return;
    }
    setTimeout(function () { waitForSdk(attempts - 1); }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { waitForSdk(40); });
  } else {
    waitForSdk(40);
  }
})();
