pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '0' // 🔧 Désactivation explicite du BuildKit
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/ahmed22-hub/react-django.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    bat """
                        C:/ProgramData/Jenkins/.jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarScanner/bin/sonar-scanner.bat ^
                        -Dsonar.projectKey=react-django ^
                        -Dsonar.sources=frontend ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.login=%SONAR_TOKEN%
                    """
                }
            }
        }

        stage('Docker Login') {
            steps {
                bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat '''
                    echo Building Frontend...
                    docker build -f frontend/Dockerfile.frontend -t ahmedmasmoudi047/react-frontend:latest ./frontend

                    echo Building Backend...
                    docker build -f backend/Dockerfile.backend -t ahmedmasmoudi047/django-backend:latest ./backend
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                bat '''
                    docker push ahmedmasmoudi047/react-frontend:latest
                    docker push ahmedmasmoudi047/django-backend:latest
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deployment step here'
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed.'
        }
    }
}
