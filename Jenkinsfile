pipeline {
    agent none

    stages {
        stage('Backend Tests') {
            agent {
                docker {
                    image 'maven:3.9-eclipse-temurin-20'
                    // -u root ensures the container can write to the workspace
                    args '-u root'
                }
            }
            steps {
                dir('assignment-3-biscuit3') {
                    // Using -DskipTests can verify the build works,
                    // but fix your DB config to run them properly.
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
            script {
                node {
                    // CRITICAL: Fix file ownership so Allure plugin can read the results
                    sh 'chmod -R 777 .'

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