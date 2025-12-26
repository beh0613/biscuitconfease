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
             script {
                 // Give MySQL time to initialize its schema
                 echo "Waiting for MySQL..."
                 sh 'sleep 20'

                 // Explicitly pass the MySQL URL to the test runner
                 sh '''
                     docker compose exec -T backend ./mvnw test \
                     -Dspring.datasource.url=jdbc:mysql://db:3306/cmsdb \
                     -Dspring.datasource.username=root \
                     -Dspring.datasource.password=rootpassword \
                     -Dallure.results.directory=target/allure-results
                 '''
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