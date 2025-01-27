# cd ../ && ./gradlew clean bootJar -p module-authorization && cd module-authorization
# docker build --build-arg JAR_FILE=build/libs/\*.jar -t dolang/spring-authorization .
# docker run --name spring-authorization -p 8200:8200 dolang/spring-authorization
FROM amazoncorretto:17-alpine

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=production", "/app.jar"]

EXPOSE 8200


# docker stop spring-authorization
# docker rm spring-authorization && docker rmi dolang/spring-authorization



# https://spring.io/guides/gs/spring-boot-docker
# https://docs.spring.io/spring-boot/gradle-plugin/packaging-oci-image.html
# ./gradlew bootBuildImage -p module-authorization --imageName=dolang/booted-spring-authorization
# docker run --name booted-spring-authorization -e "SPRING_PROFILES_ACTIVE=production" -p 8200:8200 dolang/booted-spring-authorization