$inv = (Get-Content 'C:\Users\camer\lawn-care-tools\data\inventory.json').Count
$prog = (Get-Content 'C:\Users\camer\lawn-care-tools\data\program.json').Count
Write-Host "inventory.json lines: $inv"
Write-Host "program.json lines: $prog"
# Validate inventory JSON
$invContent = Get-Content 'C:\Users\camer\lawn-care-tools\data\inventory.json' -Raw
try {
    $parsed = $invContent | ConvertFrom-Json
    Write-Host "inventory.json: VALID JSON, totalProducts=$($parsed.totalProducts), products count=$($parsed.products.Count)"
} catch {
    Write-Host "inventory.json: INVALID - $_"
}
