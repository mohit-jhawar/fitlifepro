# Image Optimization Script for FitLife
# This script converts JPG images to WebP format for better performance

Write-Host "🖼️  FitLife Image Optimization Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$imagesDir = "public\assets\images"
$images = @(
    "card-workout.jpg",
    "card-nutrition.jpg",
    "workout-bg.jpg",
    "diet-bg.jpg",
    "saved-bg-desktop.jpg",
    "saved-bg-mobile.jpg",
    "gallery-running.jpg",
    "gallery-discipline.jpg",
    "gallery-goals.jpg",
    "gallery-transform.jpg",
    "contact-bg.jpg",
    "feedback-bg.jpg"
)

Write-Host "📊 Images to optimize: $($images.Count)" -ForegroundColor Yellow
Write-Host ""

# Check if we have ImageMagick or need to use online conversion
$hasImageMagick = Get-Command magick -ErrorAction SilentlyContinue

if ($hasImageMagick) {
    Write-Host "✅ ImageMagick found - using local conversion" -ForegroundColor Green
    
    foreach ($img in $images) {
        $inputPath = Join-Path $imagesDir $img
        $outputPath = $inputPath -replace '\.jpg$', '.webp'
        
        if (Test-Path $inputPath) {
            Write-Host "Converting: $img..." -NoNewline
            magick $inputPath -quality 80 -define webp:lossless=false $outputPath
            
            $originalSize = (Get-Item $inputPath).Length / 1KB
            $newSize = (Get-Item $outputPath).Length / 1KB
            $savings = [math]::Round((($originalSize - $newSize) / $originalSize) * 100, 1)
            
            Write-Host " ✓ Saved $savings% ($([math]::Round($originalSize - $newSize, 1)) KB)" -ForegroundColor Green
        }
    }
} else {
    Write-Host "⚠️  ImageMagick not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To optimize images automatically, install ImageMagick:" -ForegroundColor Cyan
    Write-Host "  winget install ImageMagick.ImageMagick" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use online tools:" -ForegroundColor Cyan
    Write-Host "  - https://squoosh.app/" -ForegroundColor White
    Write-Host "  - https://tinypng.com/" -ForegroundColor White
    Write-Host ""
    Write-Host "Manual optimization steps:" -ForegroundColor Yellow
    Write-Host "1. Upload each JPG to Squoosh.app" -ForegroundColor White
    Write-Host "2. Select WebP format, quality 80" -ForegroundColor White
    Write-Host "3. Download and replace in $imagesDir" -ForegroundColor White
}

Write-Host ""
Write-Host "✨ Optimization complete!" -ForegroundColor Green
