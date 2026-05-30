$c = Get-Content 'C:\Users\camer\lawn-care-tools\data\program.json' -Raw

Write-Host "=== FINAL VERIFICATION ==="

# Version
Write-Host "version 2.4: $($c.Contains('""version"":  ""2.4""'))"

# Meta notes
Write-Host "meta Seaweed note: $($c.Contains('Seaweed Secrets (productId 7) added to every Wk3'))"
Write-Host "meta Phosfighter note: $($c.Contains('Phosfighter (productId 22) placeholder added'))"

# Seaweed Secrets - 1 per Pass2 task
$ids = @('jan-w3-t2','feb-w3-t2','mar-w3-t2','apr-w3-t2','may-w3-t2','jun-w3-t2','jul-w3-t2','aug-w3-t2','sep-w3-t4','oct-w3-t2','nov-w3-t2','dec-w3-t2')
foreach ($id in $ids) {
    $pos = $c.IndexOf("`"id`":  `"$id`"")
    if ($pos -lt 0) { Write-Host "$id NOT FOUND"; continue }
    $beforePos = $c.Substring(0, $pos)
    $taskStart = $beforePos.LastIndexOf('"taskType":')
    $taskRegion = $c.Substring($taskStart, $pos - $taskStart + 50)
    $p7count = ([regex]::Matches($taskRegion, '"productId":  7,')).Count
    $status = if ($p7count -eq 1) { "OK" } else { "ERROR($p7count)" }
    Write-Host "$id productId7: $status"
}

# Phosfighter tasks
$phosIds = @('jan-w3-phosfighter','may-w3-phosfighter','jun-w3-phosfighter','jul-w3-phosfighter','aug-w3-phosfighter','sep-w3-phosfighter','oct-w3-phosfighter','nov-w3-phosfighter','dec-w3-phosfighter')
foreach ($phid in $phosIds) {
    Write-Host "$phid found: $($c.Contains($phid))"
}

# Phosfighter NOT in feb, mar, apr
Write-Host "feb-phos absent: $(-not $c.Contains('feb-w3-phosfighter'))"
Write-Host "mar-phos absent: $(-not $c.Contains('mar-w3-phosfighter'))"
Write-Host "apr-phos absent: $(-not $c.Contains('apr-w3-phosfighter'))"

# aug-w3-t3 removed
Write-Host "aug-w3-t3 absent: $(-not $c.Contains('aug-w3-t3'))"

# productId 22 (Phosfighter) count should be 9
$p22count = ([regex]::Matches($c, '"productId":  22,')).Count
Write-Host "productId 22 count: $p22count (expect 9)"

# productId 7 total
$p7total = ([regex]::Matches($c, '"productId":  7,')).Count
Write-Host "productId 7 total: $p7total (expect 12)"

# JSON valid
try {
    $null = $c | ConvertFrom-Json
    Write-Host "JSON: VALID"
} catch {
    Write-Host "JSON: INVALID - $_"
}

$lines = ($c -split "`n").Count
Write-Host "Total lines: $lines"
