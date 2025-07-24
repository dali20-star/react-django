pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'ahmed22hub/django-backend'
        DOCKER_IMAGE_FRONTEND = 'ahmed22hub/react-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/ahmed22-hub/react-django.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${DOCKER_IMAGE_BACKEND}", '.')
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${DOCKER_IMAGE_FRONTEND}", '.')
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${DOCKER_IMAGE_BACKEND}"
                        sh "docker push ${DOCKER_IMAGE_FRONTEND}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Fin du pipeline (post always)'
        }
        failure {
            echo 'Le pipeline a échoué.'
        }
        success {
            echo 'Le pipeline a réussi.'
        }
    }
}
