pipeline {
    agent any

    stages {
        stage('Compile & Package') {
            steps {
                dir('assignment-3-biscuit3') {
                    sh 'chmod +x mvnw'
                    // Generate the JAR and copy the AspectJ weaver
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Spin up Environment') {
            steps {
                // Remove orphans to prevent name conflicts
                sh 'docker compose down --remove-orphans'
                sh 'docker compose up -d --build'
            }
        }

        stage('Run Tests') {
            steps {
                // Run mvnw from the /app directory inside the container
                sh 'docker compose exec -T backend ./mvnw test -Dallure.results.directory=target/allure-results || true'
            }
        }
    }

    post {
        always {
            // Collect Allure results from the backend target folder
            allure includeProperties: false,
                   jdk: '',
                   results: [[path: 'assignment-3-biscuit3/target/allure-results']]

            // Clean up the Docker environment
            sh 'docker compose down'
        }
    }
}