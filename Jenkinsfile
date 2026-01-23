pipeline {
    agent any

    environment {
        IMAGE_NAME = "glass-todo"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/harshavardhan774/glass-todo.git'
            }
        }

        stage('SonarQube SAST') {
            steps {
                withSonarQubeEnv('sonar-local') {
                    sh '''
                    sonar-scanner \
                      -Dsonar.projectKey=glass-todo
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build --no-cache -t $IMAGE_NAME .
                '''
            }
        }
    }
}


