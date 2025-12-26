FROM eclipse-temurin:21-jdk

# Set the working directory to match your Jenkinsfile expectation
WORKDIR /app

# 1. Copy the Maven wrapper and project configuration
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# 2. Copy the source code and the AspectJ weaver needed for Allure
COPY src ./src
COPY target/aspectjweaver-*.jar ./target/

# 3. Copy the pre-built jar for the entrypoint
COPY target/confease-backend-0.0.1-SNAPSHOT.jar app.jar

# 4. Make the Maven wrapper executable
RUN chmod +x mvnw

# Entrypoint for running the app normally
ENTRYPOINT ["java","-jar","app.jar"]