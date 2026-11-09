/**
 * Web3Forms access key (public by design — alias for destination email).
 * Get a key: https://web3forms.com → Create Access Key → email kaaram21@kapaland.co.kr
 * Then paste the UUID below (or set via parent secret WEB3FORMS_ACCESS_KEY).
 * Docs: ops/WEB3FORMS.md
 */
window.KAARAM_FORM = Object.assign({}, window.KAARAM_FORM, {
  provider: 'web3forms',
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: '6a318262-7e3a-42d7-bef6-aed4a5b60c6b', // ← paste ACCESS_KEY here after email verification
  toEmail: 'kaaram21@kapaland.co.kr',
  fromName: '가람감정평가법인 제주지사 웹문의'
});
