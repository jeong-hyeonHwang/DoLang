plugins {
    java
    id("org.springframework.boot") version "3.4.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "live.dolang"
version = "0.0.1"

val querydslVersion = "5.1.0"
val blazePersistenceVersion = "1.6.14"

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
        testCompileOnly("org.projectlombok:lombok")
        annotationProcessor("org.projectlombok:lombok")
        testAnnotationProcessor("org.projectlombok:lombok")
        testImplementation("org.springframework.boot:spring-boot-starter-test")
        testRuntimeOnly("org.junit.platform:junit-platform-launcher")

        runtimeOnly("com.mysql:mysql-connector-j")

        implementation("com.querydsl:querydsl-jpa:${querydslVersion}:jakarta")
        annotationProcessor("com.querydsl:querydsl-apt:${querydslVersion}:jakarta")
        annotationProcessor("jakarta.persistence:jakarta.persistence-api")

        implementation("com.blazebit:blaze-persistence-core-api-jakarta:${blazePersistenceVersion}")
        runtimeOnly("com.blazebit:blaze-persistence-core-impl-jakarta:${blazePersistenceVersion}")
        implementation("com.blazebit:blaze-persistence-integration-hibernate-6.2:${blazePersistenceVersion}")
        implementation("com.blazebit:blaze-persistence-integration-querydsl-expressions-jakarta:${blazePersistenceVersion}")

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
