# LAWN CARE PROJECT BRIEF
Last Updated: 30 May 2026

---

## 1. PROJECT OVERVIEW
Three-tool interactive lawn care system hosted on GitHub Pages. All three pages are live and fully interconnected.

URLs:
- Landing page:  https://cjj-gmail.github.io/lawn-care-tools/
- Tracker:       https://cjj-gmail.github.io/lawn-care-tools/tracker.html
- Dashboard:     https://cjj-gmail.github.io/lawn-care-tools/dashboard.html

Navigation:
- index -> tracker + dashboard (tool cards + quick links row)
- tracker header: Connect GitHub, Log water, Log mow, -> Dashboard
- dashboard header: -> Tracker, Home
- Quick links on index: This month's tasks, Dashboard overview, Inventory, Application log, Alerts, Program, Zones


## 2. GOOGLE DRIVE REFERENCES
- Lawn Care Folder ID:   1cRWixwn9_B60mct06CdZWb-WpAKnduJd
- My Lawn Care Sheet ID: 1xFGTMYh0gxYQb78YTUVs2BwW8jb2znZxbq9Ed3Z_6xE
- Project Brief (archived): Google Drive doc -- superseded by this file (brief.md in GitHub repo)


## 3. GITHUB & HOSTING
- Repo:       https://github.com/cjj-gmail/lawn-care-tools
- Pages URL:  https://cjj-gmail.github.io/lawn-care-tools
- Username:   cjj-gmail
- Deployment: Manual upload (drag and drop to GitHub)

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
    |-- program.json       -> 12-month custom program (v2.0 -- rebuilt 25 May 2026)
    |-- inventory.json     -> 21 products, 4 zones, 6 compat rules
    |-- completions.json   -> Task completions (created on first save)
    |-- applications.json  -> Application log (created on first task complete)
    |-- mowing.json        -> Mowing log (created on first mow save)
    |-- watering.json      -> Watering log (created on first water save)
    |-- weather.json       -> Weather/observations journal
    |-- connection-test.json
```


## 4. AUTHENTICATION & INFRASTRUCTURE

GitHub OAuth (primary -- all writes):
- Client ID: Ov23linHLsAnUT81yTeY
- Cloudflare Worker: https://lawn-care-tools.cameronjude1.workers.dev
- Endpoints: /login, /callback, /verify
- Token stored in sessionStorage (cleared on tab close)
- Status: WORKING
- Used by: tracker.html (completions, app log, mow log, water log) + dashboard.html (inventory, manual app log, weather log)

Google OAuth (secondary -- dormant):
- Client ID: 416766323294-e1cpni5440aio0pjgqr2cd6gjn0lvori.apps.googleusercontent.com
- Google Cloud Project: lawn-care-tools
- Status: Working but not used by any live tool
- Originally for Google Sheets access -- superseded by GitHub JSON storage

Note: The canonical brief is now brief.md in this repo. Claude reads and writes it directly via GitHub API.


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


## 6. PRODUCT INVENTORY (21 products -- May 2026)

| Product                | Brand                  | Unit | Remaining |
|------------------------|------------------------|------|-----------|
| TX10 (5-2-8)           | Terralift              | kg   | 19.25     |
| Maintain (26-1-9)      | LawnPride              | kg   | 18        |
| Liquid Iron (7%)       | Plant Doctor           | L    | 1         |
| Nature's Soil Wetter   | Plant Doctor           | L    | 3.75      |
| Tombstone Duo          | Indigo                 | L    | 0.44      |
| Heritage Maxx          | Syngenta               | L    | 1         |
| GreenXtra              | LawnPride              | L    | 4         |
| Activ8EXTRA            | Plant Doctor           | L    | 3.72      |
| Kelpxtra               | LawnPride              | L    | 3.86      |
| Seaweed Secrets        | Plant Doctor           | L    | 4         |
| Hydramaxx              | LawnPride              | L    | 4         |
| Tracemaxx              | LawnPride              | L    | 4         |
| Stimulus               | Fertech (Lawn Addicts) | L    | 1.25      |
| HiCure                 | Syngenta (Lawn Addicts)| L    | 0.75      |
| Spartan                | LawnPride              | L    | 0.5       |
| Bow & Arrow            | Turf Culture           | L    | 0.5       |
| Acelepryn              | Syngenta               | L    | 0.1       |
| Battle Insecticide     | LSA                    | L    | 1         |
| Tribute                | Envu                   | L    | 1         |
| Contra M Duo           | Indigo                 | L    | 1         |
| Tombstone Duo (dup)    | Indigo                 | L    | 0.44      |

Notes:
- 21 products in inventory.json (Tombstone Duo appears twice with different safety notes -- Kikuyu/Couch only)
- HiCure confirmed 750mL remaining (0.75L) -- updated 30 May 2026
- Soil wetter preference: LIQUID ONLY -- no granular wetter
- Stimulus is Fertech brand sold via Lawn Addicts
- TX10 is Terralift brand -- specialist greens-grade organic


## 7. EQUIPMENT

| Machine             | Type            | Height Settings                         |
|---------------------|-----------------|-----------------------------------------|
| Honda HRN216        | Rotary Mower    | 27, 39, 51, 64, 76, 88, 100 mm         |
| Allett Stirling 43  | Cylinder Mower  | 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 mm |
| Ozito PXC           | Cylinder Mower  | 14, 23, 32, 38 mm                      |
| Ryobi 36V           | Scarifier       | -12mm to +8mm                          |


## 8. KEY DECISIONS & PRINCIPLES
- LawnPride PDFs (Zoysia Fine Leaf + Kikuyu) are REFERENCE ONLY for seasonal timing
- Lawn Addicts free plans (Kikuyu, Couch, Zoysia) are ADDITIONAL reference
- Custom program built for all three varieties; Couch follows Kikuyu program
- Use current inventory first; replace with best-of-brand when stock runs out (see Section 15)
- Soil wetter format: LIQUID ONLY -- no granular wetter products
- Application cadence: 2 events per month -- Wk 1 main run + Wk 3 bio run
- Data storage: GitHub JSON files (primary); Google Sheet (secondary/dormant)
- Date format: DD/MM/YYYY throughout
- Always calculate product quantities from actual zone m2 -- not round numbers
- Always provide full file content on updates -- partial updates not allowed
- Project Brief is now brief.md in GitHub repo -- Claude reads/writes it directly
- tracker.html JS must use PURE ASCII ONLY -- no Unicode chars inside script tags
  (GitHub API push corrupts multi-byte chars causing SyntaxError on load)
  Use HTML entities in HTML sections, plain ASCII in JS strings.


## 9. DATA FILE STRUCTURES

### program.json (v2.0 -- rebuilt 25 May 2026)
12-month program. Month > Week (1 or 3) > Tasks.
Task types: fertilise, biostimulant, herbicide, fungicide, insecticide, soilwetter, renovation.
New in v2.0: HiCure in every main tank-mix, full herbicide/insecticide/fungicide pillars, 2-event cadence.

### inventory.json (21 products)
Fields: id, name, brand, retailer, category, subCategory, form, unit, qtyRemaining,
ratePer100sqm, rateLow, rateHigh, rateUnit, frequency, applicationMethod, waterIn,
foliarOrIrrigate, staining, grassSafe[], compatibilityNotes, warnings, notes.
Also: zones[], compatibility[] (6 rules).

### completions.json
{ "taskId": { "completedAt": "DD/MM/YYYY", "completedTime": "ISO" } }

### applications.json
Entries newest-first. Written by tracker (task completion) and dashboard (manual log modal).
{ "entries": [{ "id", "date", "dateISO", "taskId", "taskLabel", "taskType", "zones[]", "products[]", "inventoryDeducted" }] }

### mowing.json
Entries newest-first. Written by tracker Log mow modal.
{ "entries": [{ "id", "date", "dateISO", "zone", "zoneName", "grass", "mower", "heightMm", "notes" }] }

### watering.json
Entries newest-first. Written by tracker Log water modal.
{ "entries": [{ "id", "date", "dateISO", "zones[]", "zoneNames", "method", "durationMin", "amountL", "notes" }] }
Methods: sprinkler | hose | drip | manual

### weather.json
Entries newest-first. Written by dashboard Log observation modal.
{ "entries": [{ "id", "date", "dateISO", "type", "note" }] }
Types: rain | heat | frost | drought | storm | observation | other


## 10. TOOL 1 -- TRACKER -- tracker.html (LIVE)

Header buttons (always visible after load):
- Connect GitHub (hidden when connected)
- Log water
- Log mow
- Dashboard link

LOG A WATER MODAL:
- Zone checkboxes (multi-select: Back Lawn, Front Lawn, Front Nature Strip, Front Left Strip)
- Method dropdown (sprinkler, hose, drip irrigation, manual/watering can)
- Duration (minutes) -- required
- Amount (litres) -- optional
- Notes -- optional
- Saves to data/watering.json via GitHub API

LOG A MOW MODAL:
- Zone dropdown (single zone or all zones)
- Mower dropdown (Honda HRN216, Allett Stirling 43, Ozito PXC)
- Height grid (buttons auto-populate per mower's exact height settings)
- Notes (optional, 120 char)
- Saves to data/mowing.json

MOWING HEIGHT REFERENCE CARD:
- Collapsible panel below month title (collapsed by default)
- Table: Grass x Mower -> Summer/Autumn range, Winter/Spring range, Notes
- Current season column highlighted green

CHECKBOX BEHAVIOUR:
1. Tick -> saves completions.json -> deduction modal
2. Deduction modal: Cancel (uncheck), Skip deduction, Deduct from inventory
3. Tick completed -> uncheck warning modal

KNOWN ISSUE RESOLVED (30 May 2026):
- tracker.html was crashing with SyntaxError: Unexpected token ';'
- Root cause: GitHub API push was corrupting multi-byte Unicode chars in JS
  (H2O subscript, checkmark, em-dash, warning symbol etc.)
- Fix: All JS strings now use pure ASCII only. HTML sections use &entities;
- This constraint must be maintained in all future tracker.html edits.


## 11. TOOL 2 -- DASHBOARD -- dashboard.html (LIVE)

Supports: ?tab=overview|program|inventory|log|alerts|zones

OVERVIEW TAB:
- 4 stat tiles: current month/season, tasks done this month, year completion %, last application
- Monthly progress bars, upcoming tasks, inventory stock bars
- Weather & Observations panel (expandable)
- Log observation button -> weather modal

PROGRAM TAB:
- 12 month tiles -> tracker.html?month=N
- Filterable task table

INVENTORY TAB:
- Product cards with stock bar + click -> stock update modal
- Resupply button -> resupply modal (adds to qty, saves inventory.json)

LOG TAB:
- WATERING: zone cards (days since last water, red if overdue) + history table
- MOWING: zone cards (days since last mow, amber if overdue) + history table
- APPLICATIONS: stat tiles + days-since-last grid + all-applications table
- Export CSV button -> client-side CSV download
- Log manual application button -> modal

ALERTS TAB:
- Overdue mowing per zone (season-aware), inventory low/critical,
  compatibility rules, month not started, watering overdue. Alert count badge.

ZONES TAB:
- Zone cards (area, grass type, tasks this month) + total summary card + compatibility rules


## 12. CURRENT STATUS (30 May 2026)

[DONE] brief.md -- project brief in GitHub repo (this file)
[DONE] index.html -- landing page, quick links
[DONE] tracker.html -- LIVE and loading correctly as of 30 May 2026
  - program.json v2.0 rendering correctly (Wk1+Wk3 cadence)
  - HiCure appears in every main tank-mix
  - Zone-specific qty chips working (e.g. TX10 Zoysia only, Maintain Kikuyu+Couch only)
  - Conditional tasks showing correctly
  - Mow + water log modals working
  - Completions + deduction modal working (requires GitHub auth)
[DONE] dashboard.html -- 6 tabs live
[DONE] program.json -- v2.0 (25 May 2026), 12 months, Wk1+Wk3 cadence
[DONE] inventory.json -- 21 products, HiCure confirmed 0.75L (30 May 2026)
[DONE] completions.json -- created on first save
[DONE] applications.json -- created on first task completion
[DONE] mowing.json -- created on first mow save (404 before first use -- expected)
[DONE] watering.json -- created on first water save (404 before first use -- expected)
[DONE] weather.json -- created on first save from dashboard

NEXT TASKS:
- Test Rates & details expand with GitHub connected to confirm deduction modal works end-to-end
- Check dashboard rendering against v2.0 program schema (old program had weeks 1-4)
- Consider conditional task visual treatment (e.g. dimmed until condition met)


## 13. NEXT SESSION INSTRUCTIONS

Start every session by reading brief.md from the GitHub repo:
  owner=cjj-gmail, repo=lawn-care-tools, path=brief.md

End every session by updating brief.md with any changes made.

CRITICAL: When editing tracker.html, ALL characters inside <script> tags must be
pure ASCII. No Unicode symbols, no em-dashes, no subscript numbers, no checkmarks.
Use HTML entities (&times; &mdash; etc.) in HTML, plain hyphens/words in JS strings.
Violating this causes a SyntaxError that prevents the page loading entirely.


## 14. PROGRAM REBUILD -- COMPLETE (25 May 2026)

program.json v2.0 rebuilt from scratch. Key changes from v1:
- 4 weekly events -> 2 events per month (Wk1 main run + Wk3 bio run)
- HiCure added to every main tank-mix (GreenXtra + Tracemaxx + HiCure)
- Spartan: March (winter weed prevention) + September (summer weed prevention)
- Acelepryn: back lawn (Kikuyu) only in September -- limited 100mL stock
- Heritage Maxx: November (preventative), February (late summer), December (conditional)
- Tribute: zone-locked to Zoysia + Couch only -- back lawn excluded at JSON level
- Battle Insecticide: conditional in summer months (Dec, Jan, Feb)
- Bow & Arrow: conditional in April, July, October
- Renovation: September Wk3, Kikuyu + Couch zones only (not Zoysia)
- Zoysia front lawn: TX10 only for granular (not Maintain)
- Summer months: soil wetter added to main tank-mix
- Winter/transition months: Liquid Iron added to main tank-mix for colour

### Seven program pillars
1. Granular fertiliser
2. Liquid feed / colour
3. Bio-stimulant / kelp
4. Soil wetter (liquid only)
5. Pre-emergent herbicide
6. Post-emergent / selective herbicide
7. Insecticide + fungicide (preventative)

### Seasonal priorities (Oakhurst NSW 2761)
| Season | Months  | Focus |
|--------|---------|-------|
| Autumn | Mar-May | Pre-emergent (winter grass), K boost, reduce N, colour, disease watch |
| Winter | Jun-Aug | Colour only, minimal fert, soil amendment, weed watch |
| Spring | Sep-Nov | Renovation, pre-emergent (summer weeds), Acelepryn grub prevention, push N |
| Summer | Dec-Feb | Peak nutrition, insect knockdown if needed, Heritage Maxx, soil wetter critical |

### Herbicide safety by zone
| Product      | Type                | Safe on                          | Timing |
|--------------|---------------------|----------------------------------|--------|
| Spartan      | Pre-emergent        | All zones                        | Mar + Sep |
| Bow & Arrow  | Post-emergent broad | All zones                        | As needed |
| Tribute      | Post-emergent grass | Zoysia + Couch ONLY (not Kikuyu) | Autumn/spring |
| Tombstone Duo| Knockdown           | Kikuyu + Couch ONLY (not Zoysia) | Spot treatment |
| Contra M Duo | Broad spectrum      | Kikuyu + Couch ONLY (not Zoysia) | As needed |


## 15. BRAND COMPARISON REFERENCE (locked 24 May 2026)

Researched brands: LawnPride (LP), Plant Doctor (PD), Lawn Addicts (LA), Terralift, Syngenta.

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
| HiCure               | HiCure (same)                           | Lawn Addicts |
| Pesticides           | Same actives, best price                | Shop around  |


## 16. PROGRAM STRUCTURE (finalised 24 May 2026)

### Application cadence
2 application events per month -- not weekly.
- Week 1 -- Main run: granular fert (if scheduled) + liquid colour tank-mix + HiCure + any pesticides/one-offs
- Week 3 -- Bio run: Kelpxtra solo (first pass) + soil wetter / Activ8EXTRA / Stimulus (second pass same day)

Pesticides and one-off tasks are discrete -- not added to spray tanks.

### Tank-mix rules
- Main tank-mix: GreenXtra + Tracemaxx + HiCure always together
- Liquid Iron can join at reduced Tracemaxx rate (100ml/100m2)
- Heritage Maxx per label (NOT via backpack sprayer)
- Soil wetter added to main tank-mix in summer months
- Bio tank-mix (Wk3 pass 2): Hydramaxx or NatWetter + Activ8EXTRA + Stimulus
- Kelpxtra: ALWAYS SOLO -- never in any tank-mix
- Dilute all concentrates with water first before combining
- Iron overload: Tracemaxx always at 100ml/100m2 when GreenXtra at 200ml/100m2

### Zone rules
- Couch (strip1 + strip2) always follows Kikuyu tasks
- Zoysia (front) gets TX10 only for granular -- not Maintain
- Tribute: Zoysia + Couch ONLY -- NEVER back lawn (Kikuyu)
- Tombstone Duo / Contra M Duo: Kikuyu + Couch ONLY -- NEVER Zoysia
- Acelepryn 0.1L -- back lawn only in September
- Heritage Maxx 1L -- Nov, Dec/Jan, Feb
- Spartan 0.5L -- March + September (2 full applications)

### Month-by-month (see program.json v2.0 for full task detail)

| Month | Season | Wk1 highlights | Wk3 highlights |
|-------|--------|----------------|----------------|
| Jan | Summer | Maintain+TX10, NatWetter+GreenXtra+Tracemaxx+HiCure+LiqIron | Kelpxtra solo, NatWetter+Activ8+Stimulus, Battle conditional |
| Feb | Summer | Maintain+TX10, tank+HeritMaxx | Kelpxtra solo, NatWetter+Activ8+Stimulus, Battle conditional |
| Mar | Autumn | Spartan, Maintain+TX10, GreenXtra+Tracemaxx+HiCure | Kelpxtra solo, NatWetter+Activ8+Stimulus |
| Apr | Autumn | GreenXtra+Tracemaxx+HiCure, Bow&Arrow conditional | Kelpxtra solo, Hydramaxx+Activ8 |
| May | Autumn | GreenXtra+Tracemaxx+HiCure+LiqIron | Kelpxtra solo, NatWetter+Activ8+Stimulus |
| Jun | Winter | GreenXtra+Tracemaxx+HiCure+LiqIron | Kelpxtra solo, Hydramaxx+Activ8 |
| Jul | Winter | GreenXtra+Tracemaxx+HiCure | Kelpxtra solo, Hydramaxx+Activ8, Tribute+Bow&Arrow conditional |
| Aug | Winter | GreenXtra+Tracemaxx+HiCure+LiqIron | Kelpxtra solo, Hydramaxx+Activ8+Stimulus, light granular |
| Sep | Spring | Spartan, Acelepryn (back only), Maintain+TX10, GreenXtra+Tracemaxx+HiCure | Renovation (back+strips), soil wetter, Kelpxtra solo, NatWetter+Activ8+Stimulus |
| Oct | Spring | Maintain+TX10, GreenXtra+Tracemaxx+HiCure, Bow&Arrow conditional | Kelpxtra solo, Hydramaxx+Activ8+Stimulus |
| Nov | Spring | Maintain+TX10, GreenXtra+Tracemaxx+HiCure+HeritMaxx | Kelpxtra solo, Hydramaxx+Activ8+Stimulus, Tribute conditional |
| Dec | Summer | Maintain+TX10, NatWetter+GreenXtra+Tracemaxx+HiCure, HeritMaxx conditional | Kelpxtra solo, NatWetter+Activ8+Stimulus, Battle conditional |
