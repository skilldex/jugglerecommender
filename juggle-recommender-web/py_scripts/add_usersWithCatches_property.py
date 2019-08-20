import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)

# for pattern in db['library']:
# 	if 'prereqs' in db['library'][pattern] :

for user_id in db['myTricks']:
	if 'myTricks' in user_id:
		for trick_key in user_id['myTricks']:
			print('user_id[myTricks][trick_key]',user_id['myTricks'][trick_key])
			if 'catches' in user_id['myTricks'][trick_key] and int(user_id['myTricks'][trick_key]['catches']) != 0:
				if trick_key in db['library'] and user_id['username'][-1:] != '_':
					if 'usersWithCatches' not in db['library'][trick_key]:
						db['library'][trick_key]['usersWithCatches'] = 1
					else:
						db['library'][trick_key]['usersWithCatches'] += 1
with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(json.dumps(db, indent=4, sort_keys=True))
