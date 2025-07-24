pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub') // Remplace par l'ID correct si besoin
        BACKEND_IMAGE = 'ahmed22hub/backend-react-django'
        FRONTEND_IMAGE = 'ahmed22hub/frontend-react-django'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ahmed22-hub/react-django.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        docker.build(env.BACKEND_IMAGE)
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        docker.build(env.FRONTEND_IMAGE)
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        docker.image(env.BACKEND_IMAGE).push('latest')
                        docker.image(env.FRONTEND_IMAGE).push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Fin du pipeline (post always)'
        }
        success {
            echo 'Pipeline exécuté avec succès !'
        }
        failure {
            echo 'Le pipeline a échoué.'
        }
    }
}
