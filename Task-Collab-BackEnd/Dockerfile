# Use a slim Java runtime image as the base
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Expose the port the application runs on (optional, but good practice)
EXPOSE 8080

# Copy the pre-built JAR file from the build context's 'target' directory
# --- IMPORTANT: Ensure 'target/app.jar' exists relative to your Dockerfile ---
# --- You must build the JAR *before* running 'docker build' ---
COPY target/app.jar app.jar

# Define the command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]