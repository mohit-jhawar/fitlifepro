# FitLife Production Build & Test Script

Write-Host "🚀 FitLife Production Build & Optimization" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "   ✓ Removed old build directory" -ForegroundColor Green
}

# Step 2: Build production bundle
Write-Host ""
Write-Host "📦 Building production bundle..." -ForegroundColor Yellow
Write-Host "   (This may take 1-2 minutes)" -ForegroundColor Gray
$env:GENERATE_SOURCEMAP = "false"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Build completed successfully!" -ForegroundColor Green
    
    # Show build stats
    $buildSize = (Get-ChildItem -Recurse "build" | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   📊 Total build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "   ✗ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Serve and test
Write-Host ""
Write-Host "🌐 Starting production server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Testing Instructions:" -ForegroundColor Cyan
Write-Host "   1. Server will start on http://localhost:3000" -ForegroundColor White
Write-Host "   2. Open Chrome DevTools (F12)" -ForegroundColor White
Write-Host "   3. Go to Lighthouse tab" -ForegroundColor White
Write-Host "   4. Run audit for 'Performance'" -ForegroundColor White
Write-Host "   5. Check the improved scores! 🎉" -ForegroundColor White
Write-Host ""
Write-Host "Expected improvements:" -ForegroundColor Green
Write-Host "   • Performance: 33 → 75-85" -ForegroundColor White
Write-Host "   • JavaScript: Minified & optimized" -ForegroundColor White
Write-Host "   • Images: Proper dimensions added" -ForegroundColor White
Write-Host "   • Caching: Headers configured" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server when done testing" -ForegroundColor Yellow
Write-Host ""

# Check if serve is installed
$hasServe = Get-Command serve -ErrorAction SilentlyContinue

if ($hasServe) {
    npx serve -s build -l 3000
} else {
    Write-Host "Installing serve..." -ForegroundColor Yellow
    npm install -g serve
    npx serve -s build -l 3000
}
