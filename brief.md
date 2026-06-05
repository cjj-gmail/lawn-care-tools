# LAWN CARE PROJECT BRIEF
Last Updated: 06 Jun 2026 (session 11 -- rainfall totals added to Overview weather panel)

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
    |-- program.json       -> 12-month custom program (v2.4 -- updated 31 May 2026)
    |-- inventory.json     -> 22 products, 4 zones, 6 compat rules
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
- Enables Claude to run commands on local machine and read/write local files
- Used for all git operations (see Section 17) -- replaces Docker + GitHub MCP approach
- Docker is installed but no longer needed for this project


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


## 6. PRODUCT INVENTORY (22 products -- 31 May 2026)

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
| Phosfighter            | Lawn Addicts           | L    | 0 (TBP)   |

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

### program.json (v2.4 -- updated 31 May 2026)
12-month program. Month > Week (1 or 3) > Tasks.
Task types: fertilise, biostimulant, herbicide, fungicide, insecticide, soilwetter, renovation.
v2.4 change: Seaweed Secrets added to all 12 Wk3 Pass 2 bio runs. August Wk3 granular removed. Phosfighter placeholder tasks added to 9 months (Jan, May-Nov, Dec) -- conditional, not yet in stock.

### inventory.json (22 products)
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

Header: Connect GitHub | Log irrigation | Log mow | Dashboard link

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
- Overview: stat tiles, progress bars, weather journal (Log observation button top right)
- Program: 12 month tiles -> tracker, filterable task table
- Inventory: product cards, stock bars, resupply modal; Critical/Low cards show reorder badge with replacement product name + Buy link; months remaining estimate shown
- Log: watering + mowing + applications + CSV export
- Alerts: Shopping List panel (grouped by retailer, auto-generated from Critical/Low stock); overdue mowing/watering, low inventory, compatibility rules
- Zones: zone cards + compatibility rules

INVENTORY ALERT LOGIC (rebuilt session 2):
- invStatus() now calculates scheduled applications per year from program.json
- Quantities per application summed from actual zone areas in task.products[].quantities
- Remaining stock divided by avg qty per application = applications remaining
- Critical: <=3 applications remaining
- Low: 4-6 applications remaining
- OK: 7+ applications remaining
- Inventory cards show "X applications remaining" instead of meaningless percentage
- Program meta notes removed from alerts (were generating 10+ false positives)

WATERING LOG NOTE:
- "Log irrigation" button is for irrigation only -- not rain
- Rain/weather events go in Weather & Observations (Log observation button)

WEATHER OBSERVATIONS:
- Edit and Delete buttons now on every weather entry (session 3)
- 27/05/2026 entry can now be corrected via Edit button -- type set to "rain"

NOTE: Dashboard Program tab verified working correctly with v2.2 schema.
Dashboard iterates weeks generically so Wk1+Wk3 structure renders fine.


## 12. CURRENT STATUS (31 May 2026 -- session 5)

[DONE] brief.md -- canonical project brief in GitHub repo
[DONE] index.html -- landing page live
[DONE] tracker.html -- LIVE, loading correctly, deductions working
[DONE] tracker.html -- "Log irrigation" button label confirmed correct (session 3)
[DONE] dashboard.html -- 6 tabs live, inventory alert logic rebuilt (session 2)
[DONE] dashboard.html -- weather entry edit/delete added (session 3)
[DONE] dashboard.html -- "Log a water" references updated to "Log irrigation" (session 3)
[DONE] program.json -- v2.3 (Stimulizer added to all 12 Wk1 main tank-mix tasks, session 3)
[DONE] program.json -- v2.2 (Acelepryn twice yearly Sep+Jan, all zones)
[DONE] alerts verified -- 3 product alerts (HiCure CRITICAL, Liquid Iron LOW, Acelepryn LOW) + 6 compat rules -- all accurate (session 3)
[DONE] inventory.json -- 21 products, quantities current as of 30 May 2026
[DONE] applications.json -- May Wk1 task logged
[DONE] mowing.json -- created on first mow save
[DONE] watering.json -- created on first water save
[DONE] weather.json -- rain events logged Mon-Fri 25-29 May 2026
[DONE] CLAUDE.md -- working folder instructions file created (session 3)
[DONE] gitrun.bat + .gitignore -- git CLI workflow confirmed working
[DONE] Docker no longer needed -- Desktop Commander git replaces it
[DONE] Fine-grained GitHub token deleted -- not needed

NEXT TASKS (new session):
- Buy Phosfighter from Lawn Addicts -- placeholder tasks in program.json Wk3 for 9 months ready to activate
- Consider further dashboard improvements: (none outstanding -- all planned items done)
- TypeScript pass on .jsx components (optional, lower priority)

REACT REBUILD STATUS (sessions 5-7 -- COMPLETE):
- [DONE] Phase 1 -- Vite scaffold, routing, AppContext, services, LandingPage
- [DONE] Phase 3 -- Full TrackerPage: task cards, all modals, mow/water logging, deduction flow
- [DONE] Phase 4 -- DashboardPage: 6 tabs, 4 modals, invStatusCache, lazy tab mount
- [DONE] Phase 5 -- tracker.html + dashboard.html replaced with redirect shims, pushed to GitHub
- [DONE] Session 7 -- TypeScript core conversion (services, store, utils), shims deleted, build 312KB clean
- [DONE] Session 8 -- "Next up" card on dashboard Overview tab (next incomplete week block, links to tracker)
- [DONE] Session 9 -- Mowing frequency stats grid in Log tab (count + avg interval per zone)
- [DONE] Session 9 -- Rain gauge field on weather modal (optional mm, blue badge in overview log)
- [DONE] Session 10 -- Watering frequency stats grid in Log tab (count + avg interval per zone)
- [DONE] Session 10 -- Redirect shims restored + vite.config.js fixed to copy shims into dist
- [DONE] Session 11 -- Rainfall totals in Overview weather panel (this month + all time, from rainMm entries)

GITHUB ACTIONS DEPLOY (one-time setup required):
The deploy.yml workflow file could NOT be pushed via PAT (requires 'workflow' scope).
Two options to enable CI deploy:
  Option A (recommended): Add 'workflow' scope to the PAT used by gitrun.bat
    Settings -> Developer settings -> Personal access tokens -> Edit token -> check 'workflow'
    Then: gitrun.bat add .github/workflows/deploy.yml && gitrun.bat commit -m "Add CI deploy" && gitrun.bat push
  Option B: Create the workflow manually via GitHub web UI
    github.com/cjj-gmail/lawn-care-tools -> Actions -> New workflow -> paste deploy.yml content

GITHUB PAGES SOURCE (one-time setting change required):
Currently serving from 'main' branch root.
After CI deploy is set up, change to serve from 'gh-pages' branch:
  github.com/cjj-gmail/lawn-care-tools -> Settings -> Pages -> Source -> gh-pages branch

MANUAL DEPLOY (until CI is set up):
Run locally: npm run build
Then push dist/ contents to gh-pages branch manually, OR drag-and-drop to GitHub.

BUGS FIXED (session 6):
- program.json HTTP 0 error -- switched to raw CDN fetch (GitHub Contents API ~100KB limit)
- Rules-of-hooks violation in TrackerPage + DashboardPage -- all useMemo/useCallback
  hooks moved above early loading/error returns
- React error #310 resolved

UX IMPROVEMENTS (session 6):
- Overview tab reordered: stats -> upcoming tasks -> weather -> inventory alerts (critical/low only) -> year progress (collapsible, default closed)
- TaskCard expand: replaced inline "Rates & details" link with right-edge chevron button (full-height, accessible, works on mobile tap)
- Month nav URL sync: clicking a month tab now updates ?month= in the URL (bookmarkable)


## 13. NEXT SESSION INSTRUCTIONS

### Session start
Read brief.md from the LOCAL REPO (avoids CDN cache):
  C:\Users\camer\lawn-care-tools\brief.md  (via Desktop Commander read_file)

### Before starting any piece of work
Update brief.md (local + push to GitHub) with what is ABOUT TO be done:
- Add the task to NEXT TASKS or mark it IN PROGRESS
- Push so the brief reflects intent even if the session ends mid-task
- This ensures the next session knows exactly where to pick up without needing chat history

### After completing any piece of work
Update brief.md (local + push to GitHub) with what WAS DONE:
- Move task from IN PROGRESS / NEXT TASKS to DONE in Section 12
- Update Last Updated line with today's date + session summary
- Update any relevant sections (inventory counts, program version, tool status, etc.)
- Push immediately -- do not batch brief updates with code changes

### Why
If a session hits the context limit or ends unexpectedly, the next session reads the brief
and has full context. No need to copy chat history across sessions.

### For large file edits (program.json, tracker.html, dashboard components)
- Use git CLI via Desktop Commander (see Section 17) -- PREFERRED
- Or download file, edit locally, drag-and-drop to GitHub -- FALLBACK
- Do NOT use push_files for files >50KB -- it will truncate silently


## 14. PROGRAM REBUILD -- COMPLETE (v2.4 as of 31 May 2026 session 4)

v2.4 change (31 May 2026 session 4):
- Full program review vs LA (all 8 seasonal calendars), LP (Kikuyu + Zoysia), and PD brochure
- Seaweed Secrets (productId 7, 100mL/100m2) added to every Wk3 Pass 2 bio run -- uses up 4L stock
- August Wk3 granular removed -- not supported by LA or LP winter guidance
- Phosfighter (productId 22) added as conditional placeholder task to Wk3 in 9 months (Jan, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec) -- NOT YET IN STOCK
- inventory.json updated to 22 products with Phosfighter at qty 0
- Stimulizer also confirmed in all Wk1 main tank-mix tasks (v2.3 change from session 3)

## 14b. PROGRAM REBUILD -- COMPLETE (v2.2 as of 30 May 2026 session 2)

v2.2 change (30 May 2026 session 2):
- Acelepryn expanded to all zones (was back lawn only in Sep)
- Acelepryn added to January Wk1 -- second annual application (LA reference confirms twice yearly)
- 100mL stock covers ~2.4 years at 21mL/application twice yearly
- Reference programs reviewed: Lawn Addicts (Kikuyu + Zoysia all seasons) + Plant Doctor brochure
- Key gap identified: Phosfighter (LA plan) -- phosphite disease resistance -- not in inventory yet
- Stimulizer confirmed safe to mix with Iron concentrate (PD brochure) -- consider adding to Wk1

v2.1 change (30 May 2026):
- Stimulizer (Plant Doctor) added to every bio run Pass 2 task
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
- Bio run Pass 2 (Wk3): soil wetter + Activ8EXTRA + Seaweed Secrets + Stimulus (most months) + Stimulizer (every month)
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
| Jan | Summer | Maintain+TX10, NatWetter+GX+Tmx+HiCure+LiqIron+Stiz | Kelpxtra, NatWetter+A8+SS+Stim+Stiz+Phosf(cond), Battle cond |
| Feb | Summer | Maintain+TX10, NatWetter+GX+Tmx+HiCure+HeritMaxx+Stiz | Kelpxtra, NatWetter+A8+SS+Stim+Stiz, Battle cond |
| Mar | Autumn | Spartan, Maintain+TX10, GX+Tmx+HiCure+Stiz | Kelpxtra, NatWetter+A8+SS+Stim+Stiz |
| Apr | Autumn | GX+Tmx+HiCure+Stiz, B&A cond | Kelpxtra, Hydra+A8+SS+Stiz |
| May | Autumn | GX+Tmx+HiCure+LiqIron+Stiz | Kelpxtra, NatWetter+A8+SS+Stim+Stiz+Phosf(cond) |
| Jun | Winter | GX+Tmx+HiCure+LiqIron+Stiz | Kelpxtra, Hydra+A8+SS+Stiz+Phosf(cond) |
| Jul | Winter | GX+Tmx+HiCure+Stiz | Kelpxtra, Hydra+A8+SS+Stiz+Phosf(cond), Tribute+B&A cond |
| Aug | Winter | GX+Tmx+HiCure+LiqIron+Stiz | Kelpxtra, Hydra+A8+SS+Stim+Stiz+Phosf(cond) |
| Sep | Spring | Spartan, Acelepryn(all), Maintain+TX10, GX+Tmx+HiCure+Stiz | Reno, Kelpxtra, NatWetter+A8+SS+Stim+Stiz+Phosf(cond) |
| Oct | Spring | Maintain+TX10, GX+Tmx+HiCure+Stiz, B&A cond | Kelpxtra, Hydra+A8+SS+Stim+Stiz+Phosf(cond) |
| Nov | Spring | Maintain+TX10, GX+Tmx+HiCure+HeritMaxx+Stiz | Kelpxtra, Hydra+A8+SS+Stim+Stiz+Phosf(cond), Tribute cond |
| Dec | Summer | Maintain+TX10, NatWetter+GX+Tmx+HiCure+Stiz, HeritMaxx cond | Kelpxtra, NatWetter+A8+SS+Stim+Stiz+Phosf(cond), Battle cond |

Key: GX=GreenXtra, Tmx=Tracemaxx, A8=Activ8EXTRA, SS=Seaweed Secrets, Stim=Stimulus, Stiz=Stimulizer, Hydra=Hydramaxx, NatWetter=Nature's Soil Wetter, B&A=Bow & Arrow, LiqIron=Liquid Iron, HeritMaxx=Heritage Maxx, Phosf=Phosfighter (cond=conditional/not yet in stock)


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

IMPORTANT: Keep the repo on a plain local NTFS path (not Google Drive). GDrive
continuously syncs .git internals which can cause lock file conflicts and slow operations.
Note: the original GDrive output issue was actually a Desktop Commander PowerShell capture
problem (fixed by the gitrun.bat redirect approach), not a GDrive path problem per se.

### How Claude runs git (via Desktop Commander)
Git is not in Desktop Commander's PowerShell PATH. Use the batch file wrapper
stored in the repo itself:
  C:\Users\camer\lawn-care-tools\gitrun.bat

The batch file content (it's in the repo, but recreate with write_file if needed):
  @echo off
  cd /d C:\Users\camer\lawn-care-tools
  C:\PROGRA~1\Git\bin\git.exe %* > C:\Users\camer\lawn-care-tools\gitout.txt 2>&1
  type C:\Users\camer\lawn-care-tools\gitout.txt

gitout.txt is listed in .gitignore so it won't be committed.
gitmsg.txt (commit message file) is NOT in .gitignore -- delete after use or just leave it.

Always call with shell: cmd, e.g.:
  C:\Users\camer\lawn-care-tools\gitrun.bat status
  C:\Users\camer\lawn-care-tools\gitrun.bat log --oneline -5
  C:\Users\camer\lawn-care-tools\gitrun.bat add -A
  C:\Users\camer\lawn-care-tools\gitrun.bat commit -F C:\Users\camer\lawn-care-tools\gitmsg.txt
  C:\Users\camer\lawn-care-tools\gitrun.bat push

NOTE: Commit messages must use -F flag pointing to gitmsg.txt -- passing inline splits on spaces.

### Standard workflow for large file edits (program.json, tracker.html, dashboard.html)
1. Desktop Commander read_file -- read current file from local repo
2. Desktop Commander edit_block or write_file -- make changes locally
3. gitrun.bat add -A
4. Write commit message to gitmsg.txt, then: gitrun.bat commit -F gitmsg.txt
5. gitrun.bat push
6. Verify at https://github.com/cjj-gmail/lawn-care-tools

### Small files (inventory.json, brief.md, completions.json etc.)
Can still be pushed via GitHub MCP push_files -- no change needed.


---

## 18. REACT / VITE REBUILD (started session 3)

A full React rebuild of the tool is underway alongside the existing HTML pages.
The legacy tracker.html and dashboard.html remain live and untouched throughout migration.

### Tech stack
- Vite 5 + React 18 + React Router 6 (hash routing)
- CSS Modules (scoped per component)
- No TypeScript yet -- add in a later pass once component tree is stable
- GitHub Actions CI: push to main --> vite build --> deploy to gh-pages branch

### Repo structure (new additions)
```
src/
  main.jsx                    -- React root (AppProvider + RouterProvider)
  App.jsx                     -- Hash router: / | /tracker | /dashboard
  config.js                   -- Single source of truth: CONFIG, ZONES, ZONE_ORDER,
                                 TYPE_COLORS, MOWER_HEIGHTS, HEIGHT_REF,
                                 CAUTION_ICONS, SEASONS
  hooks/
    useAppInit.js             -- Handles OAuth callback + parallel loads all 7 JSON files
    useTrackerSave.js         -- saveCompletions, saveInventory, writeAppLog
    useToast.js               -- Toast state hook
  services/
    github.js                 -- loadJson(path, token), saveJson(path, obj, sha, msg, token)
    auth.js                   -- getToken, setToken, startLogin, handleOAuthCallback
  store/
    actions.js                -- Action type constants
    reducer.js                -- Full reducer + invStatusCache build on load/inventory write
    AppContext.jsx             -- useAppState() / useAppDispatch() hooks
  utils/
    invStatus.js              -- Pure calcInvStatus(product, program) -- O(1) via cache
  styles/
    tokens.css                -- All CSS custom properties (single source of truth)
    base.css                  -- Reset, shared header, modal, stat-tile, alert-item classes
  components/
    Toast.jsx + Toast.module.css
  pages/
    LandingPage.jsx + LandingPage.module.css   -- Full port of index.html
    tracker/
      TrackerPage.jsx           -- Main tracker page (month nav, progress, task list)
      TrackerPage.module.css
      WeekBlock.jsx             -- Week heading + TaskCard list
      TaskCard.jsx              -- Task card with checkbox, expand, zone chips, caution chips
      TaskCard.module.css
      ZoneChip.jsx              -- ZoneChip + ZoneCombinedChip
      CautionChip.jsx           -- Caution chip with click-to-open tooltip
      HeightRefCard.jsx + HeightRefCard.module.css
      DeductModal.jsx           -- Inventory deduction modal
      UncheckModal.jsx          -- Uncheck confirmation modal
      MowModal.jsx              -- Log a mow modal
      WaterModal.jsx            -- Log irrigation modal
      Modals.module.css         -- Shared modal styles
    dashboard/
      DashboardPage.jsx         -- Phase 1 placeholder (Phase 4 full build pending)

vite.config.js                -- base /lawn-care-tools/, copies legacy HTML + data/ to dist
.github/workflows/deploy.yml  -- CI: npm ci -> vite build -> deploy to gh-pages
.gitignore                    -- node_modules/, dist/ added
package.json                  -- react, react-dom, react-router-dom, vite, @vitejs/plugin-react
```

### Key architectural decisions
- Hash router (#/) avoids GitHub Pages redirect issues -- no server config needed
- Single AppContext + useReducer -- no Redux
- loadJson() returns both data AND sha in one API call -- eliminates double-fetch
- invStatus calculated once (BUILD_INV_CACHE) and read from cache -- not O(n^2) on render
- All GitHub writes go through saveJson() in services/github.js -- no inline fetch PUTs
- ZONES/ZONE_ORDER/TYPE_COLORS defined once in config.js -- no more drift between pages
- Legacy tracker.html + dashboard.html copied into dist/ on every build -- stay live

### Phase status
- [DONE] Phase 1 -- Vite scaffold, routing, AppContext, all services, LandingPage (session 3)
- [DONE] Phase 3 -- Full TrackerPage: all task cards, modals, mow/water logging (session 3)
- [PENDING] Phase 2 -- Data layer verification (covered by Phase 3 implementation)
- [PENDING] Phase 4 -- Full DashboardPage (6 tabs)
- [PENDING] Phase 5 -- Polish, CSS modules, cut-over, delete legacy HTML

### Dev workflow
```
npm run dev       -- local dev server at localhost:5173/lawn-care-tools/
npm run build     -- production build to dist/ (CI does this automatically on push)
git push          -- triggers GitHub Actions deploy to gh-pages branch
```
PowerShell execution policy blocks npm.ps1 -- always run npm in cmd, not PowerShell.
Or fix once: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned (run as Admin).

### NEXT TASKS (Phase 4)
- Build DashboardPage with 6 tabs: Overview, Program, Inventory, Log, Alerts, Zones
- Port renderOverview(), renderInventory(), renderAlerts() etc. as tab components
- Add useMemo for alerts and program filter derived state
- Implement stock edit modal (openStockModal), resupply modal, manual log modal
- Implement weather log with edit/delete
- Add CSV export to Log tab
- Rename "Log water" -> "Log irrigation" (already done in React TrackerPage)
- Add edit/delete to weather observations (flagged in Section 12)
