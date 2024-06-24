pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = "${DOCKER_USER_ID}"
        DOCKER_CREDENTIALS_PASS = "${DOCKER_PASSWORD}"
        IMAGE_NAME = 'HW2'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                // Check out the code from your source repository
                checkout scm
                sh 'rm -rf *.war'
                sh 'jar -cvf hw2.war *'
                sh 'docker login --username "${DOCKER_USER_ID}" --password "${DOCKER_PASSWORD}" --password-stdin'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_USER_ID}") {
                        def image = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_USER_ID}") {
                        def image = docker.image("${IMAGE_NAME}:${IMAGE_TAG}")
                        image.push()
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up Docker images to free up space
            script {
                def image = docker.image("${IMAGE_NAME}:${IMAGE_TAG}")
                image.remove()
            }
        }
    }
}
