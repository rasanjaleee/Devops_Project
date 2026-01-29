pipeline {
    agent any

    options {
        skipDefaultCheckout(false)   // keep Jenkins default SCM checkout
    }

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        FRONTEND_IMAGE = "rasanjalee/devops_project_frontend"
        BACKEND_IMAGE  = "rasanjalee/devops_project_backend"
    }

    stages {

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('workshop-backend') {
                    sh "docker build -t ${BACKEND_IMAGE}:latest ."
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                sh "docker push ${FRONTEND_IMAGE}:latest"
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker logout"
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                docker compose down || docker-compose down
                docker compose up -d || docker-compose up -d
                '''
            }
        }
    }

    post {
        success { echo '✅ CI/CD Pipeline completed successfully!' }
        failure { echo '❌ Pipeline failed. Check logs.' }
    }
}
