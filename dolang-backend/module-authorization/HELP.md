### 소셜 로그인 제공자에게 제공해야 하는 것들
소셜 로그인 제공자의 문서를 확인하자.
- Authorization URI: authorization_code 절차를 시작하는 엔드포인트

- Token URI: authorization_code 를 access_token + id_token 으로 교환하는 엔드포인트

- JWK Set URI: JWT 서명을 확인을 위해 keys 을 추출하는 엔드포인트 (id_token 을 이용할 때는 필수)

- User Info URI: 사용자 정보를 얻어내는 엔드포인트 (id_token 을 이용하지 않을 때는 필수)

- User Name Attribute: (id_token 의 claim 조각) 또는 (사용자의 username 을 포함하는 사용자 정보 응답)

```yaml 예제.yml
spring:
  security:
    oauth:
      client:
        registration:
          생략
        provider:
          okta:
            authorization-uri: ${okta.base-url}/oauth2/v1/authorize
            token-uri: ${okta.base-url}/oauth2/v1/token
            user-info-uri: ${okta.base-url}/oauth2/v1/userinfo
            jwk-set-uri: ${okta.base-url}/oauth2/v1/keys
            user-name-attribute: sub
```

### 클라이언트 저장소에 등록할 클라이언트 설정하기

`ClientRegistration` 클래스 확인해보기
`InMemoryClientRegistrationRepository` 도 확인해보기

외부 환경변수를 설정할 수 있는 다양한 방법 목록
[Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)

```yaml 예제.yml
spring:
  security:
    oauth:
      client:
        registration:
          my-client: # ClientRegistration 의 registration_id 로 설정됨
            provider: okta
            client-id: ${OKTA_CLIENT_ID}
            client-secret: ${OKTA_CLIENT_SECRET}
            scope:
              - openid
              - profile
              - email
        provider:
          생략
```

