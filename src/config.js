export const CONFIG = {
  owner:     'cjj-gmail',
  repo:      'lawn-care-tools',
  branch:    'main',
  workerUrl: 'https://lawn-care-tools.cameronjude1.workers.dev',
  paths: {
    program:     'data/program.json',
    inventory:   'data/inventory.json',
    completions: 'data/completions.json',
    appLog:      'data/applications.json',
    mowLog:      'data/mowing.json',
    waterLog:    'data/watering.json',
    weatherLog:  'data/weather.json',
  },
}

export const ZONES = {
  back:   { name: 'Back Lawn',          grass: 'Kikuyu', area: 68.20 },
  front:  { name: 'Front Lawn',         grass: 'Zoysia', area: 35.00 },
  strip1: { name: 'Front Nature Strip', grass: 'Couch',  area: 20.80 },
  strip2: { name: 'Front Left Strip',   grass: 'Couch',  area: 16.15 },
}

export const ZONE_ORDER = ['back', 'front', 'strip1', 'strip2']

export const TASK_TYPES = [
  'fertilise', 'biostimulant', 'herbicide',
  'fungicide', 'insecticide', 'soilwetter', 'renovation',
]

export const TYPE_COLORS = {
  fertilise:    '#4a7c3f',
  biostimulant: '#7b5ea7',
  herbicide:    '#c0692a',
  fungicide:    '#c0882a',
  insecticide:  '#2a7aa0',
  soilwetter:   '#3a7a8a',
  renovation:   '#6b4c2a',
}

export const MOWER_HEIGHTS = {
  'Honda HRN216':       [27, 39, 51, 64, 76, 88, 100],
  'Allett Stirling 43': [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  'Ozito PXC':          [14, 23, 32, 38],
}

export const HEIGHT_REF = [
  {
    grass: 'Kikuyu', zone: 'Back Lawn',
    mowers: [
      { name: 'Honda HRN216',       type: 'Rotary',   summer: '39-51mm', winter: '51-64mm', note: 'Avoid scalping in winter.' },
      { name: 'Allett Stirling 43', type: 'Cylinder', summer: '15-25mm', winter: '25-35mm', note: 'Cylinder gives a premium finish on Kikuyu.' },
    ],
  },
  {
    grass: 'Zoysia', zone: 'Front Lawn',
    mowers: [
      { name: 'Honda HRN216',       type: 'Rotary',   summer: '27-39mm', winter: '39-51mm', note: "Zoysia is slow-growing - don't cut too low." },
      { name: 'Allett Stirling 43', type: 'Cylinder', summer: '10-20mm', winter: '20-30mm', note: 'Cylinder ideal for Zoysia fine-leaf finish.' },
      { name: 'Ozito PXC',          type: 'Cylinder', summer: '14-23mm', winter: '23mm',    note: 'Lowest setting gives fine-leaf Zoysia a tight finish.' },
    ],
  },
  {
    grass: 'Couch', zone: 'Nature Strips',
    mowers: [
      { name: 'Honda HRN216',       type: 'Rotary',   summer: '27-39mm', winter: '39-51mm', note: 'Couch tolerates lower cuts in warm months.' },
      { name: 'Allett Stirling 43', type: 'Cylinder', summer: '10-20mm', winter: '20-30mm', note: 'Cylinder gives premium stripe finish on Couch.' },
      { name: 'Ozito PXC',          type: 'Cylinder', summer: '14-23mm', winter: '23-32mm', note: 'Good for strips where maneuverability matters.' },
    ],
  },
]

export const CAUTION_ICONS = {
  'iron-overload':               'Fe',
  'kelpxtra-solo':               'SOLO',
  'fungicide-rotation':          'ROT',
  'staining':                    'STAIN',
  'water-in':                    'H2O',
  'no-backpack-sprayer':         'NO BP',
  'low-stock':                   'LOW',
  'pre-emergent-weed-free-first':'WF1st',
  'tank-mix-dilute-first':       'DIL',
  'tribute-not-kikuyu':          '! ZONES',
  'tombstone-not-zoysia':        '! ZONES',
}

export const SEASONS = {
  summer: [12, 1, 2],
  autumn: [3, 4, 5],
  winter: [6, 7, 8],
  spring: [9, 10, 11],
}

export function currentSeason() {
  const mn = new Date().getMonth() + 1
  for (const [s, months] of Object.entries(SEASONS)) {
    if (months.includes(mn)) return s
  }
  return 'summer'
}
