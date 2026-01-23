pipeline {
    agent any

    environment {
        IMAGE_NAME = "glass-todo"
        CONTAINER_NAME = "glass-todo-app"
    }

    stages {

        /* ================= CHECKOUT ================= */
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/harshavardhan774/SecOpsToDo_Final.git'
            }
        }

        /* ================= SONARQUBE ================= */
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-local') {
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=glass-todo \
                          -Dsonar.sources=frontend/src,backend \
                          -Dsonar.exclusions=**/node_modules/**,**/build/**,**/*.css
                        """
                    }
                }
            }
        }

        /* ================= DOCKER BUILD ================= */
        stage('Docker Build') {
            steps {
                sh '''
                docker build --no-cache -t $IMAGE_NAME .
                '''
            }
        }

        /* ================= DOCKER RUN ================= */
        stage('Docker Run') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true

                docker run -d \
                  --name $CONTAINER_NAME \
                  -p 3000:3000 \
                  -p 5000:5000 \
                  $IMAGE_NAME

                sleep 10
                docker ps | grep $CONTAINER_NAME
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline finished"
        }
        failure {
            echo "Pipeline failed" 
        }
    }
}
