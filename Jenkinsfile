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
                sh 'docker compose down --remove-orphans'
                sh 'docker compose up -d --build'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo "Waiting for MySQL to stabilize..."
                    sh 'sleep 20'

                    // We add -Dspring.test.database.replace=none to stop it looking for H2
                    sh '''
                        docker compose exec -T backend ./mvnw test \
                        -Dspring.test.database.replace=none \
                        -Dspring.datasource.url=jdbc:mysql://db:3306/cmsdb \
                        -Dspring.datasource.username=root \
                        -Dspring.datasource.password=rootpassword \
                        -Dallure.results.directory=target/allure-results
                    '''
                }
            }
        }
    } // Added missing closing brace for stages

    post {
        always {
            allure includeProperties: false,
                   jdk: '',
                   results: [[path: 'assignment-3-biscuit3/target/allure-results']]

            sh 'docker compose down'
        }
    }
} // Added missing closing brace for pipeline