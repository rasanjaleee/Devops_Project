pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('df780a66-ebcb-4d27-bfcd-5156364eabfc')
        FRONTEND_IMAGE = "rasanjalee/devops_project_frontend"
        BACKEND_IMAGE = "rasanjalee/devops_project_backend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/rasanjaleee/Devops_Project.git'
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    dir('4thsem/4thsem/frontend') {
                        sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                    }
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    dir('4thsem/4thsem/workshop-backend') {
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
    }

    post {
        success {
            echo '✅ Build, push, and deployment succeeded!'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs for details.'
        }
    }
}
