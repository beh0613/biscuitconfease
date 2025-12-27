pipeline {
    agent none // Allows using different Docker images per stage

    stages { // Mandatory wrapper for all stages
        stage('Backend Tests') {
            agent {
                docker {
                    image 'maven:3.9-eclipse-temurin-20'
                    args '-u root'
                }
            }
            steps {
                dir('assignment-3-biscuit3') {
                    sh 'mvn clean test'
                }
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
                dir('conference-FE') {
                    sh 'npm install && npm test'
                }
            }
        }
    }

    post {
        always {
            // Using script block to run the node step correctly
            script {
                node {
                    allure([
                        reportBuildPolicy: 'ALWAYS',
                        results: [
                            [path: 'assignment-3-biscuit3/target/allure-results'],
                            [path: 'conference-FE/allure-results']
                        ]
                    ])
                }
            }
        }
    }
}