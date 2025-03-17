# Use an official Maven image to build the application
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy the project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn -Dhttp.keepAlive=false -Dmaven.wagon.http.pool=false clean package -DskipTests

# Use a lightweight JDK image to run the application
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
