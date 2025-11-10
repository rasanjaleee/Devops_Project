pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        FRONTEND_IMAGE = "rasanjalee/devops_project_backend:latest"
        BACKEND_IMAGE  = "rasanjalee/devops_project_frontend:latest"
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
                        echo 'Building frontend Docker image...'
                        sh 'docker build -t frontend-app .'
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('workshop-backend') {
                    script {
                        echo 'Building backend Docker image...'
                        sh 'docker build -t backend-app .'
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    echo 'Logging in to Docker Hub...'
                    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        stage('Tag and Push Images') {
            steps {
                script {
                    echo 'Tagging and pushing images...'
                    sh """
                        docker tag frontend-app $FRONTEND_IMAGE
                        docker tag backend-app $BACKEND_IMAGE
                        docker push $FRONTEND_IMAGE
                        docker push $BACKEND_IMAGE
                    """
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                script {
                    echo 'Deploying containers using Docker Compose...'
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up and logging out from Docker Hub...'
                sh 'docker image prune -f'
                sh 'docker logout'
            }
        }
    }
}
