import json
total_catch_count = 0

with open('skilldex-4ebb4-export_modified.json') as f:
    db = json.load(f)
for user_id in db['myTricks']:
	if 'myTricks' in db['myTricks'][user_id]:
		for trick_key in db['myTricks'][user_id]['myTricks']:
			if 'catches' in db['myTricks'][user_id]['myTricks'][trick_key]:
				print(db['myTricks'][user_id]['myTricks'][trick_key]['catches'])
				total_catch_count += int(db['myTricks'][user_id]['myTricks'][trick_key]['catches'])
db['stats'] = {}
db['stats']['totalCatchCount'] = total_catch_count

with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(json.dumps(db, indent=4, sort_keys=True))