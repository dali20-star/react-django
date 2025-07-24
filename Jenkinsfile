pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '0'               // 🔧 Désactivation explicite du BuildKit
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ahmed22-hub/react-django.git'
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONAR_TOKEN = credentials('sonarqube-token')
            }
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    bat """
                        C:/ProgramData/Jenkins/.jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarScanner/bin/sonar-scanner.bat ^
                        -Dsonar.projectKey=react-django ^
                        -Dsonar.sources=frontend ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.token=%SONAR_TOKEN%
                    """
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    bat 'echo Logging in to Docker... & echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat """
                    echo Building Frontend...
                    docker build -f frontend/Dockerfile.frontend -t ahmedmasmoudi047/react-frontend:latest ./frontend

                    echo Building Backend...
                    docker build -f backend/Dockerfile.backend -t ahmedmasmoudi047/django-backend:latest ./backend
                """
            }
        }

        stage('Push Docker Images') {
            steps {
                bat """
                    docker push ahmedmasmoudi047/react-frontend:latest
                    docker push ahmedmasmoudi047/django-backend:latest
                """
            }
        }

        stage('Deploy Application') {
            steps {
                echo '🚀 Déploiement de l’application (à définir selon ton infra)'
            }
        }
    }

    post {
        failure {
            echo '❌ Le pipeline a échoué.'
        }
        success {
            echo '✅ Pipeline exécuté avec succès !'
        }
    }
}
