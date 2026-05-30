$f = 'C:\Users\camer\lawn-care-tools\data\program.json'
$c = Get-Content $f -Raw -Encoding UTF8

# Use regex to find and remove the duplicate productId 7 block
# The duplicate is two consecutive productId 7 entries - replace with single
$pattern = '("productId":\s+7,\s+"name":\s+"Seaweed Secrets"[^}]+\}[^}]+\}),\s*\{[^{]*"productId":\s+7,\s+"name":\s+"Seaweed Secrets"[^}]+\}[^}]+\}'

$match = [regex]::Match($c, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($match.Success) {
    Write-Host "Found duplicate at pos $($match.Index), length $($match.Length)"
    Write-Host "Keeping: $($match.Groups[1].Value.Substring(0, 80))..."
    $c = $c.Substring(0, $match.Index) + $match.Groups[1].Value + $c.Substring($match.Index + $match.Length)
    Write-Host "Duplicate removed by regex"
} else {
    Write-Host "Regex pattern not matched - trying simpler approach"
    # Find first occurrence of two back-to-back productId 7 blocks
    $idx = 0
    $found = $false
    while ($true) {
        $p7pos = $c.IndexOf('"productId":  7,', $idx)
        if ($p7pos -lt 0) { break }
        # Check if next productId after this block is also 7
        $blockEnd = $c.IndexOf('"productId":', $p7pos + 20)
        if ($blockEnd -lt 0) { break }
        $nextId = $c.Substring($blockEnd, 25)
        if ($nextId -match '"productId":\s+7,') {
            Write-Host "Found back-to-back productId 7 at $p7pos and $blockEnd"
            # Find the end of first block (two closing braces after strip2)
            $strip2pos = $c.IndexOf('"strip2":  16.15', $p7pos)
            $close1 = $c.IndexOf('}', $strip2pos)  # closes quantities
            $close2 = $c.IndexOf('}', $close1 + 1)  # closes product entry
            # Remove from p7pos-2 (comma+newline before {) to close2+1
            # Find the comma+space before p7pos
            $beforeP7 = $c.Substring(0, $p7pos)
            $commaPos = $beforeP7.LastIndexOf(',')
            # Remove from commaPos to close2+1
            $c = $c.Substring(0, $commaPos) + $c.Substring($close2 + 1)
            Write-Host "Removed first of duplicate at $p7pos"
            $found = $true
            break
        }
        $idx = $p7pos + 1
    }
    if (-not $found) { Write-Host "ERROR: could not find duplicate" }
}

$p7count = ([regex]::Matches($c, '"productId":  7,')).Count
Write-Host "productId 7 total: $p7count (expect 12)"

try {
    $null = $c | ConvertFrom-Json
    Write-Host "JSON VALID"
} catch {
    Write-Host "JSON INVALID: $_"
}

[System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
$lines = ($c -split "`n").Count
Write-Host "Lines: $lines"
