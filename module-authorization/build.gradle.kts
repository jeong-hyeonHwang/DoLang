import org.springframework.boot.gradle.tasks.bundling.BootBuildImage

group = "live.dolang.authentication"
version = "0.0.1"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-authorization-server")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.3")
}

tasks.named<BootBuildImage>("bootBuildImage") {
    environment.put("BP_JVM_VERSION", "17")
}