pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = credentials("DOCKER_USER_ID")
        DOCKER_CREDENTIALS_PASS = credentials("DOCKER_PASSWORD")
        IMAGE_NAME = 'hw2'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                // Check out the code from your source repository
                checkout scm
                sh 'rm -rf *.war'
                sh 'jar -cvf hw2.war *'
                sh """
                        echo "${DOCKER_CREDENTIALS_PASS}" | docker login -u "${DOCKER_CREDENTIALS_ID}" --password-stdin
                    """
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_CREDENTIALS_ID}/${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.image("${DOCKER_CREDENTIALS_ID}/${IMAGE_NAME}:${IMAGE_TAG}").push()
                }
            }
        }
    }
}
