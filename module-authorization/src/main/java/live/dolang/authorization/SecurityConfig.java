package live.dolang.authorization;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.servlet.http.HttpServletResponse;
import live.dolang.core.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.JdbcOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.JdbcOAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.client.JdbcRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.security.oauth2.server.authorization.token.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;

import java.nio.file.Files;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Duration;
import java.util.Base64;
import java.util.UUID;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    @Order(1)
    // 프로토콜 엔드포인트를 위한 스프링 시큐리티 필터 체인
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http, RegisteredClientRepository registeredClientRepository, JdbcOAuth2AuthorizationService jdbcOAuth2AuthorizationService, OAuth2TokenGenerator<?> oAuth2TokenGenerator, AuthorizationServerSettings authorizationServerSettings)
            throws Exception {

        // 스프링 서버 = authorization server
        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer =
                OAuth2AuthorizationServerConfigurer
                        .authorizationServer();

        http
                .securityMatcher(authorizationServerConfigurer.getEndpointsMatcher())
                .with(authorizationServerConfigurer, (authorizationServer) ->
                        // 스프링 서버 커스터마이징
                        authorizationServer
                                .oidc(Customizer.withDefaults())
                                .registeredClientRepository(registeredClientRepository) // 스프링 서버에 등록된 클라이언트 정보 관리
                                .authorizationService(jdbcOAuth2AuthorizationService) // OAuth2 Authorization 을 관리하는 서비스로, 인증 코드, 액세스 토큰 등을 저장하고 관리하는 역할
                                .tokenGenerator(oAuth2TokenGenerator) // 액세스 토큰 및 리프레시 토큰을 생성하는 객체
                                .authorizationServerSettings(authorizationServerSettings) // 스프링 서버 설정 관리
                )
                .authorizeHttpRequests((authorize) ->
                        authorize
                                .anyRequest().authenticated()
                )
                // authorization endpoint 에 접근하는 모든 인증 되지 않은 사용자는 oauth 2.0 Login 과정을 통해 인증 받아야함
                // 여기서는 구글 인증을 받도록 설정
                // DelegatingAuthenticationEntryPoint (인증 시작 지점이 여러개일 경우에 사용)
                .exceptionHandling((exceptions) -> exceptions
                        .defaultAuthenticationEntryPointFor(
                                new LoginUrlAuthenticationEntryPoint("/oauth2/authorization/google"),
                                new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
                        )
                );

        return http.build();
    }

    @Bean
    @Order(2)
    // 인증을 위한 스프링 시큐리티 필터 체인
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http, FederatedIdentityAuthenticationSuccessHandler federatedIdentityAuthenticationSuccessHandler)
            throws Exception {
        http
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/", "/index.html","/token", "/token.html", "/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**").permitAll()
                        .requestMatchers("/oauth2/authorization/google").authenticated()
                        .anyRequest().denyAll()
                )
                // yml 에 설정한 구글로 인증
                .oauth2Login(oauth2Login -> {
                    oauth2Login
                            .successHandler(federatedIdentityAuthenticationSuccessHandler);
                })
                .exceptionHandling(exceptions -> {
                    exceptions.defaultAuthenticationEntryPointFor(
                            (request, response, authException) -> {
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                response.setContentType("text/html;charset=UTF-8");
                                ClassPathResource htmlFile = new ClassPathResource("static/401.html");
                                String htmlContent = Files.readString(htmlFile.getFile().toPath());
                                response.getWriter().write(htmlContent);
                            },
                            new MediaTypeRequestMatcher(MediaType.APPLICATION_JSON)
                    );
                });

        return http.build();
    }

    @Bean
    public JdbcOAuth2AuthorizationService authorizationService(JdbcOperations jdbcOperations, RegisteredClientRepository registeredClientRepository) {
        return new JdbcOAuth2AuthorizationService(jdbcOperations, registeredClientRepository);
    }

    @Bean
    public JdbcRegisteredClientRepository registeredClientRepository(JdbcOperations jdbcOperations) {

        JdbcRegisteredClientRepository repository = new JdbcRegisteredClientRepository(jdbcOperations);
        repository.save(RegisteredClient.withId("oidc-client")
                .clientId("oidc-client")
                .clientSecret("{noop}secret")
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantTypes(grantTypes -> {
                    grantTypes.add(AuthorizationGrantType.AUTHORIZATION_CODE);
                    grantTypes.add(AuthorizationGrantType.REFRESH_TOKEN);
                })
                .redirectUris(uris -> {
                    uris.add("http://localhost:3000/oauth2/code");
                    uris.add("http://localhost:3000/oauth2/token");
                })
                .postLogoutRedirectUris(uris -> {
                    uris.add("http://localhost:3000/logout");
                })
                .scopes(scopes -> {
                    scopes.add("openid");
                    scopes.add("profile");
                    scopes.add("email");
                })
                .clientSettings(ClientSettings.builder().requireAuthorizationConsent(false).build())
                .tokenSettings(TokenSettings.builder()
                        .accessTokenTimeToLive(Duration.ofHours(1))
                        .refreshTokenTimeToLive(Duration.ofHours(2))
                        .build())
                .build());
        return repository;
    }

    @Bean
    // 스프링 인증 서버를 구성하는 AuthorizationServerSettings 인스턴스
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder().build();
    }

    @Bean
    // 액세스 토큰을 서명하는 JWKSource 인스턴스
    public JWKSource<SecurityContext> jwkSource() {
        KeyPair keyPair = generateRsaKey();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        // 공개 키 출력 (PEM 형식으로 출력)
        System.out.println("Public Key (PEM Format):");
        System.out.println("-----BEGIN PUBLIC KEY-----");
        System.out.println(Base64.getEncoder().encodeToString(publicKey.getEncoded()));
        System.out.println("-----END PUBLIC KEY-----");

        // 개인 키 출력 (PEM 형식으로 출력)
        System.out.println("\nPrivate Key (PEM Format):");
        System.out.println("-----BEGIN PRIVATE KEY-----");
        System.out.println(Base64.getEncoder().encodeToString(privateKey.getEncoded()));
        System.out.println("-----END PRIVATE KEY-----");

        RSAKey rsaKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(UUID.randomUUID().toString())
                .build();
        JWKSet jwkSet = new JWKSet(rsaKey);
        return new ImmutableJWKSet<>(jwkSet);
    }

    // JWKSource 를 만들 때 사용되는 키페어
    private static KeyPair generateRsaKey() {
        KeyPair keyPair;
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
        return keyPair;
    }

    @Bean
    // 서명된 액세스 토큰을 복호화하는 JwtDecoder 인스턴스
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    @Bean
    public JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean
    public OAuth2TokenGenerator<?> tokenGenerator(JwtEncoder jwtEncoder) {
        OAuth2AccessTokenGenerator accessTokenGenerator = new OAuth2AccessTokenGenerator();
        OAuth2RefreshTokenGenerator refreshTokenGenerator = new OAuth2RefreshTokenGenerator();
        return new DelegatingOAuth2TokenGenerator(
                new JwtGenerator(jwtEncoder), accessTokenGenerator, refreshTokenGenerator);
    }


    @Bean
    // 구글에게 인증 받은 사용자 관리
    public OAuth2AuthorizedClientService authorizedClientService(JdbcOperations jdbcOperations, ClientRegistrationRepository clientRegistrationRepository) {
        return new JdbcOAuth2AuthorizedClientService(jdbcOperations, clientRegistrationRepository);
    }

    @Bean
    public FederatedIdentityAuthenticationSuccessHandler federatedIdentityAuthenticationSuccessHandler(@Autowired UserRepository userRepository) {
        FederatedIdentityAuthenticationSuccessHandler successHandler = new FederatedIdentityAuthenticationSuccessHandler();
        successHandler.setOauth2UserHandler(new UserRepositoryOAuth2UserHandler(userRepository));
        successHandler.setOidcUserHandler(new UserRepositoryOidcUserHandler(userRepository));
        return successHandler;
    }

//    @Bean
//    public EmbeddedDatabase embeddedDatabase() {
//        // @formatter:off
//        return new EmbeddedDatabaseBuilder()
//                .generateUniqueName(true)
//                .setType(EmbeddedDatabaseType.H2)
//                .setScriptEncoding("UTF-8")
//                .addScript("org/springframework/security/oauth2/server/authorization/oauth2-authorization-schema.sql")
//                .addScript("org/springframework/security/oauth2/server/authorization/oauth2-authorization-consent-schema.sql")
//                .addScript("org/springframework/security/oauth2/server/authorization/client/oauth2-registered-client-schema.sql")
//                .build();
//        // @formatter:on
//    }
}
