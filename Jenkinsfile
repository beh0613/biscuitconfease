pipeline {
    agent any
    stages {
        stage('Compile & Package') {
            steps {
                // Change directory to your backend folder and build the JAR
                dir('assignment-3-biscuit3') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Spin up Environment') {
            steps {
                // Now that the JAR exists in assignment-3-biscuit3/target/,
                // docker compose can build the image successfully
                sh 'docker compose up -d --build'
            }
        }

        stage('Run Tests') {
            steps {
                // Run the actual test suite inside the container
                sh 'docker compose exec -T backend ./mvnw test'
            }
        }
    }
    post {
        always {
            sh 'docker compose down'
        }
    }
}