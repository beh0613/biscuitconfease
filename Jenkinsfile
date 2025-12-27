pipeline {
    agent none // Disable global agent to allow stage-specific Docker images

   stage('Backend Tests') {
       agent { docker { image 'maven:3.9-eclipse-temurin-20'; args '-u root' } }
       steps {
           // Navigate into the specific folder before running Maven
           dir('assignment-3-biscuit3') {
               sh 'mvn clean test'
           }
       }
   }
   stage('Frontend Tests') {
       agent { docker { image 'node:20-alpine'; args '-u root' } }
       steps {
           dir('conference-FE') {
               sh 'npm install && npm test'
           }
       }
   }
   post {
       always {
           node {
               script {
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