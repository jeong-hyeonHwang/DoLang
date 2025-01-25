plugins {
    java
    idea
    id("org.springframework.boot") version "3.4.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "live.dolang"
version = "0.0.1"

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

allprojects {
    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "java")
    apply(plugin = "org.springframework.boot")
    apply(plugin = "io.spring.dependency-management")

    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(17)
        }
    }

    dependencies {
        implementation("org.springframework.boot:spring-boot-starter")
        implementation("org.springframework.boot:spring-boot-starter-data-jpa")
        compileOnly("org.projectlombok:lombok")
        annotationProcessor("org.projectlombok:lombok")
        testImplementation("org.springframework.boot:spring-boot-starter-test")
        testRuntimeOnly("org.junit.platform:junit-platform-launcher")

        runtimeOnly("com.mysql:mysql-connector-j")
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }
}

project(":module-core") {
    dependencies {
    }
}

project(":module-authorization") {
    dependencies {
        implementation(project(":module-core"))
    }
}

project(":module-matching") {
    dependencies {
        implementation(project(":module-core"))
    }
}

project(":module-api") {
    dependencies {
        implementation(project(":module-core"))
    }
}
