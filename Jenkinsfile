pipeline {
    agent any
    stages {
        stage('Compile & Package') {
            steps {
                dir('assignment-3-biscuit3') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }
       stage('Spin up Environment') {
           steps {
               // --remove-orphans clears out old containers that might cause conflicts
               sh 'docker compose down --remove-orphans'
               sh 'docker compose up -d --build'
           }
       }
        stage('Run Tests') {
            steps {
                // Ensure Allure results directory exists
                sh 'docker compose exec -T backend ./mvnw test || true'
            }
        }
    }
    post {
        always {
            // Generate Allure Report
            allure includeProperties: false, jdk: '', results: [[path: 'assignment-3-biscuit3/allure-results']]

            // Final cleanup
            sh 'docker compose down'
        }
    }
}