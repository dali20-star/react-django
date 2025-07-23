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
                SONARQUBE_ENV = 'SonarQubeServer' // You must configure this name in Jenkins
            }
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh '''
                    cd frontend
                    sonar-scanner \
                        -Dsonar.projectKey=react-django \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://sonarqube:9000 \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    sh "echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -f Dockerfile.frontend -t ${DOCKER_CREDENTIALS_USR}/react-frontend:latest ./frontend
                docker build -f Dockerfile.backend -t ${DOCKER_CREDENTIALS_USR}/django-backend:latest ./backend
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                sh '''
                docker push ${DOCKER_CREDENTIALS_USR}/react-frontend:latest
                docker push ${DOCKER_CREDENTIALS_USR}/django-backend:latest
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                docker-compose down
                docker-compose up -d
                '''
            }
        }
    }
}
