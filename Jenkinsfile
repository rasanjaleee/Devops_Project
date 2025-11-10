pipeline {
    agent {
        node {
            label 'any'
        }
    }

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        sh 'docker build -t frontend-app .'
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('workshop-backend') {
                    script {
                        sh 'docker build -t backend-app .'
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    sh """
                        docker tag frontend-app $DOCKER_HUB_CREDENTIALS_USR/frontend-app:latest
                        docker tag backend-app $DOCKER_HUB_CREDENTIALS_USR/backend-app:latest
                        docker push $DOCKER_HUB_CREDENTIALS_USR/frontend-app:latest
                        docker push $DOCKER_HUB_CREDENTIALS_USR/backend-app:latest
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }
    }

    post {
        always {
            script {
                sh 'docker logout'
            }
        }
    }
}