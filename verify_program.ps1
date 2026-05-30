$c = Get-Content 'C:\Users\camer\lawn-care-tools\data\program.json' -Raw

# Check Seaweed Secrets in each Pass2 task
$ids = @('jan-w3-t2','feb-w3-t2','mar-w3-t2','apr-w3-t2','may-w3-t2','jun-w3-t2','jul-w3-t2','aug-w3-t2','sep-w3-t4','oct-w3-t2','nov-w3-t2','dec-w3-t2')
foreach ($id in $ids) {
    $pos = $c.IndexOf($id)
    if ($pos -lt 0) { Write-Host "$id NOT FOUND"; continue }
    $start = [Math]::Max(0, $pos - 2000)
    $region = $c.Substring($start, $pos - $start)
    $hasSeaweed = $region.Contains('Seaweed Secrets')
    Write-Host "$id -> Seaweed Secrets: $hasSeaweed"
}

# Check Phosfighter tasks exist
$phosIds = @('jan-w3-phosfighter','may-w3-phosfighter','jun-w3-phosfighter','jul-w3-phosfighter','aug-w3-phosfighter','sep-w3-phosfighter','oct-w3-phosfighter','nov-w3-phosfighter','dec-w3-phosfighter')
foreach ($pid in $phosIds) {
    $found = $c.Contains($pid)
    Write-Host "$pid found: $found"
}

# Check aug-w3-t3 removed
$aug3 = $c.Contains('aug-w3-t3')
Write-Host "aug-w3-t3 still present: $aug3"

# Check phosfighter NOT in feb, mar, apr
$febPhos = $c.Contains('feb-w3-phosfighter')
$marPhos = $c.Contains('mar-w3-phosfighter')
$aprPhos = $c.Contains('apr-w3-phosfighter')
Write-Host "feb-w3-phosfighter (should be false): $febPhos"
Write-Host "mar-w3-phosfighter (should be false): $marPhos"
Write-Host "apr-w3-phosfighter (should be false): $aprPhos"

# Check version and notes
$verCheck = $c.Contains('"version":  "2.4"')
$noteCheck1 = $c.Contains('Seaweed Secrets (productId 7) added to every Wk3')
$noteCheck2 = $c.Contains('Phosfighter (productId 22) placeholder added')
Write-Host "version 2.4: $verCheck"
Write-Host "meta note Seaweed Secrets: $noteCheck1"
Write-Host "meta note Phosfighter: $noteCheck2"

# Line count
$lines = ($c -split "`n").Count
Write-Host "Total lines: $lines"

# Validate JSON
try {
    $null = $c | ConvertFrom-Json
    Write-Host "JSON VALID"
} catch {
    Write-Host "JSON INVALID: $_"
}
