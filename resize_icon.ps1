Add-Type -AssemblyName System.Drawing
$originalPath = 'Icono RCP.png'
$backupPath = 'Icono RCP_backup.png'
$newPath = 'Icono RCP.png'

if (Test-Path $originalPath) {
    Copy-Item $originalPath $backupPath -Force
    
    $img = [System.Drawing.Image]::FromFile($originalPath)
    $width = $img.Width
    $height = $img.Height
    
    # 60% size for the logo
    $newSize = [math]::Round($width * 0.6)
    
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    
    # High quality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Fill background with #0a0a0a
    $bgColor = [System.Drawing.Color]::FromArgb(255, 10, 10, 10)
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $graphics.FillRectangle($brush, 0, 0, $width, $height)
    
    # Draw original image scaled down and centered
    $x = [math]::Round(($width - $newSize) / 2)
    $y = [math]::Round(($height - $newSize) / 2)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $newSize, $newSize)
    
    $graphics.DrawImage($img, $rect)
    
    $graphics.Dispose()
    $img.Dispose()
    
    $bmp.Save($newPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    
    Write-Output "Icon padded successfully using System.Drawing."
} else {
    Write-Output "Image not found."
}
