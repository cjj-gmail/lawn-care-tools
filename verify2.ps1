$c = Get-Content 'C:\Users\camer\lawn-care-tools\data\program.json' -Raw

# Check Seaweed Secrets - search FORWARD from each Pass2 task ID
$ids = @('jan-w3-t2','feb-w3-t2','mar-w3-t2','apr-w3-t2','may-w3-t2','jun-w3-t2','jul-w3-t2','aug-w3-t2','sep-w3-t4','oct-w3-t2','nov-w3-t2','dec-w3-t2')
foreach ($id in $ids) {
    $pos = $c.IndexOf($id)
    if ($pos -lt 0) { Write-Host "$id NOT FOUND"; continue }
    # Look 200 chars before the id (within the same task's products)
    $start = [Math]::Max(0, $pos - 3000)
    $region = $c.Substring($start, $pos - $start)
    # Find last Activ8EXTRA in region
    $a8pos = $region.LastIndexOf('Activ8EXTRA')
    $sspos = $region.LastIndexOf('Seaweed Secrets')
    Write-Host "$id -> last Activ8EXTRA at: $a8pos, last Seaweed Secrets at: $sspos (SS after A8: $($sspos -gt $a8pos))"
}

# Count occurrences of Seaweed Secrets product entry
$ssCount = ([regex]::Matches($c, '"productId":  7')).Count
Write-Host "productId 7 count: $ssCount (expect 12)"

# Check phosfighter IDs
$phosIds = @('jan-w3-phosfighter','may-w3-phosfighter','jun-w3-phosfighter','jul-w3-phosfighter','aug-w3-phosfighter','sep-w3-phosfighter','oct-w3-phosfighter','nov-w3-phosfighter','dec-w3-phosfighter')
foreach ($phid in $phosIds) {
    $found = $c.Contains($phid)
    Write-Host "$phid found: $found"
}
