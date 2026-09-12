# Deploy Valmiki Ramayana to GitHub Pages (gh-pages branch)
$ErrorActionPreference = "Stop"

Write-Host "🪔 [1/3] Building Next.js static export for GitHub Pages..." -ForegroundColor Cyan
$env:GITHUB_ACTIONS = "true"
Set-Location "$PSScriptRoot\web"
npm run build

Write-Host "🚀 [2/3] Preparing git repository on gh-pages..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\web\out"

if (Test-Path ".git") {
    Remove-Item -Recurse -Force .git
}

git init
git checkout -B gh-pages
git config user.name "Jayesh Karande"
git config user.email "JayeshKarande1@users.noreply.github.com"
git add -A
git commit -m "deploy: update GitHub Pages build [skip ci]"

Write-Host "🌐 [3/3] Pushing to origin/gh-pages..." -ForegroundColor Cyan
git remote add origin https://github.com/JayeshKarande1/Ramayana.git
git push -u origin gh-pages --force

Remove-Item -Recurse -Force .git
Set-Location "$PSScriptRoot"

Write-Host "✨ Deployed successfully to https://jayeshkarande1.github.io/Ramayana/" -ForegroundColor Green
