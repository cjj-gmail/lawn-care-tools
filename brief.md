# LAWN CARE PROJECT BRIEF
Last Updated: 24 May 2026

---

## 1. PROJECT OVERVIEW
Three-tool interactive lawn care system hosted on GitHub Pages. All three pages are live and fully interconnected.

URLs:
- Landing page:  https://cjj-gmail.github.io/lawn-care-tools/
- Tracker:       https://cjj-gmail.github.io/lawn-care-tools/tracker.html
- Dashboard:     https://cjj-gmail.github.io/lawn-care-tools/dashboard.html

Navigation:
- index → tracker + dashboard (tool cards + quick links row)
- tracker header: Connect GitHub · 💧 Log a water · ✂ Log a mow · → Dashboard
- dashboard header: → Tracker · 🏠 Home
- Quick links on index: This month's tasks, Dashboard overview, Inventory, Application log, Alerts, Program, Zones


## 2. GOOGLE DRIVE REFERENCES
- Lawn Care Folder ID:   1cRWixwn9_B60mct06CdZWb-WpAKnduJd
- My Lawn Care Sheet ID: 1xFGTMYh0gxYQb78YTUVs2BwW8jb2znZxbq9Ed3Z_6xE
- Project Brief (archived): Google Drive doc — superseded by this file (brief.md in GitHub repo)


## 3. GITHUB & HOSTING
- Repo:       https://github.com/cjj-gmail/lawn-care-tools
- Pages URL:  https://cjj-gmail.github.io/lawn-care-tools
- Username:   cjj-gmail
- Deployment: Manual upload (drag and drop to GitHub)

Repo Structure:
```
lawn-care-tools/
├── brief.md               → Project Brief (THIS FILE — canonical source)
├── index.html             → Landing page (LIVE)
├── tracker.html           → Tool 1 (LIVE)
├── dashboard.html         → Tool 2 (LIVE)
├── sheets-auth-test.html
├── github-auth-test.html
├── auth-success.html
└── data/
    ├── program.json       → 12-month custom program (90KB — REBUILD PENDING)
    ├── inventory.json     → 20 products, 4 zones, 6 compat rules
    ├── completions.json   → Task completions (created on first save)
    ├── applications.json  info Application log (created on first task complete)
    ├── mowing.json        → Mowing log (created on first mow save)
    ├── watering.json      → Watering log (created on first water save)
    ├── weather.json       → Weather/observations journal
    └── connection-test.json
```


## 4. AUTHENTICATION & INFRASTRUCTURE

GitHub OAuth (primary — all writes):
- Client ID: Ov23linHLsAnUT81yTeY
- Cloudflare Worker: https://lawn-care-tools.cameronjude1.workers.dev
- Endpoints: /login, /callback, /verify
- Token stored in sessionStorage (cleared on tab close)
- Status: WORKING
- Used by: tracker.html (completions, app log, mow log, water log) + dashboard.html (inventory, manual app log, weather log)

Google OAuth (secondary — dormant):
- Client ID: 416766323294-e1cpni5440aio0pjgqr2cd6gjn0lvori.apps.googleusercontent.com
- Google Cloud Project: lawn-care-tools
- Status: Working but not used by any live tool
- Originally for Google Sheets access — superseded by GitHub JSON storage

Claude Desktop + Docker + local GitHub MCP:
- Status: Installed but dormant — not needed given current architecture
- Claude.ai has native GitHub MCP access used instead

Note: The canonical brief is now brief.md in this repo. Claude reads and writes it directly via GitHub API. Google Drive doc is archived/inactive.


## 5. LAWN SPECS
Total Area: 140.15 m²

| Zone                 | Grass   | Area      | Zone ID |
|----------------------|---------|-----------|----------|
| Back Lawn            | Kikuyu  | 68.2 m²   | back     |
| Front Lawn           | Zoysia  | 35.0 m²   | front    |
| Front Nature Strip   | Couch   | 20.8 m²   | strip1   |
| Front Left Strip     | Couch   | 16.15 m²  | strip2   |

Total Couch: 36.95 m²
Location: Oakhurst NSW 2761 — Humid subtropical, hot summers, mild winters, occasional frost.


## 6. PRODUCT INVENTORY (20 products — May 2026)

| Product                | Brand          | Unit | Remaining |
|------------------------|----------------|------|-----------|
| TX10 (5-2-8)           | Terralift      | kg   | 19.25     |
| Maintain (26-1-9)      | LawnPride      | kg   | 18        |
| Liquid Iron (7%)       | Plant Doctor   | L    | 1         |
| Nature's Soil Wetter   | Plant Doctor   | L    | 3.75      |
| Tombstone Duo          | Indigo         | L    | 0.44      |
| Heritage Maxx          | Syngenta       | L    | 1         |
| GreenXtra              | LawnPride      | L    | 4         |
| Activ8EXTRA            | Plant Doctor   | L    | 3.72      |
| Kelpxtra               | LawnPride      | L    | 3.86      |
| Seaweed Secrets        | Plant Doctor   | L    | 4         |
| Hydramaxx              | LawnPride      | L    | 4         |
| Tracemaxx              | LawnPride      | L    | 4         |
| Stimulus               | Lawn Addicts (Fertech) | L | 1.25  |
| HiCure                 | Syngenta (via Lawn Addicts) | L | qty TBC |
| Spartan                | LawnPride      | L    | 0.5       |
| Bow & Arrow            | Turf Culture   | L    | 0.5       |
| Acelepryn              | Syngenta       | L    | 0.1       |
| Battle Insecticide     | LSA            | L    | 1         |
| Tribute                | Envu           | L    | 1         |
| Contra M Duo           | Indigo         | L    | 1         |

Notes:
- Bow & Arrow deduplicated in code on load (appears twice in raw inventory.json)
- Full stock estimates: TX10=25kg, Maintain=20kg, liquids=5L default
- Stimulus is Fertech brand sold via Lawn Addicts (not Plant Doctor — previous brief had a typo)
- TX10 is Terralift brand (not Plant Doctor — a specialist greens-grade organic sold via various retailers)
- HiCure is a Syngenta product sold via Lawn Addicts — confirm qty in inventory.json next session
- Program rebuild pending — see Section 14
- Soil wetter preference: LIQUID ONLY — no granular wetter (Hydramaxx G removed from consideration)


## 7. EQUIPMENT

| Machine             | Type            | Height Settings                                          |
|---------------------|-----------------|----------------------------------------------------------|
| Honda HRN216        | Rotary Mower    | 27, 39, 51, 64, 76, 88, 100 mm                          |
| Allett Stirling 43  | Cylinder Mower  | 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 mm               |
| Ozito PXC           | Cylinder Mower  | 14, 23, 32, 38 mm                                       |
| Ryobi 36V           | Scarifier       | -12mm to +8mm                                           |


## 8. KEY DECISIONS & PRINCIPLES
- LawnPride PDFs (Zoysia Fine Leaf + Kikuyu) are REFERENCE ONLY for seasonal timing
- Lawn Addicts free plans (Kikuyu, Couch, Zoysia) are ADDITIONAL reference
- Custom program built for all three varieties; Couch follows Kikuyu program
- Program rebuild in progress — new program adds weed, insecticide & disease prevention (missing from old program)
- Use current inventory first; replace with best-of-brand when stock runs out (see Section 14)
- Soil wetter format: LIQUID ONLY — no granular wetter products
- Data storage: GitHub JSON files (primary); Google Sheet (secondary/dormant)
- Date format: DD/MM/YYYY throughout
- Always calculate product quantities from actual zone m² — not round numbers
- Always provide full file content on updates — partial updates not allowed
- inventory.json deduplicates on load (Bow & Arrow appears twice in raw file)
- Project Brief is now brief.md in GitHub repo — Claude reads/writes it directly


## 9. DATA FILE STRUCTURES

### program.json (90KB — REBUILD PENDING)
12-month program. Month > Week (1–4) > Tasks.
Task types: fertilise, biostimulant, herbicide, fungicide, insecticide, soilwetter, renovation.

### inventory.json
20 products, 4 zones, 6 compatibility rules.
Fields: name, brand, category, unit, qtyRemaining, ratePer100sqm, rateUnit.

### completions.json
`{ "taskId": { "completedAt": "DD/MM/YYYY", "completedTime": "ISO" } }`

### applications.json
Entries newest-first. Written by tracker (task completion) and dashboard (manual log modal).
`{ "entries": [{ "id", "date", "dateISO", "taskId", "taskLabel", "taskType", "zones[]", "products[]", "inventoryDeducted", "manual" (optional), "notes" (optional) }] }`

### mowing.json
Entries newest-first. Written by tracker ✂ Log a mow modal.
`{ "entries": [{ "id", "date", "dateISO", "zone", "zoneName", "grass", "mower", "heightMm", "notes" }] }`

### watering.json
Entries newest-first. Written by tracker 💧 Log a water modal.
`{ "entries": [{ "id", "date", "dateISO", "zones[]", "zoneNames", "method", "durationMin", "amountL" (nullable), "notes" }] }`
Methods: sprinkler | hose | drip | manual

### weather.json
Entries newest-first. Written by dashboard 🌤 Log observation modal.
`{ "entries": [{ "id", "date", "dateISO", "type", "note" }] }`
Types: rain | heat | frost | drought | storm | observation | other


## 10. TOOL 1 — TRACKER — tracker.html (LIVE)

Header buttons (always visible after load):
- Connect GitHub (hidden when connected)
- 💧 Log a water
- ✂ Log a mow
- → Dashboard

💧 LOG A WATER MODAL:
- Zone checkboxes (multi-select: Back Lawn, Front Lawn, Front Nature Strip, Front Left Strip)
- Method dropdown (sprinkler, hose, drip irrigation, manual/watering can)
- Duration (minutes) — required
- Amount (litres) — optional
- Notes — optional
- Saves to data/watering.json via GitHub API
- Visible without auth; shows notice if not connected

✂ LOG A MOW MODAL:
- Zone dropdown (single zone or all zones)
- Mower dropdown (Honda HRN216, Allett Stirling 43, Ozito PXC)
- Height grid (buttons auto-populate per mower's exact height settings)
- Notes (optional, 120 char)
- Saves to data/mowing.json

MOWING HEIGHT REFERENCE CARD:
- Collapsible panel below month title (collapsed by default)
- Table: Grass × Mower → Summer/Autumn range · Winter/Spring range · Notes
- Current season column highlighted green
- State preserved across month navigation within session

CHECKBOX BEHAVIOUR:
1. Tick → saves completions.json → deduction modal
2. Deduction modal: Cancel (uncheck), Skip deduction, Deduct from inventory
3. Tick completed → uncheck warning modal


## 11. TOOL 2 — DASHBOARD — dashboard.html (LIVE)

Supports: `?tab=overview|program|inventory|log|alerts|zones`

OVERVIEW TAB:
- 4 stat tiles: current month/season · tasks done this month · year completion % · last application (days ago + date + label)
- Monthly progress bars · upcoming tasks · inventory stock bars
- 🌤 Weather & Observations panel (expandable, show 5 most recent / show all toggle)
- "🌤 Log observation" button → weather modal

PROGRAM TAB:
- 12 month tiles → tracker.html?month=N
- Filterable task table

INVENTORY TAB:
- Product cards with stock bar + click → stock update modal
- "+ Resupply" button on each card → resupply modal (adds to qty, saves inventory.json)

LOG TAB:
- WATERING: 💧 zone cards (days since last water, red if overdue) + history table
- MOWING: ✂ zone cards (days since last mow, amber if overdue) + history table
- APPLICATIONS: stat tiles + days-since-last grid + all-applications table
- "↓ Export CSV" button → client-side CSV download
- "+ Log manual application" button → modal

ALERTS TAB:
- Overdue mowing per zone (season-aware), no mowing record, inventory low/critical,
  compatibility rules, month not started, program meta notes, watering overdue. Alert count badge.

ZONES TAB:
- Zone cards (area, grass type, tasks this month) + total summary card + compatibility rules


## 12. CURRENT STATUS (24 May 2026)

✅ brief.md — project brief now in GitHub repo (this file)
✅ index.html — landing page, quick links
✅ tracker.html — completions, deduction modal, uncheck safety, app log, mow log, 💧 water log, height ref card
✅ dashboard.html — 6 tabs: overview (weather journal), program, inventory (resupply), log (watering+mowing+apps+CSV export), alerts (overdue mowing+watering), zones
✅ applications.json — task completions + manual log entries
✅ mowing.json → mowing sessions
✅ watering.json → watering sessions (created on first save from tracker)
✅ weather.json → weather/observations journal (created on first save from dashboard)
⏳ program.json — REBUILD IN PROGRESS (see Section 14)


## 13. NEXT SESSION INSTRUCTIONS

**Start every session by reading brief.md from the GitHub repo:**
Via GitHub API: owner=cjj-gmail, repo=lawn-care-tools, path=brief.md

**End every session by updating brief.md** with any changes made (new features, status updates, decisions).

All three tools are fully live and interconnected.


## 14. PROGRAM REBUILD — IN PROGRESS

The existing program.json is being rebuilt from scratch. The old program is missing weed control, insecticide and disease prevention pillars.

### Seven program pillars (all zones, every season)
1. Granular fertiliser
2. Liquid feed / colour
3. Bio-stimulant / kelp
4. Soil wetter (liquid only)
5. Pre-emergent herbicide
6. Post-emergent / selective herbicide
7. Insecticide + fungicide (preventative)

### Seasonal priorities (Oakhurst NSW 2761)
| Season   | Months  | Focus |
|----------|---------|-------|
| Autumn   | Mar–May | Pre-emergent (winter grass), K boost, reduce N, colour maintenance, disease watch |
| Winter   | Jun–Aug | Colour only, minimal fert, soil amendment, weed watch |
| Spring   | Sep–Nov | Renovation, pre-emergent (summer weeds), Acelepryn grub prevention, push N, kelp |
| Summer   | Dec–Feb | Peak nutrition, insect knockdown if needed, disease prevention (Heritage Maxx), soil wetter critical |

### Herbicide safety by zone
| Product      | Type                   | Safe on                                        | Timing |
|--------------|------------------------|------------------------------------------------|--------|
| Spartan      | Pre-emergent           | Kikuyu ✅ Couch ✅ Zoysia ✅                    | Early autumn (Mar) + early spring (Sep) |
| Bow & Arrow  | Post-emergent broadleaf| Kikuyu ✅ Couch ✅ Zoysia ✅                    | As needed, spring/summer flush |
| Tribute      | Post-emergent grass    | Zoysia ✅ Couch ✅ — NOT Kikuyu, NOT QLD Blue Couch | Autumn/spring grass weed flush |
| Tombstone Duo| Knockdown + residual   | Kikuyu ✅ Couch ✅ — NOT Zoysia               | Spot treatment |
| Contra M Duo | Broad spectrum         | Kikuyu ✅ Couch ✅ — NOT Zoysia               | As needed |

### Reference sources for program rebuild (in priority order)
1. This brief (Section 14–16)
2. LawnPride PDFs (Zoysia Fine Leaf + Kikuyu) — seasonal timing reference only
3. Lawn Addicts free plans (Kikuyu, Couch, Zoysia) — additional seasonal reference
4. Claude's agronomic knowledge for Oakhurst NSW climate

### Status
- Brand comparison research: COMPLETE (see Section 15)
- Program structure design: COMPLETE (see Section 16)
- program.json rebuild: NOT STARTED


## 15. BRAND COMPARISON REFERENCE (locked 24 May 2026)

Researched brands: LawnPride (LP), Plant Doctor (PD), Lawn Addicts (LA), Terralift, Syngenta.

### Brand positioning
| Brand | Strength | Weakness |
|-------|----------|----------|
| LawnPride | Full ecosystem — granular, liquids, pest, weed, fungicide. Strong programs and mixing guide. | Very thin bio-stimulant range (Kelpxtra + Rootmaxx only). No amino acid product. |
| Plant Doctor | Excellent value liquid organics. Strong on seaweed, fulvic/humic, soil biology. Budget-friendly. | No granular fertilisers of their own. Zero pesticide range (no herbicides, fungicides, insecticides). |
| Lawn Addicts | Deepest bio-stimulant range (Fertech lineup). Greens-grade granulars (2Spec). Carries Syngenta products. Best overall product depth. | More professional — some products require care with mixing and rates. |
| Terralift | Specialist soil biology granular (TX10). Unique mycorrhizal + organic complex. Used on golf greens. | Narrow range — not a general-purpose brand. |
| Syngenta | Professional-grade actives (Acelepryn, Heritage Maxx, HiCure). Science-backed, trialled extensively. | Not a consumer brand — sold via retailers (LP, LA). |

### Category-by-category best picks

#### Granular fertiliser
| Role | Best pick | Brand | Notes |
|------|-----------|-------|-------|
| Kikuyu / Couch (spring/summer) | 2Spec Elevate 23-1-10 + Fe + Mn, 40% CRN | Lawn Addicts | Greens-grade, superior CRN vs LP Maintain |
| Kikuyu / Couch (autumn) | 2Spec Endurance 20-0-20 + Fe + Mn, 40% CRN | Lawn Addicts | High-K for stress resilience |
| Zoysia (spring/summer) | 2Spec Origin mini-prill SGN150 | Lawn Addicts | Fine prill purpose-built for shorter lawns |
| Zoysia (autumn) | 2Spec Komplex mini-prill SGN150, high K | Lawn Addicts | Higher K variant for Zoysia autumn |
| Soil biology / mycorrhizal | TX10 (5-2-8) | Terralift | Unique product — no real substitute. Reorder Terralift direct. |

#### Liquid fertiliser / colour
| Role | Best pick | Brand | Notes |
|------|-----------|-------|-------|
| Colour + N push | Fertech Special FeX (Fe + Mn + N) | Lawn Addicts | Best Fe + Mn combination. Outperforms GreenXtra. |
| Balanced liquid NPK | Fertech Complete | Lawn Addicts | All-round tank-mix partner |
| Dormancy / low-light feed | Fertech Fusion 12-1-12 + Fe/Mn/Zn + Fulvic | Lawn Addicts | Unique dormancy formulation. Replaces Tracemaxx role. |
| Iron supplement (fast colour) | Liquid Iron 7% + fulvic | Plant Doctor | Fulvic-chelated, fast-acting. Strong Zoysia reviews. Holds its own vs LA Super Iron. |

#### Bio-stimulants
| Role | Best pick | Brand | Notes |
|------|-----------|-------|-------|
| Kelp bio-stimulant | Fertech Kelpro | Lawn Addicts | Dual-source kelp (Ecklonia maxima + Bull Kelp) + fish amino acids. Outclasses Kelpxtra. |
| Amino acid / stress defence | HiCure (Syngenta) | Lawn Addicts | 19 amino acids, 62.5% w/w. Unique — no equivalent at LP or PD. Apply fortnightly at 100–200ml/100m². |
| Organic broad bio-stimulant | Fertech Bio (4-1-1 + seaweed + fish + Triacontanol) | Lawn Addicts | BFA certified organic. Triacontanol is a rare photosynthesis enhancer. |
| Root stimulant | Fertech Stimulus | Lawn Addicts | Already in inventory. High-P + Kelpro. Continue with same. |
| Entry-level seaweed | Seaweed Secrets | Plant Doctor | Fine as a budget option while stock lasts. Replace with Kelpro. |

#### Soil wetters (liquid only — no granular)
| Role | Best pick | Brand | Notes |
|------|-----------|-------|-------|
| Primary soil wetter | Hydrolink Advance | Lawn Addicts | Professional benchmark — polymeric surfactants + soil retention. |
| Current stock | Nature's Soil Wetter, Hydramaxx (liquid) | Plant Doctor / LawnPride | Use current stock, then transition to Hydrolink Advance. |
| Dry patch specialist | Hydrolink React | Lawn Addicts | Polymeric surfactants + 10% L-Form amino acids. Use when dry patch is an issue. |

#### Pesticides — brand-agnostic actives
Herbicides, insecticides and fungicides are registered active-ingredient products sold across multiple retailers. Buy on price.

| Product | Active | Role | Zone safety |
|---------|--------|------|-------------|
| Acelepryn GR / liquid | Chlorantraniliprole | Preventative systemic grub/caterpillar | All zones ✅ |
| Heritage Maxx | Azoxystrobin | Systemic preventative fungicide | All zones ✅ |
| Bow & Arrow | Aminopyralid + triclopyr | Post-emergent broadleaf | All zones ✅ |
| Spartan | Indaziflam | Pre-emergent | All zones ✅ |
| Tribute | Foramsulfuron | Post-emergent grass weed (Crowsfoot, Wintergrass, Ryegrass, Paspalum) | Zoysia ✅ Couch ✅ — NOT Kikuyu, NOT QLD Blue Couch, NOT Buffalo |
| Tombstone Duo | Fipronil + bifenthrin | Broad knockdown insecticide | Kikuyu ✅ Couch ✅ — NOT Zoysia |
| Battle Insecticide | Bifenthrin | Knockdown contact insecticide | Kikuyu ✅ Couch ✅ — check label for Zoysia |
| Contra M Duo | Metsulfuron + dicamba | Broad-spectrum post-emergent | Kikuyu ✅ Couch ✅ — NOT Zoysia |
| HiCure | Amino acids + peptides (Syngenta) | Biostimulant / abiotic stress | All zones ✅ |

### Transition plan (when current stock runs out)
| Current product | Brand (corrected) | Replace with | Brand |
|-----------------|-------------------|--------------|-------|
| TX10 (5-2-8) | Terralift | TX10 (same) | Terralift — reorder direct |
| Maintain (26-1-9) | LawnPride | 2Spec Elevate (spring/summer) / Endurance (autumn) | Lawn Addicts |
| Liquid Iron 7% | Plant Doctor | Liquid Iron 7% (same — hold, strong product) | Plant Doctor |
| Nature's Soil Wetter | Plant Doctor | Hydrolink Advance | Lawn Addicts |
| Hydramaxx (liquid) | LawnPride | Hydrolink Advance | Lawn Addicts |
| GreenXtra | LawnPride | Fertech Special FeX | Lawn Addicts |
| Tracemaxx | LawnPride | Fertech Fusion | Lawn Addicts |
| Kelpxtra | LawnPride | Fertech Kelpro | Lawn Addicts |
| Activ8EXTRA | Plant Doctor | Fertech Bio | Lawn Addicts |
| Seaweed Secrets | Plant Doctor | Fertech Kelpro / Fertech Bio | Lawn Addicts |
| Stimulus | Lawn Addicts (Fertech) | Fertech Stimulus (same) | Lawn Addicts |
| HiCure | Syngenta (via LA) | HiCure (same) | Lawn Addicts |
| Herbicides / insecticides / fungicides | Various | Same actives, best price | Shop around |


## 16. PROGRAM STRUCTURE (designed 24 May 2026)

### Task structure in program.json
Each month has 4 weeks. Each week has tasks. Each task has:
- id, label, type, notes, zones[], products[]
- zones: back (Kikuyu 68.2m²), front (Zoysia 35.0m²), strip1 (Couch 20.8m²), strip2 (Couch 16.15m²)
- Couch zones treated identically to Kikuyu unless noted otherwise

### Mixing rules (carry forward from old program)
- Kelpxtra: NEVER mix with other concentrates — apply solo
- HiCure: excellent tank-mix partner with liquid fertilisers and micronutrients
- GreenXtra + Tracemaxx: can tank-mix together
- Iron overload caution: reduce Tracemaxx to 100ml/100m² when mixing with GreenXtra at 200ml/100m²
- Dilute all concentrates with water first before combining

### Month-by-month program structure

#### AUTUMN — March, April, May
**Focus:** Pre-emergent (winter grass window), reduce N, boost K, colour maintenance, disease watch going into cooler months.

**March (Week 1–4)**
- Wk 1: Pre-emergent — Spartan (all zones). Dilute well, water in thoroughly.
- Wk 1: Granular fertiliser — Maintain/TX10 blend (Kikuyu+Couch back+strips) | TX10 only (Zoysia — lower N entering autumn)
- Wk 2: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones, autumn dryness)
- Wk 2: Liquid colour — GreenXtra + Tracemaxx tank-mix (all zones)
- Wk 3: Bio-stimulant — Kelpxtra solo (all zones) OR Activ8EXTRA / Seaweed Secrets
- Wk 3: Root stimulant — Stimulus (all zones — root prep ahead of winter)
- Wk 4: HiCure (all zones — begin stress defence program ahead of cooler weather)

**April (Week 1–4)**
- Wk 1: Liquid colour — GreenXtra + Tracemaxx tank-mix (all zones)
- Wk 1: HiCure (all zones — fortnightly)
- Wk 2: Bio-stimulant — Kelpxtra solo (all zones)
- Wk 2: Herbicide (post-emergent) — Bow & Arrow if broadleaf weeds visible (all zones)
- Wk 3: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 3: HiCure (all zones — fortnightly)
- Wk 4: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones)

**May (Week 1–4)**
- Wk 1: Liquid colour — GreenXtra + Tracemaxx tank-mix (all zones)
- Wk 1: HiCure (all zones)
- Wk 2: Bio-stimulant — Kelpxtra solo (all zones)
- Wk 2: Liquid Iron (all zones — deepen colour heading into winter)
- Wk 3: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 3: HiCure (all zones)
- Wk 4: Stimulus — root stimulant (all zones — root maintenance through dormancy)

#### WINTER — June, July, August
**Focus:** Colour maintenance only — minimal N, no granular push. Soil amendment, kelp. Monitor disease. Spray broadleaf weeds if active.

**June (Week 1–4)**
- Wk 1: Liquid colour — GreenXtra + Tracemaxx tank-mix (all zones)
- Wk 1: HiCure (all zones)
- Wk 2: Kelpxtra solo (all zones)
- Wk 2: Liquid Iron (all zones)
- Wk 3: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 3: HiCure (all zones)
- Wk 4: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones)

**July (Week 1–4)**
- Wk 1: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 1: HiCure (all zones)
- Wk 2: Kelpxtra solo (all zones)
- Wk 2: Bio-stimulant — Activ8EXTRA (all zones)
- Wk 3: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 3: HiCure (all zones)
- Wk 4: Tribute — grass weed control if Crowsfoot/Wintergrass active (Zoysia + Couch only — NOT back lawn)
- Wk 4: Bow & Arrow — broadleaf post-emergent if weeds present (all zones)

**August (Week 1–4)**
- Wk 1: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 1: HiCure (all zones)
- Wk 2: Kelpxtra solo (all zones) + Stimulus (root prime ahead of spring)
- Wk 2: Liquid Iron (all zones)
- Wk 3: Granular fertiliser — light application Maintain (Kikuyu+Couch) | TX10 (all zones, soil bio boost) — wake-up feed as growth returns
- Wk 3: HiCure (all zones)
- Wk 4: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones — pre-spring prep)

#### SPRING — September, October, November
**Focus:** Renovation (September), pre-emergent (summer weeds), Acelepryn grub prevention, push N hard, kelp+biostimulants for recovery, disease watch in November humidity.

**September (Week 1–4)**
- Wk 1: Pre-emergent — Spartan (all zones — summer weed window)
- Wk 1: Acelepryn liquid (all zones — grub/caterpillar prevention, season-long)
- Wk 1: Granular fertiliser — Maintain (Kikuyu+Couch) | TX10 (Zoysia)
- Wk 2: RENOVATION — scarify, aerate, topdress (Kikuyu back + Couch strips)
- Wk 2: Stimulus (all zones — post-renovation root recovery)
- Wk 2: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones — renovation moisture)
- Wk 3: Kelpxtra solo (all zones — post-renovation recovery)
- Wk 3: HiCure (all zones)
- Wk 3: Activ8EXTRA or Seaweed Secrets (all zones)
- Wk 4: Granular fertiliser — Maintain (Kikuyu+Couch) | TX10 (Zoysia)
- Wk 4: Liquid colour — GreenXtra + Tracemaxx (all zones)

**October (Week 1–4)**
- Wk 1: Kelpxtra solo (all zones)
- Wk 1: HiCure (all zones)
- Wk 1: Bow & Arrow — broadleaf if needed (all zones)
- Wk 2: Granular fertiliser — Maintain (Kikuyu+Couch) | TX10 (Zoysia)
- Wk 2: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 3: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones — warming soil)
- Wk 3: HiCure (all zones)
- Wk 3: Bio-stimulant — Activ8EXTRA (all zones)
- Wk 4: Stimulus (all zones)
- Wk 4: Liquid colour — GreenXtra + Tracemaxx (all zones)

**November (Week 1–4)**
- Wk 1: Granular fertiliser — Maintain (Kikuyu+Couch) | TX10 (Zoysia)
- Wk 1: Kelpxtra solo (all zones)
- Wk 1: Heritage Maxx — preventative fungicide (all zones — humidity season starting)
- Wk 2: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones)
- Wk 2: HiCure (all zones)
- Wk 2: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 3: Bio-stimulant — Activ8EXTRA or Seaweed Secrets (all zones)
- Wk 3: Tribute — grass weed control (Zoysia front + Couch strips — NOT back Kikuyu)
- Wk 4: Liquid Iron (all zones)
- Wk 4: HiCure (all zones)

#### SUMMER — December, January, February
**Focus:** Peak nutrition, soil wetter every 4 weeks, disease prevention (Heritage Maxx in humid spells), insect knockdown if armyworm/cutworm flare-up, Acelepryn carries season-long from September.

**December (Week 1–4)**
- Wk 1: Granular fertiliser — Maintain (Kikuyu+Couch) | TX10 (Zoysia)
- Wk 1: Kelpxtra solo (all zones)
- Wk 1: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones — critical summer moisture)
- Wk 2: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 2: HiCure (all zones)
- Wk 2: Heritage Maxx — preventative if humid (all zones)
- Wk 3: Bio-stimulant — Activ8EXTRA (all zones)
- Wk 3: Stimulus (all zones)
- Wk 4: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 4: HiCure (all zones)
- Wk 4: Battle Insecticide — knockdown if armyworm/pest activity observed (Kikuyu+Couch)

**January (Week 1–4)**
- Wk 1: Granular fertiliser — Maintain (Kikuyu+Couch) | TX10 (Zoysia)
- Wk 1: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones)
- Wk 1: Kelpxtra solo (all zones)
- Wk 2: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 2: HiCure (all zones)
- Wk 3: Bio-stimulant — Activ8EXTRA or Seaweed Secrets (all zones)
- Wk 3: Liquid Iron (all zones — summer colour deepener)
- Wk 4: HiCure (all zones)
- Wk 4: Liquid colour — GreenXtra + Tracemaxx (all zones)

**February (Week 1–4)**
- Wk 1: Granular fertiliser — Maintain (Kikuyu+Couch) | TX10 (Zoysia)
- Wk 1: Soil wetter — Hydramaxx or Nature's Soil Wetter (all zones)
- Wk 1: Kelpxtra solo (all zones)
- Wk 2: HiCure (all zones)
- Wk 2: Heritage Maxx — preventative fungicide (all zones — late summer disease pressure)
- Wk 2: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 3: Bio-stimulant — Activ8EXTRA (all zones)
- Wk 3: Stimulus (all zones — root prep ahead of autumn)
- Wk 4: HiCure (all zones)
- Wk 4: Liquid colour — GreenXtra + Tracemaxx (all zones)
- Wk 4: Battle Insecticide — if pest activity (Kikuyu+Couch)

### Notes for program.json build
- Couch (strip1 + strip2) always follows Kikuyu tasks unless a task is explicitly Kikuyu-only
- Zoysia (front) gets lighter granular N — TX10 only (not Maintain) through most of year
- Tribute: safe on Zoysia ✅ and common/hybrid Couch ✅ — NOT Kikuyu (will suppress/damage), NOT QLD Blue Couch
- Tribute tasks always exclude back lawn (Kikuyu) — apply to front (Zoysia) + strips (Couch) only
- Tombstone Duo and Contra M Duo: Kikuyu + Couch only, not Zoysia — include as conditional/reactive tasks
- Kelpxtra must NEVER appear in a tank-mix task with other concentrates
- HiCure can tank-mix with GreenXtra+Tracemaxx if desired — excellent chelator partner
- Acelepryn: tiny qty remaining (0.1L) — apply to highest-risk zone (back Kikuyu) only in September
- Heritage Maxx: 1L — use preventatively 2–3× per year (November, December/January, February)
- Spartan 0.5L: enough for 2 applications across 140m² at label rate — March + September
