param (
    [string]$v,
    [string]$c
)

function Exit-OnFailure {
    param([string]$Step)
    if ($LASTEXITCODE -ne 0) {
        Write-Host "$Step failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
}
$versionFilePath = "./package.json"
$versionJson = Get-Content $versionFilePath | ConvertFrom-Json
if ($v) {
    $versionJson.version = $v
}
else {
    $temp = $versionJson.version
    Write-Output "--- No version provided, updates current version from version.json file - $temp  ---"
}
$version = $versionJson.version
$currentProject = gcloud config get-value project
if (-not $c) {
    $response = Read-Host "You are in $currentProject. Do you want to continue with the deployment version $version ? (y/n)"
    if ($response -ne "y") {
        Write-Output "Deployment aborted by the user."
        exit 0
    }
}

if ($v) {
    $versionJson | ConvertTo-Json -Depth 10 | Set-Content $versionFilePath
}

if ($currentProject -eq "akeyless-nx-qa") {
    Write-Host "--------------- QA mode ----------------"
    $enviroment = "qa"
    $imageName = "nx-monitor-qa"
    $deploymentName = "nx-monitor-deployment-qa"
}
else {
    Write-Host "--------------- PROD mode ----------------"
    $enviroment = "prod"
    $imageName = "nx-monitor"
    $deploymentName = "nx-monitor-deployment"
}
# ***** set kubectl context to cuurent project *****
gcloud container clusters get-credentials nx-apps --zone europe-west1
Exit-OnFailure "Fetching cluster credentials"
# Build the Docker image with the new version
docker build --build-arg ENV=$enviroment -t gcr.io/${currentProject}/${imageName}:${version} .
Exit-OnFailure "Docker build"
# Tag the new image as 'latest'
docker tag gcr.io/${currentProject}/${imageName}:${version} gcr.io/${currentProject}/${imageName}:latest
Exit-OnFailure "Docker tag"
# Push both tags to Google Container Registry
docker push gcr.io/${currentProject}/${imageName}:${version}
Exit-OnFailure "Docker push ($version)"
docker push gcr.io/${currentProject}/${imageName}:latest
Exit-OnFailure "Docker push (latest)"
# Restart the Kubernetes deployment to ensure it's using the latest image
kubectl rollout restart deployment/${deploymentName}
Exit-OnFailure "Restart deployment"
# Check the status of the pods to ensure the deployment was successful
kubectl get pods

[System.Console]::Beep(1000, 1500)
Write-Output "Deployment completed successfully."