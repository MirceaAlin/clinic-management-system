# ── Stage 1: Build ──────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copiază gradle wrapper și config (cache layer)
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x gradlew

# Descarcă dependințele
RUN ./gradlew dependencies --no-daemon || true

# Copiază sursa și build
COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

# ── Stage 2: Run ────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# wget pentru healthcheck
RUN apk add --no-cache wget

# Utilizator non-root
RUN addgroup -S clinica && adduser -S clinica -G clinica

COPY --from=builder /app/build/libs/*.jar app.jar

RUN chown clinica:clinica app.jar
USER clinica

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
