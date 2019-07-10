import json
with open('skilldex-4ebb4-export_modified.json') as f:
    db = json.load(f)
db['leaderboard'] = {}
for user_id in db['myTricks']:
	if 'myTricks' in db['myTricks'][user_id]:
		for trick_key in db['myTricks'][user_id]['myTricks']:
			if 'catches' in db['myTricks'][user_id]['myTricks'][trick_key] and int(db['myTricks'][user_id]['myTricks'][trick_key]['catches'])>0:
				if trick_key not in db['leaderboard']:
					db['leaderboard'][trick_key] = {}
					db['leaderboard'][trick_key]['user'] = db['myTricks'][user_id]['username']
					db['leaderboard'][trick_key]['trick'] = trick_key
					db['leaderboard'][trick_key]['catches'] = db['myTricks'][user_id]['myTricks'][trick_key]['catches']
				elif int(db['myTricks'][user_id]['myTricks'][trick_key]['catches']) > int(db['leaderboard'][trick_key]['catches']):
					db['leaderboard'][trick_key] = {}
					db['leaderboard'][trick_key]['user'] = db['myTricks'][user_id]['username']
					db['leaderboard'][trick_key]['trick'] = trick_key
					db['leaderboard'][trick_key]['catches'] = db['myTricks'][user_id]['myTricks'][trick_key]['catches']
with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(json.dumps(db, indent=4, sort_keys=True))

