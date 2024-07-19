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
        stage('Build Docker Images') {
            steps {
                sh 'docker build -t sfbimmortal/sharespace-frontend/1.0.1 ./frontend'
                sh 'docker build -t sfbimmortal/sharespace-backend/1.0.1 ./backend'
            }
        }
        stage('Push images to dockerhub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhubcreds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                    sh 'docker push sfbimmortal/sharespace-frontend/1.0.1'
                    sh 'docker push sfbimmortal/sharespace-backend/1.0.1'
                }
            }
        }
    }
}