import json, re

path = r'C:\Users\camer\lawn-care-tools\data\program.json'

with open(path, 'r', encoding='utf-8') as f:
    prog = json.load(f)

STIZ = {
    "productId": 21,
    "name": "Stimulizer",
    "ratePer100sqm": 3,
    "rateUnit": "mL",
    "note": "Fulvic acid chelator -- enhances uptake of all tank-mix products. Safe with Iron concentrate.",
    "quantities": {
        "back": 2.046,
        "front": 1.05,
        "strip1": 0.624,
        "strip2": 0.484
    }
}

changed = 0
for month in prog['months']:
    for week in month['weeks']:
        if week['week'] != 1:
            continue
        for task in week['tasks']:
            # Find the main tank-mix task: contains GreenXtra in products
            product_names = [p['name'] for p in task.get('products', [])]
            if 'GreenXtra' not in product_names:
                continue
            if 'Stimulizer' in product_names:
                print(f"  Already has Stimulizer: {month['month']} Wk1 {task['id']}")
                continue
            # Add Stimulizer at end of products list
            task['products'].append(STIZ)
            # Update label to include Stimulizer
            if ' + Stimulizer' not in task['label']:
                task['label'] = task['label'] + ' + Stimulizer'
            changed += 1
            print(f"  Updated: {month['month']} Wk1 {task['id']}")

# Update meta
prog['meta']['version'] = '2.3'
prog['meta']['lastUpdated'] = '31/05/2026'

# Update the meta note about tank-mix
for i, note in enumerate(prog['meta']['notes']):
    if 'Main tank-mix: GreenXtra' in note:
        prog['meta']['notes'][i] = (
            "Main tank-mix: GreenXtra + Tracemaxx + HiCure + Stimulizer -- always together on Wk 1"
        )

with open(path, 'w', encoding='utf-8') as f:
    json.dump(prog, f, indent=2, ensure_ascii=False)

print(f"\nDone. {changed} tasks updated. Version bumped to v2.3.")
