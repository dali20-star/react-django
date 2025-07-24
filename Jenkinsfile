pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub')
        SONAR_TOKEN = credentials('sonarqube_token')
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ahmed22-hub/react-django.git'
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONARQUBE_ENV = 'SonarQubeServer'
            }
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    script {
                        def scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        bat """
                            "${scannerHome}\\bin\\sonar-scanner.bat" ^
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
                bat 'echo %DOCKER_CREDENTIALS_PSW% | docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat '''
                    docker build -f frontend/Dockerfile.frontend -t %DOCKER_CREDENTIALS_USR%/react-frontend:latest .
                    docker build -f backend/Dockerfile.backend -t %DOCKER_CREDENTIALS_USR%/django-backend:latest .
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                bat '''
                    docker push %DOCKER_CREDENTIALS_USR%/react-frontend:latest
                    docker push %DOCKER_CREDENTIALS_USR%/django-backend:latest
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                bat '''
                    docker-compose down
                    docker-compose up -d
                '''
            }
        }
    }
}
