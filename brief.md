# LAWN CARE PROJECT BRIEF
Last Updated: 30 May 2026

---

## 1. PROJECT OVERVIEW
Three-tool interactive lawn care system hosted on GitHub Pages. All three pages are live and fully interconnected.

URLs:
- Landing page:  https://cjj-gmail.github.io/lawn-care-tools/
- Tracker:       https://cjj-gmail.github.io/lawn-care-tools/tracker.html
- Dashboard:     https://cjj-gmail.github.io/lawn-care-tools/dashboard.html


## 2. GOOGLE DRIVE REFERENCES
- Lawn Care Folder ID:   1cRWixwn9_B60mct06CdZWb-WpAKnduJd
- My Lawn Care Sheet ID: 1xFGTMYh0gxYQb78YTUVs2BwW8jb2znZxbq9Ed3Z_6xE
- Project Brief (archived): Google Drive doc -- superseded by this file (brief.md in GitHub repo)


## 3. GITHUB & HOSTING
- Repo:       https://github.com/cjj-gmail/lawn-care-tools
- Pages URL:  https://cjj-gmail.github.io/lawn-care-tools
- Username:   cjj-gmail
- Deployment: Manual upload OR via git CLI (see Section 17)

Repo Structure:
```
lawn-care-tools/
|-- brief.md               -> Project Brief (THIS FILE -- canonical source)
|-- index.html             -> Landing page (LIVE)
|-- tracker.html           -> Tool 1 (LIVE)
|-- dashboard.html         -> Tool 2 (LIVE)
|-- sheets-auth-test.html
|-- github-auth-test.html
|-- auth-success.html
|-- data/
    |-- program.json       -> 12-month custom program (v2.1 -- updated 30 May 2026)
    |-- inventory.json     -> 21 products, 4 zones, 6 compat rules
    |-- completions.json   -> Task completions (created on first save)
    |-- applications.json  -> Application log
    |-- mowing.json        -> Mowing log
    |-- watering.json      -> Watering log
    |-- weather.json       -> Weather/observations journal
    |-- connection-test.json
```


## 4. AUTHENTICATION & INFRASTRUCTURE

GitHub OAuth (primary -- all writes from tools):
- Client ID: Ov23linHLsAnUT81yTeY
- Cloudflare Worker: https://lawn-care-tools.cameronjude1.workers.dev
- Endpoints: /login, /callback, /verify
- Token stored in sessionStorage (cleared on tab close)
- Status: WORKING

Google OAuth (secondary -- dormant):
- Client ID: 416766323294-e1cpni5440aio0pjgqr2cd6gjn0lvori.apps.googleusercontent.com
- Status: Working but not used by any live tool

Desktop Commander MCP:
- Status: INSTALLED and connected to Claude
- Enables Claude to run commands on local machine
- Use for git operations (see Section 17)


## 5. LAWN SPECS
Total Area: 140.15 m2

| Zone                 | Grass   | Area      | Zone ID |
|----------------------|---------|-----------|---------|
| Back Lawn            | Kikuyu  | 68.2 m2   | back    |
| Front Lawn           | Zoysia  | 35.0 m2   | front   |
| Front Nature Strip   | Couch   | 20.8 m2   | strip1  |
| Front Left Strip     | Couch   | 16.15 m2  | strip2  |

Total Couch: 36.95 m2
Location: Oakhurst NSW 2761 -- Humid subtropical, hot summers, mild winters, occasional frost.


## 6. PRODUCT INVENTORY (21 products -- 30 May 2026)

| Product                | Brand                  | Unit | Remaining |
|------------------------|------------------------|------|-----------|
| TX10 (5-2-8)           | Terralift              | kg   | 19.25     |
| Maintain (26-1-9)      | LawnPride              | kg   | 18        |
| Liquid Iron (7%)       | Plant Doctor           | L    | 0.86      |
| Nature's Soil Wetter   | Plant Doctor           | L    | 3.75      |
| Tombstone Duo          | Indigo                 | L    | 0.44      |
| Heritage Maxx          | Syngenta               | L    | 1         |
| GreenXtra              | LawnPride              | L    | 4.22      |
| Activ8EXTRA            | Plant Doctor           | L    | 3.72      |
| Kelpxtra               | LawnPride              | L    | 3.86      |
| Seaweed Secrets        | Plant Doctor           | L    | 4         |
| Hydramaxx              | LawnPride              | L    | 4         |
| Tracemaxx              | LawnPride              | L    | 3.86      |
| Stimulus               | Fertech (Lawn Addicts) | L    | 1.25      |
| HiCure                 | Syngenta (Lawn Addicts)| L    | 0.54      |
| Spartan                | LawnPride              | L    | 0.5       |
| Bow & Arrow            | Turf Culture           | L    | 0.5       |
| Acelepryn              | Syngenta               | L    | 0.1       |
| Battle Insecticide     | LSA                    | L    | 1         |
| Tribute                | Envu                   | L    | 1         |
| Contra M Duo           | Indigo                 | L    | 1         |
| Stimulizer             | Plant Doctor           | L    | 0.8       |

Notes:
- Quantities reflect post-May Wk1 deduction (GreenXtra, Tracemaxx, HiCure, Liquid Iron updated 30 May 2026)
- HiCure 0.54L remaining -- covers June + August at fortnightly rate, restock before September
- HiCure supply note: LawnPride showing June 2026 lead time -- order via Lawn Addicts instead
- Stimulizer added 30 May 2026: 800mL, 3mL/100m2 rate, ultra-low consumption (~4.2mL per full application)
- Soil wetter preference: LIQUID ONLY -- no granular wetter


## 7. EQUIPMENT

| Machine             | Type            | Height Settings                           |
|---------------------|-----------------|-------------------------------------------|
| Honda HRN216        | Rotary Mower    | 27, 39, 51, 64, 76, 88, 100 mm           |
| Allett Stirling 43  | Cylinder Mower  | 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 mm |
| Ozito PXC           | Cylinder Mower  | 14, 23, 32, 38 mm                        |
| Ryobi 36V           | Scarifier       | -12mm to +8mm                            |


## 8. KEY DECISIONS & PRINCIPLES
- LawnPride PDFs (Zoysia Fine Leaf + Kikuyu) are REFERENCE ONLY for seasonal timing
- Custom program built for all three varieties; Couch follows Kikuyu program
- Use current inventory first; replace with best-of-brand when stock runs out (see Section 15)
- Soil wetter format: LIQUID ONLY -- no granular wetter products
- Application cadence: 2 events per month -- Wk 1 main run + Wk 3 bio run
- Data storage: GitHub JSON files (primary); Google Sheet (secondary/dormant)
- Date format: DD/MM/YYYY throughout
- Always calculate product quantities from actual zone m2 -- not round numbers
- Always provide full file content on updates -- partial updates not allowed
- Project Brief is now brief.md in GitHub repo -- Claude reads/writes it directly

CRITICAL -- tracker.html JS encoding rule:
- ALL characters inside <script> tags must be pure ASCII only
- No Unicode symbols, no em-dashes, no subscript numbers, no checkmarks inside JS strings
- Use HTML entities (&times; &mdash; etc.) in HTML sections, plain ASCII in JS strings
- Violating this causes SyntaxError that prevents the page loading entirely
- This was the root cause of the tracker loading failure fixed 30 May 2026

CRITICAL -- large file push limitation:
- The GitHub MCP push_files tool truncates content above ~50KB
- program.json (~116KB) and tracker.html (~58KB) must be pushed via git CLI or manual drag-and-drop
- inventory.json (~15KB) and brief.md push fine via MCP
- See Section 17 for git CLI setup (RECOMMENDED -- resolves this permanently)


## 9. DATA FILE STRUCTURES

### program.json (v2.1 -- updated 30 May 2026)
12-month program. Month > Week (1 or 3) > Tasks.
Task types: fertilise, biostimulant, herbicide, fungicide, insecticide, soilwetter, renovation.
v2.1 change: Stimulizer (3mL/100m2) added to every bio run Pass 2 task across all 12 months.

### inventory.json (21 products)
Fields: id, name, brand, retailer, category, subCategory, form, unit, qtyRemaining,
ratePer100sqm, rateLow, rateHigh, rateUnit, frequency, applicationMethod, waterIn,
foliarOrIrrigate, staining, grassSafe[], compatibilityNotes, warnings, notes.
Also: zones[], compatibility[] (6 rules).

### completions.json
{ "taskId": { "completedAt": "DD/MM/YYYY", "completedTime": "ISO" } }

### applications.json
Entries newest-first. Written by tracker (task completion) and dashboard (manual log).
{ "entries": [{ "id", "date", "dateISO", "taskId", "taskLabel", "taskType", "zones[]", "products[]", "inventoryDeducted" }] }

### mowing.json
{ "entries": [{ "id", "date", "dateISO", "zone", "zoneName", "grass", "mower", "heightMm", "notes" }] }

### watering.json
{ "entries": [{ "id", "date", "dateISO", "zones[]", "zoneNames", "method", "durationMin", "amountL", "notes" }] }

### weather.json
{ "entries": [{ "id", "date", "dateISO", "type", "note" }] }


## 10. TOOL 1 -- TRACKER -- tracker.html (LIVE)

Header: Connect GitHub | Log water | Log mow | Dashboard link

CHECKBOX BEHAVIOUR:
1. Tick -> saves completions.json -> deduction modal
2. Deduction modal: Cancel (uncheck), Skip deduction, Deduct from inventory
3. Tick completed -> uncheck warning modal

MOWING HEIGHT REFERENCE CARD:
- Collapsible panel below month title
- Current season column highlighted green

KNOWN ISSUE HISTORY:
- 30 May 2026: SyntaxError fixed -- root cause was Unicode chars in JS (see Section 8 critical rule)
- Tracker now loading and rendering correctly
- May Wk1 task completed and deduction verified working


## 11. TOOL 2 -- DASHBOARD -- dashboard.html (LIVE)

Supports: ?tab=overview|program|inventory|log|alerts|zones
- Overview: stat tiles, progress bars, weather journal
- Program: 12 month tiles -> tracker, filterable task table
- Inventory: product cards, stock bars, resupply modal
- Log: watering + mowing + applications + CSV export
- Alerts: overdue mowing/watering, low inventory, compatibility rules
- Zones: zone cards + compatibility rules

NOTE: Dashboard was built against v1.0 program schema (weeks 1-4). With v2.0/2.1 (Wk1+Wk3 only),
the Program tab task table should still work but needs verification in next session.


## 12. CURRENT STATUS (30 May 2026)

[DONE] brief.md -- canonical project brief in GitHub repo
[DONE] index.html -- landing page live
[DONE] tracker.html -- LIVE, loading correctly, deductions working
[DONE] dashboard.html -- 6 tabs live
[DONE] program.json -- v2.1 (Stimulizer added to all 12 bio run Pass 2 tasks)
[DONE] inventory.json -- 21 products, quantities current as of 30 May 2026
[DONE] applications.json -- May Wk1 task logged (first real application entry)
[DONE] mowing.json -- created on first mow save
[DONE] watering.json -- created on first water save
[DONE] weather.json -- created on first dashboard save

NEXT TASKS (new session):
- Set up git CLI on local machine (see Section 17) -- resolves large file push limitation
- Verify dashboard Program tab renders v2.0/2.1 program correctly
- Check HiCure stock before June Wk1 -- order via Lawn Addicts if needed
- Consider conditional task visual treatment in tracker


## 13. NEXT SESSION INSTRUCTIONS

Start every session by reading brief.md from the GitHub repo:
  owner=cjj-gmail, repo=lawn-care-tools, path=brief.md

End every session by updating brief.md with any changes made.

For large file edits (program.json, tracker.html):
- Use git CLI via Desktop Commander (see Section 17) -- PREFERRED
- Or download file, edit locally, drag-and-drop to GitHub -- FALLBACK
- Do NOT use push_files for files >50KB -- it will truncate silently


## 14. PROGRAM REBUILD -- COMPLETE (v2.1 as of 30 May 2026)

Key changes from v1 to v2.0:
- 4 weekly events -> 2 events per month (Wk1 main run + Wk3 bio run)
- HiCure added to every main tank-mix
- Spartan: March + September only
- Acelepryn: September, back lawn only
- Heritage Maxx: November, February, December (conditional)
- Tribute: zone-locked to Zoysia + Couch -- back lawn excluded
- Battle Insecticide: conditional in Dec, Jan, Feb
- Renovation: September Wk3, Kikuyu + Couch only
- Zoysia front: TX10 only for granular (not Maintain)

v2.1 change (30 May 2026):
- Stimulizer (Plant Doctor) added to every bio run Pass 2 task
- 3mL/100m2 rate -- quantities: back 2.046mL, front 1.05mL, strip1 0.624mL, strip2 0.484mL
- Total per application: 4.204mL -- 800mL stock lasts ~190 applications

### Tank-mix rules
- Main tank-mix (Wk1): GreenXtra + Tracemaxx + HiCure always together
- Liquid Iron joins at reduced Tracemaxx rate (100ml/100m2) -- winter/transition months
- Heritage Maxx per label (NOT via backpack sprayer) -- Nov, Feb, Dec conditional
- Soil wetter added to main tank-mix in summer months (Dec, Jan, Feb)
- Bio run Pass 2 (Wk3): soil wetter + Activ8EXTRA + Stimulus (most months) + Stimulizer (every month)
- Kelpxtra: ALWAYS SOLO Pass 1 -- never in any tank-mix
- Iron overload: Tracemaxx always at 100ml/100m2 when GreenXtra at 200ml/100m2

### Zone rules
- Couch (strip1 + strip2) always follows Kikuyu tasks
- Zoysia (front) gets TX10 only for granular -- not Maintain
- Tribute: Zoysia + Couch ONLY -- NEVER back lawn (Kikuyu)
- Tombstone Duo / Contra M Duo: Kikuyu + Couch ONLY -- NEVER Zoysia
- Acelepryn 0.1L -- back lawn only in September
- Heritage Maxx 1L -- Nov, Dec/Jan, Feb
- Spartan 0.5L -- March + September (2 full applications)

### Month summary
| Month | Season | Wk1 | Wk3 |
|-------|--------|-----|-----|
| Jan | Summer | Maintain+TX10, NatWetter+GX+Tmx+HiCure+LiqIron | Kelpxtra, NatWetter+A8+Stim+Stiz, Battle cond |
| Feb | Summer | Maintain+TX10, NatWetter+GX+Tmx+HiCure+HeritMaxx | Kelpxtra, NatWetter+A8+Stim+Stiz, Battle cond |
| Mar | Autumn | Spartan, Maintain+TX10, GX+Tmx+HiCure | Kelpxtra, NatWetter+A8+Stim+Stiz |
| Apr | Autumn | GX+Tmx+HiCure, B&A cond | Kelpxtra, Hydra+A8+Stiz |
| May | Autumn | GX+Tmx+HiCure+LiqIron | Kelpxtra, NatWetter+A8+Stim+Stiz |
| Jun | Winter | GX+Tmx+HiCure+LiqIron | Kelpxtra, Hydra+A8+Stiz |
| Jul | Winter | GX+Tmx+HiCure | Kelpxtra, Hydra+A8+Stiz, Tribute+B&A cond |
| Aug | Winter | GX+Tmx+HiCure+LiqIron | Kelpxtra, Hydra+A8+Stim+Stiz, light granular |
| Sep | Spring | Spartan, Acelepryn(back), Maintain+TX10, GX+Tmx+HiCure | Reno, soil wetter, Kelpxtra, NatWetter+A8+Stim+Stiz |
| Oct | Spring | Maintain+TX10, GX+Tmx+HiCure, B&A cond | Kelpxtra, Hydra+A8+Stim+Stiz |
| Nov | Spring | Maintain+TX10, GX+Tmx+HiCure+HeritMaxx | Kelpxtra, Hydra+A8+Stim+Stiz, Tribute cond |
| Dec | Summer | Maintain+TX10, NatWetter+GX+Tmx+HiCure, HeritMaxx cond | Kelpxtra, NatWetter+A8+Stim+Stiz, Battle cond |

Key: GX=GreenXtra, Tmx=Tracemaxx, A8=Activ8EXTRA, Stim=Stimulus, Stiz=Stimulizer, Hydra=Hydramaxx, NatWetter=Nature's Soil Wetter, B&A=Bow & Arrow, LiqIron=Liquid Iron, HeritMaxx=Heritage Maxx


## 15. BRAND COMPARISON & TRANSITION PLAN

### Transition plan (when current stock runs out)
| Current product      | Replace with                            | Brand        |
|----------------------|-----------------------------------------|--------------|
| TX10 (5-2-8)         | TX10 (same)                             | Terralift    |
| Maintain (26-1-9)    | 2Spec Elevate (spring) / Endurance (aut)| Lawn Addicts |
| Liquid Iron 7%       | Liquid Iron 7% (hold -- strong product) | Plant Doctor |
| Nature's Soil Wetter | Hydrolink Advance                       | Lawn Addicts |
| Hydramaxx (liquid)   | Hydrolink Advance                       | Lawn Addicts |
| GreenXtra            | Fertech Special FeX                     | Lawn Addicts |
| Tracemaxx            | Fertech Fusion                          | Lawn Addicts |
| Kelpxtra             | Fertech Kelpro                          | Lawn Addicts |
| Activ8EXTRA          | Fertech Bio                             | Lawn Addicts |
| Seaweed Secrets      | Fertech Kelpro / Fertech Bio            | Lawn Addicts |
| Stimulus             | Fertech Stimulus (same)                 | Lawn Addicts |
| HiCure               | HiCure (same) -- order Lawn Addicts     | Lawn Addicts |
| Stimulizer           | Stimulizer (same)                       | Plant Doctor |
| Pesticides           | Same actives, best price                | Shop around  |


## 16. BIOSTIMULANT NOTES (added 30 May 2026)

### HiCure (Syngenta via Lawn Addicts)
- 62.5% w/w amino acids -- 19 amino acids including L-Proline and L-Glycine
- Applied every Wk1 main run at 150mL/100m2
- Can reduce to every 6 weeks in winter (skip July) to stretch 0.54L remaining
- No cheaper like-for-like substitute exists
- Fusion+HiCure bundle at Lawn Addicts ($165) is best value when restocking
- LawnPride showing June 2026 lead time -- order via Lawn Addicts

### Stimulizer (Plant Doctor)
- Super concentrated fulvic acid + 75+ minerals + 13 vitamins + 18 amino acids + 12 botanical extracts
- Rate: 3mL/100m2 (fortnightly) -- 800mL stock lasts ~190 applications
- Added to every bio run Pass 2 tank-mix in program v2.1
- Natural chelating agent -- enhances uptake of all other products in tank
- Supports stomatal conductance and photosynthesis even in cloud cover / heat
- Compatible with acidic and alkaline materials
- Does NOT replace HiCure -- different mechanism (chelation vs amino acid stress defence)
- Does NOT replace TX10 -- TX10 is a granular fertiliser, Stimulizer is a liquid biostimulant

### Products researched but not added
- FloraTech Rejuvenate: overlaps with existing Kelpxtra + Activ8EXTRA + HiCure -- skip
- FloraTech Stimulate: live microbial inoculant (12M CFU/mL) -- interesting gap filler
  but Stimulizer covers similar ground via chemical pathway. Revisit if soil biology issues emerge.


## 17. GIT CLI SETUP -- RESOLVED (30 May 2026)

The GitHub MCP push_files tool truncates files above ~50KB. program.json (~116KB) and
tracker.html (~58KB) cannot be reliably pushed via MCP. Git CLI via Desktop Commander
solves this permanently. CONFIRMED WORKING 30 May 2026.

### Local repo path
C:\Users\camer\lawn-care-tools

IMPORTANT: Do NOT use a Google Drive path for the local repo. GDrive virtual filesystem
swallows git stdout silently. Always use a plain local NTFS path.

### How Claude runs git (via Desktop Commander)
Git is not in Desktop Commander's PowerShell PATH. Use the batch file wrapper:
  C:\Users\camer\AppData\Local\Temp\gitrun.bat

The batch file content (recreate with write_file if missing after reboot):
  @echo off
  cd /d C:\Users\camer\lawn-care-tools
  C:\PROGRA~1\Git\bin\git.exe %* > C:\Users\camer\AppData\Local\Temp\gitout.txt 2>&1
  type C:\Users\camer\AppData\Local\Temp\gitout.txt

Always call with shell: cmd, e.g.:
  C:\Users\camer\AppData\Local\Temp\gitrun.bat status
  C:\Users\camer\AppData\Local\Temp\gitrun.bat log --oneline -5
  C:\Users\camer\AppData\Local\Temp\gitrun.bat add -A
  C:\Users\camer\AppData\Local\Temp\gitrun.bat commit -m "message"
  C:\Users\camer\AppData\Local\Temp\gitrun.bat push

### Standard workflow for large file edits (program.json, tracker.html, dashboard.html)
1. Desktop Commander read_file -- read current file from local repo
2. Desktop Commander edit_block or write_file -- make changes locally
3. gitrun.bat add -A
4. gitrun.bat commit -m "description"
5. gitrun.bat push
6. Verify at https://github.com/cjj-gmail/lawn-care-tools

### Small files (inventory.json, brief.md, completions.json etc.)
Can still be pushed via GitHub MCP push_files -- no change needed.
