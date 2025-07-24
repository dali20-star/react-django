pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds-id')  // Met ici ton ID credentials Jenkins
        SONARQUBE_ENV = 'SonarQube' // Nom de ton serveur SonarQube dans Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv(SONARQUBE_ENV) {
                    // Analyser tout le projet
                    bat 'sonar-scanner'
                }
            }
        }

        stage('Docker Login') {
            steps {
                bat "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                bat 'docker build -f frontend/Dockerfile.frontend -t ahmedmasmoudi047/react-frontend:latest frontend'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                bat 'docker build -f backend/Dockerfile.backend -t ahmedmasmoudi047/django-backend:latest backend'
            }
        }

        stage('Push Docker Images') {
            steps {
                bat 'docker push ahmedmasmoudi047/react-frontend:latest'
                bat 'docker push ahmedmasmoudi047/django-backend:latest'
            }
        }

        // Ajoute ici d'autres stages (ex: déploiement) si besoin
    }

    post {
        always {
            bat 'docker logout'
        }
        failure {
            echo 'Pipeline échoué.'
        }
        success {
            echo 'Pipeline réussi !'
        }
    }
}
