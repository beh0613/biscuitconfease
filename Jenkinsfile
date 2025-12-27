pipeline {
    agent none // Disable global agent to allow stage-specific Docker images

    stages {
        stage('Backend Tests') {
            agent {
                docker {
                    image 'maven:3.9-eclipse-temurin-20'
                    args '-u root'
                }
            }
            steps {
                // Generates results in backend/target/allure-results
                sh 'mvn clean test'
            }
        }

        stage('Frontend Tests') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root'
                }
            }
            steps {
                sh 'npm install'
                // Ensure frontend is configured to output results to frontend/allure-results
                sh 'npm test'
            }
        }
    }

    post {
        always {
            // Aggregate results from both directories into one report
            script {
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [
                        [path: 'target/allure-results'],         // Backend path
                        [path: 'frontend/allure-results']       // Frontend path
                    ]
                ])
            }
        }
    }
}