group = "live.dolang.api"
version = "0.0.1"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
}

sourceSets {
    named("main") {
        java {
            setSrcDirs(listOf("src/main/java", "build/generated"))
        }
    }
}