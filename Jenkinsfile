pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '0' // Désactiver BuildKit pour compatibilité maximale
        IMAGE_TAG = "v${new Date().format('yyyyMMddHHmmss')}" // Tag unique par build
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

        stage('Clean Docker') {
            steps {
                bat '''
                    docker system prune -af --volumes
                    docker logout
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
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
                    docker build --no-cache -f frontend/Dockerfile.frontend -t ahmedmasmoudi047/react-frontend:%IMAGE_TAG% ./frontend

                    echo Building Backend...
                    docker build --no-cache -f backend/Dockerfile.backend -t ahmedmasmoudi047/django-backend:%IMAGE_TAG% ./backend
                """
            }
        }

        stage('Push Docker Images') {
            steps {
                bat """
                    docker push ahmedmasmoudi047/react-frontend:%IMAGE_TAG%
                    docker push ahmedmasmoudi047/django-backend:%IMAGE_TAG%
                """
            }
        }

        stage('Deploy Application') {
            steps {
                echo '🚀 Déploiement de l’application (à configurer selon ton infra : Docker Compose, K8s, SSH, etc.)'
            }
        }

        stage('Run Ansible Playbook') {
            steps {
                bat """
                    wsl ansible-playbook /mnt/c/Users/AHMED_MASMOUDI/react-django/ansible-setup/deploy-react-django.yml ^
                    -i /mnt/c/Users/AHMED_MASMOUDI/react-django/ansible-setup/inventory.ini ^
                    --extra-vars "image_tag=%IMAGE_TAG%"
                """
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
