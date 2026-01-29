pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials') 
        FRONTEND_IMAGE = "rasanjalee/devops_project_frontend"
        BACKEND_IMAGE = "rasanjalee/devops_project_backend"
        SSH_KEY = credentials('ec2-ssh-key')  // Add your EC2 private key in Jenkins credentials
        EC2_USER = "ec2-user"
        EC2_HOST = "65.0.81.118"
        DOCKER_COMPOSE_PATH = "~/devops_project/docker-compose.yaml" // location on EC2
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/rasanjaleee/Devops_Project.git'
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    dir('frontend') {
                        sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                    }
                    dir('workshop-backend') {
                        sh "docker build -t ${BACKEND_IMAGE}:latest ."
                    }
                    sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker logout"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    sh """
                    ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${EC2_USER}@${EC2_HOST} \
                    'docker-compose -f ${DOCKER_COMPOSE_PATH} pull && docker-compose -f ${DOCKER_COMPOSE_PATH} up -d'
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded: Docker images built, pushed, and deployed!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs.'
        }
    }
}
