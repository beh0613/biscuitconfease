pipeline {
    agent any
    stages {
        stage('Spin up Environment') {
            steps {
                // This command looks for the docker-compose.yml file in the same folder
                sh 'docker compose up -d'
            }
        }
        stage('Run Tests') {
            steps {
                // Run your maven tests inside the existing backend container
                sh 'docker compose exec -T backend ./mvnw test'
            }
        }
    }
    post {
        always {
            // Clean up containers after finishing
            sh 'docker compose down'
        }
    }
}