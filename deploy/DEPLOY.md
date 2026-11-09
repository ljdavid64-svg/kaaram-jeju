# 배포 안내 (가람감정평가법인 제주지사)

정적 사이트입니다. `index.html`이 루트에 있어야 합니다.

## GitHub Pages (권장)

박스에서 `gh` 미로그인 상태였습니다. 사용자 PC에서:

```bash
cd deploy   # 또는 사이트 루트
git init
gh auth login
gh repo create kaaram-jeju --private --source=. --remote=origin --push
# Settings → Pages → Branch: main / root
```

Pages URL 예: `https://<username>.github.io/kaaram-jeju/`

## Cloudflare Pages / Netlify

- Cloudflare: 대시보드에서 폴더 업로드, 또는 `npx wrangler pages deploy .` (로그인·Node≥22 필요)
- Netlify: `npx netlify deploy --dir=. --prod` (로그인 필요)

## 로컬 미리보기

```bash
python3 -m http.server 8765
# http://127.0.0.1:8765/
```
