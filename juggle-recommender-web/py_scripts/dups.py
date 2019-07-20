import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)
allTricks = ""
for section in db:
	if section == 'library':
		for pattern in db[section]:
			all_tricks = []
			if 'prereqs' in db[section][pattern] :
				all_tricks.extend(db[section][pattern]['prereqs'])
			if 'related' in db[section][pattern] :
				all_tricks.extend(db[section][pattern]['related'])
			if 'postreqs' in db[section][pattern] :
				all_tricks.extend([section][pattern]['postreqs'])

			if len(all_tricks) != len(set(all_tricks)) :
				print(pattern)
				print('all_tricks',all_tricks)
	# if section == 'users':
	# 	my_accounts = 0
	# 	real_accounts = 0
	# 	for userid in db[section]:
	# 		for prop in db[section][userid]:
	# 			if prop == 'email':
	# 				if 'tjstemp' in db[section][userid][prop]:
	# 					my_accounts += 1
	# 				else:
	# 					real_accounts +=1
		# print('My Accounts:' + str(my_accounts))
		# print('Real Accounts:' + str(real_accounts))
		# print(allTricks)
		