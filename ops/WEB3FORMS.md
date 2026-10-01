# Web3Forms 설정 (상담 문의 폼)

문의 폼은 **mailto 대신** Web3Forms로 직접 제출합니다.  
수신: `kaaram21@kapaland.co.kr`

## 1) Access Key 발급 (필수 · 1회)

Web3Forms는 비밀번호 없이 **이메일 인증만**으로 키를 줍니다. 박스에서 API로 키를 받을 수 없습니다(인증 메일이 inbox로 감).

1. 브라우저에서 [https://web3forms.com](https://web3forms.com) 접속
2. **Create Access Key** 클릭
3. 이메일: `kaaram21@kapaland.co.kr` 입력 후 제출
4. 해당 메일함에서 인증 링크 클릭 → **Access Key**(UUID) 수신
5. 키를 아래 중 한 곳에 넣기:
   - 권장: 부모 에이전트/시크릿 `WEB3FORMS_ACCESS_KEY`로 전달 후 `assets/js/form-config.js`의 `accessKey`에 반영·재배포
   - 또는 `assets/js/form-config.js`를 직접 열어 `accessKey: '여기에-UUID'` 저장

Access Key는 **비밀 API 키가 아닙니다**(공개 가능, 이메일 alias). 남용 방지용 허니팟·도메인 제한(Pro)은 Web3Forms 문서 참고.

## 2) 코드 위치

| 파일 | 역할 |
| --- | --- |
| `assets/js/form-config.js` | `accessKey` 플레이스홀더 |
| `assets/js/main.js` | `fetch` POST · 한국어 성공/오류 UI · honeypot |
| `contact.html` | `#inquiry-form` · `data-web3forms` · honeypot 필드 |

엔드포인트: `POST https://api.web3forms.com/submit` (JSON)

## 3) 키 없이 배포된 경우

키가 비어 있으면 제출 시 한국어 안내가 표시됩니다.  
전화(064-757-2333)·카카오톡 채널은 그대로 유지됩니다.

## 4) Formspree 대안

환경변수 `FORMSPREE_ID`가 있으면 Formspree도 가능하나, 현재는 Web3Forms를 기본으로 사용합니다.  
Formspree는 대시보드 가입이 필요하고, 박스에서 비밀번호 없이 폼 ID를 만들 수 없습니다.
