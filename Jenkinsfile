pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['staging', 'production'],
            description: 'Select the environment to deploy to'
        )
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        DOCKER_BUILDKIT = '1'
        COMPOSE_DOCKER_CLI_BUILD = '1'
        IMAGE_TAG = "v${new Date().format('yyyyMMddHHmmss')}"
        SLACK_CHANNEL = '#deployments'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ahmed22-hub/react-django.git'
            }
        }

        stage('Install & Test in Parallel') {
            parallel failFast: true, 
            frontend: {
                dir('frontend') {
                    retry(2) {
                        bat 'npm install'
                        bat 'npm test'
                    }
                }
            },
            backend: {
                dir('backend') {
                    retry(2) {
                        bat 'pip install -r requirements.txt'
                        bat 'pytest'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            parallel failFast: true,
            frontend: {
                withSonarQubeEnv('SonarQubeServer') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        bat """
                            sonar-scanner.bat ^
                            -Dsonar.projectKey=react-frontend ^
                            -Dsonar.sources=frontend ^
                            -Dsonar.host.url=http://localhost:9000 ^
                            -Dsonar.token=%SONAR_TOKEN%
                        """
                    }
                }
            },
            backend: {
                withSonarQubeEnv('SonarQubeServer') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        bat """
                            sonar-scanner.bat ^
                            -Dsonar.projectKey=django-backend ^
                            -Dsonar.sources=backend ^
                            -Dsonar.host.url=http://localhost:9000 ^
                            -Dsonar.token=%SONAR_TOKEN%
                        """
                    }
                }
            }
        }

        stage('Clean & Docker Login') {
            steps {
                bat 'docker system prune -af --volumes'
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
                }
            }
        }

        stage('Docker Build in Parallel') {
            parallel failFast: true,
            frontend: {
                bat "docker build --no-cache -f frontend/Dockerfile.frontend -t ahmedmasmoudi047/react-frontend:%IMAGE_TAG% ./frontend"
            },
            backend: {
                bat "docker build --no-cache -f backend/Dockerfile.backend -t ahmedmasmoudi047/django-backend:%IMAGE_TAG% ./backend"
            }
        }

        stage('Push Docker Images') {
            parallel failFast: true,
            frontend: {
                bat "docker push ahmedmasmoudi047/react-frontend:%IMAGE_TAG%"
            },
            backend: {
                bat "docker push ahmedmasmoudi047/django-backend:%IMAGE_TAG%"
            }
        }

        stage('Tag Latest for Production') {
            when { expression { params.DEPLOY_ENV == 'production' } }
            steps {
                bat "docker tag ahmedmasmoudi047/react-frontend:%IMAGE_TAG% ahmedmasmoudi047/react-frontend:latest"
                bat "docker tag ahmedmasmoudi047/django-backend:%IMAGE_TAG% ahmedmasmoudi047/django-backend:latest"
                bat "docker push ahmedmasmoudi047/react-frontend:latest"
                bat "docker push ahmedmasmoudi047/django-backend:latest"
            }
        }

        stage('Approval for Production') {
            when { expression { params.DEPLOY_ENV == 'production' } }
            steps {
                script {
                    slackSend(channel: env.SLACK_CHANNEL, message: "🚨 Waiting for approval to deploy *PRODUCTION* - tag: ${IMAGE_TAG}")
                    timeout(time: 10, unit: 'MINUTES') {
                        input message: "🚨 Confirm deployment to PRODUCTION with tag: ${IMAGE_TAG}?"
                    }
                }
            }
        }

        stage('Run Ansible Deployment') {
            steps {
                bat """
                    wsl ansible-playbook /mnt/c/Users/AHMED_MASMOUDI/react-django/ansible-setup/deploy-react-django.yml ^
                    -i /mnt/c/Users/AHMED_MASMOUDI/react-django/ansible-setup/inventory.ini ^
                    --extra-vars "image_tag=%IMAGE_TAG% target_env=${params.DEPLOY_ENV}"
                """
            }
        }
    }

    post {
        failure {
            script {
                slackSend(channel: env.SLACK_CHANNEL, message: "❌ Deployment FAILED for ${params.DEPLOY_ENV} | Job: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
            }
            mail to: 'ahmedmasmoudi803@gmail.com',
                 subject: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """
Build failed in job: ${env.JOB_NAME}
Build number: ${env.BUILD_NUMBER}
Check details: ${env.BUILD_URL}
"""
        }
        success {
            script {
                slackSend(channel: env.SLACK_CHANNEL, message: "✅ Deployment SUCCESSFUL to ${params.DEPLOY_ENV} with tag ${IMAGE_TAG}")
            }
            echo "✅ Pipeline executed successfully!"
        }
    }
}
stage('Deploy to Kubernetes') {
    steps {
        sh '''
        kubectl apply -f k8s/backend-deployment.yaml
        kubectl apply -f k8s/frontend-deployment.yaml
        '''
    }
}

