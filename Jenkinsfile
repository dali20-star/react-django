pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '0'
        IMAGE_TAG = "v${new Date().format('yyyyMMddHHmmss')}"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ahmed22-hub/react-django.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
                dir('backend') {
                    bat 'pip install -r requirements.txt'
                }
            }
        }

        stage('Run Tests') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    dir('frontend') {
                        bat 'npm test -- --watchAll=false'
                    }
                    dir('backend') {
                        bat 'pytest --maxfail=1 --disable-warnings'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
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
        }

        stage('Clean Docker') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                bat '''
                    docker system prune -af --volumes
                    docker logout
                '''
            }
        }

        stage('Docker Login') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
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
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
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
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                bat """
                    docker push ahmedmasmoudi047/react-frontend:%IMAGE_TAG%
                    docker push ahmedmasmoudi047/django-backend:%IMAGE_TAG%
                """
            }
        }

        stage('Deploy Application') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                echo '🚀 Déploiement de l’application'
            }
        }

        stage('Run Ansible Playbook') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
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
            mail to: 'your-email@example.com',
                 subject: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """
Build failed in job: ${env.JOB_NAME}
Build number: ${env.BUILD_NUMBER}
Check details: ${env.BUILD_URL}
"""
        }
        success {
            echo '✅ Pipeline exécuté avec succès !'
        }
    }
}
