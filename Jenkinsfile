pipeline {
    agent any
    stages {
        stage('Prepare .env') {
            steps {
                withCredentials([file(credentialsId: 'be-env-file', variable: 'ENV_FILE')]) {
                    sh 'cp "$ENV_FILE" .env'
                    sh 'chmod 600 .env'
                }
            }
        }
        stage('Clean Up') {
            steps {
                sh "docker-compose -f docker-compose.dev.yml down || true"
            }
        }
        stage('Run docker compose') {
            steps {
                sh "docker-compose -f docker-compose.dev.yml -p atmalab-rag-back up -d --build"
            }
        }
    }
    post {
        always {
            sh 'rm -f .env'
            sh 'docker image prune -f'
            echo "Pipeline execution completed."
        }
    }
}
