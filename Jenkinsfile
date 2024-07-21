def gv
def FRONTEND_IMAGE_TAG
def BACKEND_IMAGE_TAG
def curr_frontend_version
def curr_backend_version

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

        stage('Load groovy script') {
            steps {
                script {
                    gv = load "script.groovy"
                }
            }
        }

        // stage('Run Frontend/Client tests') {
        //     steps {
        //         dir('./frontend') {
        //             sh 'npm install'
        //             sh 'npm test'
        //         }
        //     }
        // }

        // stage('Run Backend tests') {
        //     steps {
        //         dir('./backend') {
        //             sh 'npm install'
        //             sh "export TEST_VAR=${TEST_VAR}"
        //             sh 'npm test'
        //         }
        //     }
        // }

        stage('Get Versions of Images') {
            steps {
                script {
                    curr_frontend_version = sh(script: "cat versions.txt | grep FRONTEND | cut -d'=' -f2", returnStdout: true).trim()
                    curr_backend_version = sh(script: "cat versions.txt | grep BACKEND | cut -d'=' -f2", returnStdout: true).trim()
                    echo "${curr_frontend_version}"
                    echo "${curr_backend_version}"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    FRONTEND_IMAGE_TAG = gv.get_new_version(curr_frontend_version)
                    BACKEND_IMAGE_TAG = gv.get_new_version(curr_backend_version)

                    echo "${FRONTEND_IMAGE_TAG}"
                    echo "${BACKEND_IMAGE_TAG}"

                    // sh "docker build -t sfbimmortal/sharespace-frontend/${FRONTEND_IMAGE_TAG} ./frontend"
                    // sh "docker build -t sfbimmortal/sharespace-backend/${BACKEND_IMAGE_TAG} ./backend"
                }
            }
        }

        stage('Update versions of images') {
            steps {
                script {
                    def data = "FRONTEND=${FRONTEND_IMAGE_TAG}\nBACKEND=${BACKEND_IMAGE_TAG}"
                    writeFile('versions.txt', data)
                    sh "git add ."
                    sh "git commit -m ''"
                    sh "git push https://github.com/Syed-Furqan/Social-Media-WebApp.git main"
                }
            }
        }

        // stage('Push images to dockerhub') {
        //     steps {
        //         withCredentials([usernamePassword(credentialsId: 'dockerhubcreds', usernameVariable: DOCKER_USERNAME, passwordVariable: DOCKER_PASSWORD)]) {
        //             sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
        //             sh "docker push sfbimmortal/sharespace-frontend/${FRONTEND_IMAGE_TAG}"
        //             sh "docker push sfbimmortal/sharespace-backend/${BACKEND_IMAGE_TAG}"
        //         }
        //     }
        // }

        // stage('Update Kubernetes Manifests') {
        //     steps {
        //         script {
        //             dir('./kubernetes/deployments') {
        //                 sh "sed -i -e 's/image:.*/image:sfbimmortal/sharespace-frontend/${FRONTEND_IMAGE_TAG}' ss-frontend-deployment.yaml"
        //                 sh "sed -i -e 's/image:.*/image:sfbimmortal/sharespace-frontend/${BACKEND_IMAGE_TAG}' ss-backend-deployment.yaml"

        //             }
        //             withCredentials([usernamePassword(credentialsId: 'githubcreds', usernameVariable: USERNAME, passwordVariable: PASSWORD)]) {
        //                 sh "git config --global user.email ${USERNAME}"
        //                 sh "git config --global user.name ${PASSWORD}"
        //                 sh "git add ."
        //                 sh "git commit -m ''"
        //                 sh "git push https://github.com/Syed-Furqan/Social-Media-WebApp.git main"
        //             }
        //         }                
        //     }
        // }
    }
}