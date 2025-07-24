pipeline {
    agent any

    tools {
        sonarQube 'SonarScanner' // Ce nom doit correspondre à la config dans Jenkins (Global Tool Configuration)
    }

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
                SONARQUBE_ENV = 'SonarQubeServer' // Ce nom doit correspondre à la config dans "Configure System"
            }
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    bat '''
                    cd frontend
                    sonar-scanner ^
                        -Dsonar.projectKey=react-django ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.login=%SONAR_TOKEN%
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                bat "echo %DOCKER_CREDENTIALS_PSW% | docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin"
            }
        }

        stage('Build Docker Images') {
            steps {
                bat '''
                docker build -f Dockerfile.frontend -t %DOCKER_CREDENTIALS_USR%/react-frontend:latest frontend
                docker build -f Dockerfile.backend -t %DOCKER_CREDENTIALS_USR%/django-backend:latest backend
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
