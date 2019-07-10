import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)
for user_id in db['myTricks']:
	if 'myTricks' in db['myTricks'][user_id]:
		for trick_key in db['myTricks'][user_id]['myTricks']:
			db['myTricks'][user_id]['myTricks'][trick_key]['starred'] = 'true'

with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(json.dumps(db, indent=4, sort_keys=True))
