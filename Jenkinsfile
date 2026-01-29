pipeline {
    agent any

    options {
        // We will do our own checkout after cleaning the workspace
        skipDefaultCheckout(true)

        // Nice-to-have safety
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        FRONTEND_IMAGE = "rasanjalee/devops_project_frontend"
        BACKEND_IMAGE  = "rasanjalee/devops_project_backend"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                // Built-in, no plugin needed
                deleteDir()
            }
        }

        stage('Checkout SCM') {
            steps {
                // Jenkins checks out the same repo/branch configured in job settings
                checkout scm
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh """
                      docker build --pull -t ${FRONTEND_IMAGE}:latest .
                    """
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('workshop-backend') {
                    sh """
                      docker build --pull -t ${BACKEND_IMAGE}:latest .
                    """
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh """
                  echo "${DOCKER_HUB_CREDENTIALS_PSW}" | docker login -u "${DOCKER_HUB_CREDENTIALS_USR}" --password-stdin
                  docker push ${FRONTEND_IMAGE}:latest
                  docker push ${BACKEND_IMAGE}:latest
                  docker logout
                """
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                  set -e

                  # Use docker compose if available, otherwise docker-compose
                  if docker compose version >/dev/null 2>&1; then
                    COMPOSE="docker compose"
                  else
                    COMPOSE="docker-compose"
                  fi

                  $COMPOSE down || true
                  $COMPOSE pull || true
                  $COMPOSE up -d
                '''
            }
        }
    }

    post {
        always {
            sh 'docker system df || true'
        }
        success {
            echo '✅ CI/CD Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs.'
        }
    }
}
