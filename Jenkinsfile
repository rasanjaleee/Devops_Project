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
                // Robust checkout with cleaning
                checkout([$class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[url: 'https://github.com/rasanjaleee/Devops_Project.git']],
                    extensions: [[$class: 'CleanBeforeCheckout']]
                ])
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        // Ensure Dockerfile exists
                        if (fileExists('Dockerfile')) {
                            sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                        } else {
                            error "Frontend directory or Dockerfile not found!"
                        }
                    }
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    dir('workshop-backend') {
                        if (fileExists('Dockerfile')) {
                            sh "docker build -t ${BACKEND_IMAGE}:latest ."
                        } else {
                            error "Backend directory or Dockerfile not found!"
                        }
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
