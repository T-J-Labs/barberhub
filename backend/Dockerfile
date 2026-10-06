# Estagio 1: Build com Java 25
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

COPY . .
RUN mvn clean package -DskipTests

# Estagio 2: Execucao com Java 25
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]