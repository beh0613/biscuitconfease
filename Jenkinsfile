pipeline {
    agent {
        docker {
            // Matches your Java version 20
            image 'maven:3.9-eclipse-temurin-20'
            args '-u root'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Tests') {
            steps {
                // Run Maven tests. This will:
                // 1. Copy aspectjweaver
                // 2. Run JUnit 5 tests
                // 3. Generate results in target/allure-results
                sh 'mvn clean test'
            }
        }
    }

    post {
        always {
            script {
                // Point to the 'target/allure-results' folder created by Maven
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'target/allure-results']]
                ])
            }
        }
    }
}