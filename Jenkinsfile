#!/usr/bin/groovy

cancelPreviousBuilds()
import utilities.Utils

utils = new Utils(this)

/*
  git workflow:
  On PR (in parallel):
    1. do nothing yet

  On master branch:
    1. build docker image (tag: git rev-list --count --first-parent HEAD)
    2. deploy the docker image in staging

  On tag:
    1. deploy the docker image built in master
*/

// this user has permission to push into the s3 bucket trf-b2c-viator-experiences
def ciApprole = "trf-approle_b2c-viator-experiences-ci"
def ciSecrets = [
    'AWS_ACCESS_KEY_ID': 'trf-secret/prod/aws-iam/tools/trf-b2c-viator-experiences-ci/#access_key',
    'AWS_SECRET_ACCESS_KEY': 'trf-secret/prod/aws-iam/tools/trf-b2c-viator-experiences-ci/#secret_key'
]

def podTemplateNode = utils.getCustomPodTemplates([
    node: [ecrImage: 'docker.io/node',
                  version: "20.9.0-bookworm-slim",
                  command: "cat",
                  tty: "true",
                  cpu: "1",
                  memory: "2Gi"],
    'aws-utils-debian': [ecrImage: 'github/lafourchette/core-image-utils/aws-utils-debian',
                  version: "0.0.13",
                  command: "cat",
                  tty: "true",
                  cpu: "0.2",
                  memory: "512Mi"],
    ])

def shortEnvironment = utils.isTag() ? "prod" : "staging"
def ou = (shortEnvironment == "prod") ? "external" : "external-staging"

def podTemplate = utils.getCustomPodTemplates([
    "chart-deployer": [
        ecrImage: "github/lafourchette/core-image-utils/chart-deployer",
        version: "1.5.1",
        imagePullPolicy: "Always",
        command: "cat",
        tty: "true",
        cpu: "1",
        memory: "512Mi",
    ],
])

pipeline {
    agent none
    options {
        ansiColor('xterm')
        timestamps()
    }
    environment {
        AWS_REGION = 'eu-west-3'
    }
    stages {
        // notify the launch of this job
        stage('[NOTIF] notify experiences-project slack channel') {
            when {
                beforeAgent true
                anyOf {
                    buildingTag()
                    branch 'master'
                }
            }
            agent {
                kubernetes {
                    inheritFrom "default aws-utils-debian"
                    label "${utils.getKubernetesRandomLabel('slack-notification')}"
                    yamlMergeStrategy merge()
                    yaml utils.getCustomResourcesForContainers(['aws-utils-debian': [cpu: '0.4', memory: '256Mi']])
                }
            }
            steps {
                container('aws-utils-debian') {
                    script {
                        slackSend channel: 'experiences-project', color: "#33FFC7", message: "Starting b2c-viator-experiences job in ${shortEnvironment}"
                    }
                }
            }
        }

        // only build docker image on staging branch and on tags
        stage('[BUILD] - Docker release image') {
            when {
                beforeAgent true
                anyOf {
                    branch 'master'
                    changeRequest()
                }
            }
            environment {
                LOGFILE = 'dockerbuild.log'
            }
            agent {
                kubernetes {
                    inheritFrom 'default buildkit aws-utils-debian'
                    yamlMergeStrategy merge()
                    label "${utils.getKubernetesRandomLabel('buildkit')}"
                    yaml utils.getCustomResourcesForContainers([buildkit: [cpu: '2', memory: '6Gi'], "aws-utils-debian": [cpu: '0.2', memory: '128Mi']])
                }
            }
            steps {
                script {
                    buildkit {
                        dockerTag = sh(script : "git config --global --add safe.directory '*' > /dev/null 2>&1; git rev-list --count --first-parent HEAD", returnStdout: true).trim()
                    }
                }
            }
            // always copy the result of the output into the s3 bucket for experiences-project team
            post {
                always {
                    container('aws-utils-debian') {
                        vaultInjection(ciApprole, ciSecrets) {
                            sh '''
                            # if we rebuild the same version, its just copied to avoid useless build, so the logfile doesn't exists
                            touch ${LOGFILE}
                            #CHANGE_BRANCH_TR=$(echo "${CHANGE_BRANCH}" | tr "/" "_")
                            DESTINATION="s3://trf-b2c-viator-experiences/jenkins/${CHANGE_BRANCH}/${LOGFILE}"
                            aws s3 cp ${LOGFILE} ${DESTINATION}
                            '''
                        }
                    }
                }
            }
        }

        stage("[Deployment] deployment for b2c-viator-experiences") {
            when {
                beforeAgent true
                anyOf {
                    branch 'master'
                    buildingTag()
                }
            }
            agent {
                kubernetes {
                    inheritFrom 'default aws-utils-debian'
                    yamlMergeStrategy merge()
                    label "${utils.getKubernetesRandomLabel('chart-deployer')}"
                    yaml utils.getCustomResourcesForContainers(["aws-utils-debian": [cpu: '0.2', memory: '512Mi']])
                    yaml podTemplate
                }
            }
            environment {
                LOGFILE = 'deployment.log'
                DESTINATION = "s3://trf-b2c-viator-experiences/jenkins/${env.GIT_BRANCH}/${LOGFILE}"
            }
            steps {
                container('chart-deployer') {
                    vaultInjection(ciApprole, ciSecrets) {
                        script {
                            slackSend channel: 'experiences-project', color: "#439FE0", message: "Deploying b2c-viator-experiences in ${shortEnvironment}"
                            println "Deploying experiences-project in OU ${ou}, for environment ${shortEnvironment}"
                        }
                    }
                    script {
                        def buildInfoOldJenkins = triggerRemoteJob(
                            remoteJenkinsName: 'jenkins-deploy',
                            job: 'github-core/core-kubernetes-config-pipelines/helmfile-deploy',
                            parameters: ['APP': 'b2c-viator-experiences',
                                'CHANGE_CAUSE': "deployment triggered by the cd ${env.GIT_BRANCH}",
                                'ENVIRONMENT': "${ou}",
                                'REVISION': sh(script : "git config --global --add safe.directory '*' > /dev/null 2>&1; git rev-list --count --first-parent HEAD", returnStdout: true).trim(),
                                'INTEGRATION_ID' : ""],
                            blockBuildUntilComplete: true)
                        echo '[jenkins-deploy] Remote Status: ' + buildInfoOldJenkins.getBuildResult().toString()

                        if(buildInfoOldJenkins.getBuildResult().toString() != 'SUCCESS'){
                            echo "The deploy job failed, check logs above"
                            exit 1
                        }
                    }
                }
            }
            post {
                // warn on success or unsuccess
                unsuccessful {
                    container('chart-deployer') {
                        script {
                            slackSend channel: 'experiences-project', color: "danger", message: "KO - b2c-viator-experiences deployment in ${shortEnvironment} has failed, check why on ${env.DESTINATION}"
                        }
                    }
                }
                success {
                    container('chart-deployer') {
                        script {
                            slackSend channel: 'experiences-project', color: "good", message: "OK - b2c-viator-experiences has correctly been deployed in ${shortEnvironment}"
                        }
                    }
                }
                // always copy the result of the output into the s3 bucket for experiences-project team
                always {
                    container('aws-utils-debian') {
                        vaultInjection(ciApprole, ciSecrets) {
                            sh '''
                            set -x
                            LOGFILE_SRC=\$(find /home/jenkins/ -type f -name "jenkins-log.txt")
                            cp \${LOGFILE_SRC} \${LOGFILE}
                            echo "'\${LOGFILE_SRC}' correctly copied into '\${LOGFILE}'"

                            #CHANGE_BRANCH_TR=$(echo "${CHANGE_BRANCH}" | tr "/" "_")
                            aws s3 cp ${LOGFILE} ${DESTINATION}
                            '''
                        }
                    }
                }
            }
        }
    }
}