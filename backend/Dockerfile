# Estágio 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# Define a linguagem/encoding do sistema para UTF-8 durante a compilação
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"
RUN mvn clean package -DskipTests -Dmaven.resources.filtering=false

# Estágio 2: Execução
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]