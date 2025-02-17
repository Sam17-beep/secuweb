# Stage 1: Build the application with Gradle
FROM openjdk:21-jdk AS build
WORKDIR /app

# Copy Gradle files first to leverage caching
COPY gradle gradle
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .

# Set execution permission for the Gradle wrapper
RUN chmod +x ./gradlew

# Copy the rest of the project files
COPY src src

# Build the application
RUN ./gradlew clean build -x test

# Stage 2: Create the final Docker image
FROM openjdk:21-jdk
VOLUME /tmp

# Copy the JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port and define entry point
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
