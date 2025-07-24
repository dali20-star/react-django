pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '0' // Désactivation explicite de BuildKit
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ahmed22-hub/react-django.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
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
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    string(credentialsId: 'dockerhub-username', variable: 'DOCKER_USERNAME'),
                    string(credentialsId: 'dockerhub-password', variable: 'DOCKER_PASSWORD')
                ]) {
                    bat """
                        echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                    """
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
                echo '🚀 Déploiement de l’application (à définir selon ton infrastructure)'
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
