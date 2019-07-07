import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)

for section in db:
	if section == 'library':
		print('Patterns:' + str(len(db[section])))
	if section == 'users':
		myAccounts = 0
		realAccounts = 0
		for userid in db[section]:
			for prop in db[section][userid]:
				if prop == 'email':
					if 'tjstemp' in db[section][userid][prop]:
						myAccounts += 1
					else:
						realAccounts +=1
		print('My Accounts:' + str(myAccounts))
		print('Real Accounts:' + str(realAccounts))
		