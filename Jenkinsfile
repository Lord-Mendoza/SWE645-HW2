pipeline {

    environment {
        // Docker Hub credentials ID
        DOCKER_CREDENTIALS_ID = 'lordm'
        // Docker image name
        IMAGE_NAME = 'Lord-Mendoza/SWE645-HW2'
        // Docker image tag
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                // Check out the code from your source repository
                git 'https://github.com/Lord-Mendoza/SWE645-HW2.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        // Build Docker image
                        def image = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        // Push the Docker image to the registry
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
