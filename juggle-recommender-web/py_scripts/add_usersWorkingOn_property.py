import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)

# for pattern in db['library']:
# 	if 'prereqs' in db['library'][pattern] :

for trick_key in db['library']:
	db['library'][trick_key]['usersWorkingOn'] = 0
	db['library'][trick_key]['usersWithCatches'] = 0


for user_id in db['myTricks']:
	if 'myTricks' in user_id:
		for trick_key in user_id['myTricks']:
			should_add = False
			#print(trick_key, 'user_id[myTricks][trick_key]',user_id['myTricks'][trick_key])
			if 'catches' in user_id['myTricks'][trick_key]:
				if int(user_id['myTricks'][trick_key]['catches']) != 0:
					should_add = True
					if trick_key in db['library']:
						if 'usersWithCatches' not in db['library'][trick_key]:
							db['library'][trick_key]['usersWithCatches'] = 1
						else:
							db['library'][trick_key]['usersWithCatches'] += 1
			if 'baby' in user_id['myTricks'][trick_key] and user_id['myTricks'][trick_key]['baby'] == 'true':
				#print('has a baby ', trick_key)
				should_add = True
			if 'ninja' in user_id['myTricks'][trick_key] and user_id['myTricks'][trick_key]['ninja'] == 'true':
				should_add = True
			if trick_key in db['library'] and user_id['username'][-1:] == "_":
				should_add = False
			if should_add == True and trick_key in db['library']:
				if 'usersWorkingOn' not in db['library'][trick_key]:
					db['library'][trick_key]['usersWorkingOn'] = 1
				else:
					db['library'][trick_key]['usersWorkingOn'] += 1


with open("skilldex-4ebb4-export_modified.json", "w") as o:
	o.write(json.dumps(db, indent=4, sort_keys=True))
