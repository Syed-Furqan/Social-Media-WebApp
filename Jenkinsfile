pipeline {
    agent any
    environment {
        TEST_VAR = credentials('test_var')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Syed-Furqan/Social-Media-WebApp.git'
            }
        }
        stage('Run Frontend/Client tests') {
            steps {
                dir('./frontend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        stage('Run Backend tests') {
            steps {
                dir('./backend') {
                    sh 'npm install'
                    sh 'export TEST_VAR=$TEST_VAR'
                    sh 'npm test'
                }
            }
        }
        // Build Docker Images
        // Push Docker images to Dockerhub
    }
}