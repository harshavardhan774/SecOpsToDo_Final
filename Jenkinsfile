pipeline {
    agent any

    environment {
        IMAGE_NAME = "glass-todo"
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

        stage('Docker Build') {
            steps {
                sh '''
                docker build --no-cache -t $IMAGE_NAME .
                '''
            }
        }

        stage('Docker Run (Test)') {
            steps {
                sh '''
                docker rm -f glass-todo-test || true
                docker run -d --name glass-todo-test -p 5000:5000 $IMAGE_NAME
                sleep 10
                docker ps | grep glass-todo
                '''
            }
        }
    }

    post {
        always {
            sh 'docker rm -f glass-todo-test || true'
        }
    }
}
