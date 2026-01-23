pipeline {
    agent any

    environment {
        IMAGE_NAME = "glass-todo"
    }

    tools {
        sonarScanner 'sonar-scanner'
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
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=glass-todo \
                          -Dsonar.sources=frontend/src,backend
                        """
                    }
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

