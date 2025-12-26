version: '3.8'

services:
  db:
    image: mysql:8
    container_name: cms-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: cmsdb
    ports:
      - "3307:3306"
    volumes:
      - ./assignment-3-biscuit3/sql:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./assignment-3-biscuit3
      dockerfile: Dockerfile
    container_name: cms-backend
    restart: always
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8081:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/cmsdb
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
      # ADDED THIS VOLUME:
    volumes:
      - ./uploads:/app/uploads
    working_dir: /app

  frontend:
    build:
      context: ./conference-FE
      dockerfile: Dockerfile
    container_name: cms-frontend
    restart: always
    depends_on:
      - backend
    ports:
      - "4200:80"


  pipeline {
  agent any
  stages {
  stage('Build and Test') {
  steps {
  script {
  // Start services defined in your docker-compose.yml in detached mode
  sh 'docker-compose up -d'

  // Run tests inside your specific service container
  // Replace 'backend' with the actual service name from your docker-compose.yml
  sh 'docker-compose exec -T backend ./mvnw test'
  }
  }
  }
}
  post {
  always {
  // Clean up containers after tests finish (pass or fail)
  sh 'docker-compose down'
  }
}
}