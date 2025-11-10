pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = 'docker-hub-credentials'
        BACKEND_IMAGE = 'rasanjalee/devops_project_backend:latest'
        FRONTEND_IMAGE = 'rasanjalee/devops_project_frontend:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                echo 'Building backend image...'
                sh 'docker build -t backend-image ./workshop-backend'

                echo 'Building frontend image...'
                sh 'docker build -t frontend-image ./frontend'
            }
        }

        stage('Tag Images') {
            steps {
                sh "docker tag backend-image \${BACKEND_IMAGE}"
                sh "docker tag frontend-image \${FRONTEND_IMAGE}"
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "\${DOCKERHUB_CREDS}", usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                    sh 'echo $DH_PASS | docker login -u $DH_USER --password-stdin'
                    sh "docker push \${BACKEND_IMAGE}"
                    sh "docker push \${FRONTEND_IMAGE}"
                    sh 'docker logout'
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                echo 'Removing old containers if they exist...'
                sh 'docker rm -f mern-mongodb || true'
                sh 'docker rm -f mern-backend || true'
                sh 'docker rm -f mern-frontend || true'

                echo 'Deploying using Docker Compose...'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up unused Docker images...'
            sh 'docker image prune -f'
        }
    }
}
"@

# Write to Jenkinsfile
$jenkinsContent | Set-Content -Path "./Jenkinsfile" -Encoding UTF8
