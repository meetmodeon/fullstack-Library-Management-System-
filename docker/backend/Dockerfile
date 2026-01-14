# ===== Build stage =====
FROM maven:3.9.1-eclipse-temurin-17 AS build
WORKDIR /build

# Copy pom.xml and download dependencies offline
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build jar
COPY src ./src
RUN mvn clean package -DskipTests

# ===== Runtime stage =====
FROM eclipse-temurin:17-jdk-alpine AS runtime

WORKDIR /app
ARG PROFILE=dev
ARG APP_VERSION=0.0.1-SNAPSHOT

# Copy jar from build stage
COPY --from=build /build/target/LMS-*.jar /app

# Set environment variables
ENV DB_URL=jdbc:mysql://mysql_lbm:3306/lbm
ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}

EXPOSE 8080

# Run Spring Boot app
CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} LMS-${JAR_VERSION}.jar
