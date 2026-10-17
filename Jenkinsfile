// GitLens CI/CD pipeline for Jenkins (runs on Windows)
// GitHub -> Build -> Automated Testing -> Code Quality Check -> Deployment
pipeline {
    agent any

    // TRIGGER: Jenkins checks GitHub every 2 minutes and starts a build
    // automatically when it finds a new commit on main.
    triggers {
        pollSCM('H/2 * * * *')
    }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        // Folder the deployed site is copied to. A local web server serves it on http://localhost:5000
        DEPLOY_DIR = 'C:\\gitlens-deploy'
    }

    stages {
        stage('GitHub Checkout') {
            steps {
                checkout scm
                bat 'git log -1 --pretty=format:"Building commit %%h: %%s by %%an"'
            }
        }

        stage('Build') {
            steps {
                bat 'node --version'
                bat 'npm ci'
                bat 'npm run build'
            }
        }

        stage('Automated Testing') {
            steps {
                bat 'npm run test:ci'
            }
            post {
                always {
                    // Shows the "Test Result" page and trend chart in Jenkins
                    junit 'test-results.xml'
                }
            }
        }

        stage('Code Quality Check') {
            steps {
                bat 'npm install --no-save eslint@9.17.0 @eslint/js@9.17.0 globals@15.14.0 eslint-plugin-react-hooks@5.1.0 eslint-plugin-react-refresh@0.4.16'
                // ESLint errors fail this stage and stop the pipeline; warnings are only reported
                bat 'npx eslint .'
            }
        }

        stage('Deploy') {
            steps {
                bat 'if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"'
                bat 'xcopy /E /I /Y dist "%DEPLOY_DIR%"'
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Pipeline passed. Deployed to C:\\gitlens-deploy (open http://localhost:5000)'
        }
        failure {
            echo 'Pipeline failed. Later stages were skipped and nothing was deployed.'
        }
    }
}
