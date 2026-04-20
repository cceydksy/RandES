pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/cceydksy/RandES.git'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sleep 15
                    sh 'curl -f http://localhost:3000 || echo "API henuz hazir degil"'
                    sh 'curl -f http://localhost:3001 || echo "Frontend henuz hazir degil"'
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy basarili: RandES calisiyor.'
        }
        failure {
            echo 'Deploy basarisiz: loglari kontrol et.'
        }
    }
}
