/*
Lord Mendoza
SWE 645 - HW2
The following tells the Jenkins server to:
1. Delete & build the project's war file
2. Login to docker
3. Build a new image & push it
4. Tell Rancher to redeploy with the latest image.
 */

pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = credentials("DOCKER_USER_ID")
        DOCKER_CREDENTIALS_PASS = credentials("DOCKER_PASSWORD")
        KUBECONFIG = credentials("KUBECONFIG")
        IMAGE_NAME = 'hw2'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout, Build, & Login') {
            steps {
                checkout scm
                sh 'rm -rf *.war'
                sh 'jar -cvf hw2.war *'
                sh """
                        echo "${DOCKER_CREDENTIALS_PASS}" | docker login -u "${DOCKER_CREDENTIALS_ID}" --password-stdin
                    """
            }
        }

        stage('Building Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_CREDENTIALS_ID}/${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Pushing Docker Image') {
            steps {
                script {
                    docker.image("${DOCKER_CREDENTIALS_ID}/${IMAGE_NAME}:${IMAGE_TAG}").push()
                }
            }
        }

        stage("Deploying to Rancher") {
            steps {
                script {
                    sh """
                        export KUBECONFIG="${KUBECONFIG}" && kubectl get nodes
                        kubectl set image deployment/hw2-deployment hw2-container="${DOCKER_CREDENTIALS_ID}"/"${IMAGE_NAME}":"${IMAGE_TAG}" -n default
                        kubectl rollout status deployment/hw2-deployment -n default
                    """
                }
            }
        }
    }
}
