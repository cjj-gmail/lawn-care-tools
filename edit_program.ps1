$f = 'C:\Users\camer\lawn-care-tools\data\program.json'
$c = Get-Content $f -Raw -Encoding UTF8

# ---------------------------------------------------------------
# SEAWEED SECRETS block (inserted after Activ8EXTRA, before Stimulus or Stimulizer)
# ---------------------------------------------------------------
$ssBlock = @'
,
                                                                            {
                                                                                "productId":  7,
                                                                                "name":  "Seaweed Secrets",
                                                                                "ratePer100sqm":  100,
                                                                                "rateUnit":  "mL",
                                                                                "note":  "100mL/100sqm -- cold-processed kelp + humic/fulvic acid. Using up existing 4L stock.",
                                                                                "quantities":  {
                                                                                                   "back":  68.2,
                                                                                                   "front":  35.0,
                                                                                                   "strip1":  20.8,
                                                                                                   "strip2":  16.15
                                                                                               }
                                                                            }
'@

# ---------------------------------------------------------------
# PHOSFIGHTER task block (template — ID replaced per month)
# ---------------------------------------------------------------
$phosTpl = @'
,
                                                       {
                                                           "taskType":  "biostimulant",
                                                           "label":  "Phosfighter -- disease resistance / SAR (NOT YET IN STOCK)",
                                                           "products":  [
                                                                            {
                                                                                "productId":  22,
                                                                                "name":  "Phosfighter",
                                                                                "ratePer100sqm":  200,
                                                                                "rateUnit":  "mL",
                                                                                "note":  "200mL/100sqm per LA reference program. Apply to all zones.",
                                                                                "quantities":  {
                                                                                                   "back":  136.4,
                                                                                                   "front":  70.0,
                                                                                                   "strip1":  41.6,
                                                                                                   "strip2":  32.3
                                                                                               }
                                                                            }
                                                                        ],
                                                           "applicationMethod":  "Backpack or handheld sprayer",
                                                           "waterIn":  false,
                                                           "foliarOrIrrigate":  "Foliar",
                                                           "zones":  [
                                                                         "back",
                                                                         "front",
                                                                         "strip1",
                                                                         "strip2"
                                                                     ],
                                                           "notes":  "Phosphite SAR trigger. Mix into Pass 2 tank-mix with Activ8EXTRA + Seaweed Secrets + Stimulizer once in stock. Complementary to Heritage Maxx -- different mode of action.",
                                                           "cautions":  [
                                                                            "purchase-required"
                                                                        ],
                                                           "conditional":  true,
                                                           "condition":  "NOT YET IN STOCK -- activate once Phosfighter purchased from Lawn Addicts",
                                                           "id":  "PHOSID"
                                                       }
'@

# ---------------------------------------------------------------
# Helper: insert Seaweed Secrets after Activ8EXTRA block in a Pass2 task
# identified by its task ID anchor
# ---------------------------------------------------------------
function InsertSSAfterActiv8 {
    param($content, $taskId, $hasStimulusBeforeStimulizer)
    # Find the Activ8EXTRA block ending just before the next productId
    # Strategy: find the closing brace of Activ8EXTRA entry that precedes Stimulus or Stimulizer
    # We anchor on the task id to pick the right one
    # We look for the pattern: Activ8EXTRA quantities block closing, then the next product
    # Insert ssBlock after the Activ8EXTRA closing brace (before the comma+next product)
    
    # Pattern: end of Activ8EXTRA entry is:
    #   "strip2":  16.15
    #                                                                               }
    #                                                                            }
    # followed by a comma and then productId 9 (Stimulus) or productId 21 (Stimulizer)
    # We need to be specific to this task id context
    
    # Find position of taskId in content
    $idPos = $content.IndexOf("`"id`":  `"$taskId`"")
    if ($idPos -lt 0) {
        Write-Host "ERROR: taskId $taskId not found"
        return $content
    }
    
    # Work backwards from idPos to find the Pass2 products array
    # Find the last occurrence of Activ8EXTRA before idPos
    $searchRegion = $content.Substring(0, $idPos)
    $a8pos = $searchRegion.LastIndexOf('"name":  "Activ8EXTRA"')
    if ($a8pos -lt 0) {
        Write-Host "ERROR: Activ8EXTRA not found before $taskId"
        return $content
    }
    
    # From a8pos, find the closing of the Activ8EXTRA product entry
    # It ends with:  strip2":  16.15\r\n ... }\r\n ... }
    # We need to find the second closing brace after strip2 value
    $afterA8 = $content.Substring($a8pos)
    # Find "strip2":  16.15 in afterA8
    $strip2pos = $afterA8.IndexOf('"strip2":  16.15')
    if ($strip2pos -lt 0) {
        Write-Host "ERROR: strip2 not found after Activ8EXTRA in $taskId"
        return $content
    }
    # After strip2 value, find the two closing braces
    $afterStrip2 = $afterA8.Substring($strip2pos)
    # Pattern is: 16.15\r\n ... }\r\n ... }
    $close1 = $afterStrip2.IndexOf('}')  # closes quantities
    $close2 = $afterStrip2.IndexOf('}', $close1 + 1)  # closes product entry
    
    $insertPos = $a8pos + $strip2pos + $close2 + 1
    
    # Insert ssBlock at insertPos
    $newContent = $content.Substring(0, $insertPos) + $ssBlock + $content.Substring($insertPos)
    return $newContent
}

# ---------------------------------------------------------------
# Helper: update the label for a given Pass2 task
# ---------------------------------------------------------------
function UpdatePass2Label {
    param($content, $taskId, $newLabel)
    # Find the task label that precedes the taskId
    $idPos = $content.IndexOf("`"id`":  `"$taskId`"")
    if ($idPos -lt 0) { Write-Host "ERROR: $taskId not found for label update"; return $content }
    $region = $content.Substring(0, $idPos)
    # Find the last "label" before idPos
    $lblPos = $region.LastIndexOf('"label":')
    if ($lblPos -lt 0) { Write-Host "ERROR: label not found before $taskId"; return $content }
    # Find end of label value (closing quote after content)
    $lblStart = $content.IndexOf('"', $lblPos + 9)  # skip "label":  
    $lblEnd = $content.IndexOf('"', $lblStart + 1)
    # Handle escaped quotes - find actual end
    while ($lblEnd -gt 0 -and $content[$lblEnd - 1] -eq '\') {
        $lblEnd = $content.IndexOf('"', $lblEnd + 1)
    }
    $newContent = $content.Substring(0, $lblStart + 1) + $newLabel + $content.Substring($lblEnd)
    return $newContent
}

# ---------------------------------------------------------------
# Helper: insert Phosfighter task after a given Pass2 task
# ---------------------------------------------------------------
function InsertPhosfighter {
    param($content, $afterTaskId, $phosId)
    # Find the closing of the afterTaskId task
    $idPos = $content.IndexOf("`"id`":  `"$afterTaskId`"")
    if ($idPos -lt 0) { Write-Host "ERROR: $afterTaskId not found for phosfighter insert"; return $content }
    # After the id value, find the closing brace of the task object
    $afterId = $content.Substring($idPos)
    $closePos = $afterId.IndexOf('}')
    $insertPos = $idPos + $closePos + 1
    
    $phosTask = $phosTpl.Replace('PHOSID', $phosId)
    $newContent = $content.Substring(0, $insertPos) + $phosTask + $content.Substring($insertPos)
    return $newContent
}

# ---------------------------------------------------------------
# MONTHS WITH Stimulus in Pass2 (has Stimulus before Stimulizer):
# jan, feb, mar, may, aug, sep, oct, nov, dec
# MONTHS WITHOUT Stimulus: apr, jun, jul
# ---------------------------------------------------------------

# Jan - has Stimulus
$c = InsertSSAfterActiv8 $c 'jan-w3-t2' $true
$c = UpdatePass2Label $c 'jan-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

# Feb - has Stimulus
$c = InsertSSAfterActiv8 $c 'feb-w3-t2' $true
$c = UpdatePass2Label $c 'feb-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

# Mar - has Stimulus
$c = InsertSSAfterActiv8 $c 'mar-w3-t2' $true
$c = UpdatePass2Label $c 'mar-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

# Apr - NO Stimulus (Hydramaxx wetter, Activ8EXTRA, Stimulizer)
$c = InsertSSAfterActiv8 $c 'apr-w3-t2' $false
$c = UpdatePass2Label $c 'apr-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulizer'

# May - has Stimulus
$c = InsertSSAfterActiv8 $c 'may-w3-t2' $true
$c = UpdatePass2Label $c 'may-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

# Jun - NO Stimulus
$c = InsertSSAfterActiv8 $c 'jun-w3-t2' $false
$c = UpdatePass2Label $c 'jun-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulizer'

# Jul - NO Stimulus
$c = InsertSSAfterActiv8 $c 'jul-w3-t2' $false
$c = UpdatePass2Label $c 'jul-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulizer'

# Aug - has Stimulus
$c = InsertSSAfterActiv8 $c 'aug-w3-t2' $true
$c = UpdatePass2Label $c 'aug-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

# Sep - has Stimulus (task is sep-w3-t4)
$c = InsertSSAfterActiv8 $c 'sep-w3-t4' $true
$c = UpdatePass2Label $c 'sep-w3-t4' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

# Oct - has Stimulus
$c = InsertSSAfterActiv8 $c 'oct-w3-t2' $true
$c = UpdatePass2Label $c 'oct-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

# Nov - has Stimulus
$c = InsertSSAfterActiv8 $c 'nov-w3-t2' $true
$c = UpdatePass2Label $c 'nov-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

# Dec - has Stimulus
$c = InsertSSAfterActiv8 $c 'dec-w3-t2' $true
$c = UpdatePass2Label $c 'dec-w3-t2' 'Bio run Pass 2: soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus + Stimulizer'

Write-Host "Seaweed Secrets insertions done"

# ---------------------------------------------------------------
# CHANGE C: Remove August Wk3 granular task (aug-w3-t3)
# The task starts after aug-w3-t2 closing and ends at aug-w3-t3 id closing brace
# ---------------------------------------------------------------
# Find aug-w3-t3 task — it's a fertilise task with "Light granular wake-up"
# We need to remove: ,\r\n ... { ... "id": "aug-w3-t3" ... }
$aug3id = '"id":  "aug-w3-t3"'
$aug3pos = $c.IndexOf($aug3id)
if ($aug3pos -lt 0) { Write-Host "ERROR: aug-w3-t3 not found" } else {
    # Find the closing brace of this task
    $afterAug3 = $c.Substring($aug3pos)
    $closeAug3 = $afterAug3.IndexOf('}')
    $taskEndPos = $aug3pos + $closeAug3 + 1
    
    # Find the start of this task — go backwards from aug3pos to find the preceding comma + {
    # The task begins with a comma after the previous task's closing brace
    # Find the last { before aug3pos that starts the task
    $beforeAug3 = $c.Substring(0, $aug3pos)
    # Find the last "taskType" before aug3pos
    $taskTypePos = $beforeAug3.LastIndexOf('"taskType":  "fertilise"')
    if ($taskTypePos -lt 0) { Write-Host "ERROR: taskType not found before aug-w3-t3" } else {
        # Go back further to find the opening { and preceding comma
        $beforeTaskType = $c.Substring(0, $taskTypePos)
        $openBrace = $beforeTaskType.LastIndexOf('{')
        # Go back to find the comma before this {
        $beforeOpen = $c.Substring(0, $openBrace)
        $commaPos = $beforeOpen.LastIndexOf(',')
        # Remove from commaPos to taskEndPos
        $c = $c.Substring(0, $commaPos) + $c.Substring($taskEndPos)
        Write-Host "aug-w3-t3 removed"
    }
}

# ---------------------------------------------------------------
# CHANGE D: Insert Phosfighter task after Pass2 in applicable months
# Months: Jan, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
# Pass2 task IDs: jan-w3-t2, may-w3-t2, jun-w3-t2, jul-w3-t2, aug-w3-t2, sep-w3-t4, oct-w3-t2, nov-w3-t2, dec-w3-t2
# ---------------------------------------------------------------
# NOTE: After SS insertion, aug-w3-t3 was removed, so aug Pass2 is still aug-w3-t2
# But we need to insert phosfighter AFTER the last bio/biostimulant Pass2 task in each month's Wk3

# For jan: insert after jan-w3-t2 (but jan also has jan-w3-t3 battle insecticide after it)
# Instructions say "appended after the Pass 2 task" — so after jan-w3-t2
$c = InsertPhosfighter $c 'jan-w3-t2' 'jan-w3-phosfighter'
Write-Host "jan phosfighter inserted"

$c = InsertPhosfighter $c 'may-w3-t2' 'may-w3-phosfighter'
Write-Host "may phosfighter inserted"

$c = InsertPhosfighter $c 'jun-w3-t2' 'jun-w3-phosfighter'
Write-Host "jun phosfighter inserted"

$c = InsertPhosfighter $c 'jul-w3-t2' 'jul-w3-phosfighter'
Write-Host "jul phosfighter inserted"

$c = InsertPhosfighter $c 'aug-w3-t2' 'aug-w3-phosfighter'
Write-Host "aug phosfighter inserted"

$c = InsertPhosfighter $c 'sep-w3-t4' 'sep-w3-phosfighter'
Write-Host "sep phosfighter inserted"

$c = InsertPhosfighter $c 'oct-w3-t2' 'oct-w3-phosfighter'
Write-Host "oct phosfighter inserted"

$c = InsertPhosfighter $c 'nov-w3-t2' 'nov-w3-phosfighter'
Write-Host "nov phosfighter inserted"

$c = InsertPhosfighter $c 'dec-w3-t2' 'dec-w3-phosfighter'
Write-Host "dec phosfighter inserted"

# Write output
[System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
Write-Host "File written"
$lines = (Get-Content $f).Count
Write-Host "Line count: $lines"
