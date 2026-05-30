$c = Get-Content 'C:\Users\camer\lawn-care-tools\data\program.json' -Raw

# For each pass2 task, count productId 7 entries
$ids = @('jan-w3-t2','feb-w3-t2','mar-w3-t2','apr-w3-t2','may-w3-t2','jun-w3-t2','jul-w3-t2','aug-w3-t2','sep-w3-t4','oct-w3-t2','nov-w3-t2','dec-w3-t2')
foreach ($id in $ids) {
    $pos = $c.IndexOf("`"id`":  `"$id`"")
    if ($pos -lt 0) { Write-Host "$id NOT FOUND"; continue }
    $beforePos = $c.Substring(0, $pos)
    $taskStart = $beforePos.LastIndexOf('"taskType":')
    $taskRegion = $c.Substring($taskStart, $pos - $taskStart + 50)
    $p7count = ([regex]::Matches($taskRegion, '"productId":  7,')).Count
    Write-Host "$id -> productId 7 count: $p7count"
}
