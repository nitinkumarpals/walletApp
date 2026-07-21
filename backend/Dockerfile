# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /build

# Copy Maven wrapper and pom.xml first to leverage layer caching.
# Dependencies are only re-downloaded when pom.xml changes.
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline -q

# Copy source and build the fat JAR (skip tests; CI runs them separately)
COPY src ./src
RUN ./mvnw -B --no-transfer-progress -DskipTests package

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jre

# Create a non-root user for security
RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /build/target/*.jar app.jar

# Give ownership to the non-root user
RUN chown -R app:app /app
USER app

# Expose the default Spring Boot port
EXPOSE 8080

# Use the layered Spring Boot JAR launcher and configure JVM for containers
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
