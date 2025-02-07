# http://localhost:8200/swagger-ui/index.html

## 0. 준비물
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## 1. 인가 코드 받기

맥
```bash
open "http://localhost:8200/oauth2/authorize?response_type=code&client_id=oidc-client&redirect_uri=http://localhost:3000/oauth2/code&scope=openid"
```

윈도우
```bash
start "http://localhost:8200/oauth2/authorize?response_type=code&client_id=oidc-client&redirect_uri=http://localhost:3000/oauth2/code&scope=openid"
```

또는 그냥 브라우저에서 열기

`redirect_uri` 를 프론트와 합의 후 결정. (정해진 경로 외의 요청은 거절됨)

## 2. 토큰 발급

```bash
curl --location 'http://localhost:8200/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic b2lkYy1jbGllbnQ6c2VjcmV0' \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'code=1번 실행 결과인 브라우저 창에서 코드를 붙여 넣으세요' \
--data-urlencode 'redirect_uri=http://localhost:3000/oauth2/code'
```

`redirect_uri` 를 프론트와 합의 후 결정. (정해진 경로 외의 요청은 거절됨)  
`Basic b2lkYy1jbGllbnQ6c2VjcmV0` 는 추후에 변경 예정 (틀리면 거절됨)

## 3. 잘 되는지 확인

### 백엔드(module-api) 서버 띄우고 호출해보기
```bash
curl --location 'http://localhost:8100/api/hello' \
--header 'Authorization: Bearer 발급된 토큰'
```

### 토큰 재발급 (리프레쉬 토큰 이용)
```bash
curl --location 'http://localhost:8200/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic b2lkYy1jbGllbnQ6c2VjcmV0' \
--data-urlencode 'grant_type=refresh_token' \
--data-urlencode 'refresh_token=리프레쉬토큰'
```

### introspect
```bash
curl --location 'http://localhost:8200/oauth2/introspect' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic b2lkYy1jbGllbnQ6c2VjcmV0' \
--data-urlencode 'token=발급된 토큰'
```

### userinfo
```bash
curl --location 'http://localhost:8200/userinfo' \
--header 'Authorization: Bearer 발급된 토큰'
```

