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
                docker build -t $IMAGE_NAME .
                '''
            }
        }

       stage('Trivy Image Scan') {
    		steps {
        		sh '''
        		echo "Running Trivy scan on Docker image (vuln-only, optimized)"
        		trivy image \
          			--scanners vuln \
          			--timeout 15m \
          			--exit-code 1 \
          			--severity HIGH,CRITICAL \
         			 glass-todo
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

        stage('Deploy to App Server (192.168.56.24)') {
            environment {
                APP_HOST = "192.168.56.24"
                APP_USER = "star"
            }
            steps {
                sh '''
                echo "Stopping old container on app server"
                ssh ${APP_USER}@${APP_HOST} "docker rm -f glass-todo || true"

                echo "Transferring image to app server"
                docker save glass-todo | ssh ${APP_USER}@${APP_HOST} docker load

                echo "Running new container on app server"
                ssh ${APP_USER}@${APP_HOST} "
                  docker run -d \
                    --name glass-todo \
                    -p 5000:5000 \
                    glass-todo
                "
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
