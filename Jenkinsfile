pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials') // Jenkins Docker Hub credentials ID
        FRONTEND_IMAGE = "rasanjalee/devops_project_frontend"
        BACKEND_IMAGE = "rasanjalee/devops_project_backend"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir() // Deletes everything in the workspace
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/rasanjaleee/Devops_Project.git'
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                    }
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    dir('workshop-backend') {
                        sh "docker build -t ${BACKEND_IMAGE}:latest ."
                    }
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker logout"
                }
            }
        }

        stage('Deploy (Optional)') {
            steps {
                echo "Add your deployment steps here (e.g., Terraform, Kubernetes, or docker-compose)"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded: Docker images built and pushed!'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs for details.'
        }
    }
}
