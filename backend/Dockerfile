# Estagio 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Forca o ambiente e a JVM para UTF-8 nativo
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

COPY . .
RUN mvn clean package -DskipTests

# Estagio 2: Execucao
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]