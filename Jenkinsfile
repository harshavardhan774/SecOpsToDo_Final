pipeline {
    agent any

    environment {
        IMAGE_NAME = "glass-todo"
        APP_HOST   = "192.168.56.24"
        APP_USER   = "star"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/harshavardhan774/SecOpsToDo_Final.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-local') {
                    sh '''
                    sonar-scanner \
                      -Dsonar.projectKey=glass-todo \
                      -Dsonar.sources=frontend/src,backend
                    '''
                }
            }
        }

        stage('Docker Build (CI Server)') {
            steps {
                sh '''
                docker build -t glass-todo .
                '''
            }
        }

        stage('Deploy to App Server (192.168.56.24)') {
            steps {
                sh """
                ssh ${APP_USER}@${APP_HOST} '
                  docker stop glass-todo || true
                  docker rm glass-todo || true
                '

                docker save glass-todo | ssh ${APP_USER}@${APP_HOST} docker load

                ssh ${APP_USER}@${APP_HOST} '
                  docker run -d \
                    --name glass-todo \
                    -p 3000:3000 \
                    -p 5000:5000 \
                    glass-todo
                '
                """
            }
        }
    }
}
