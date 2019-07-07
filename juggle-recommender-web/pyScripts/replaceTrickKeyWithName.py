import json
with open('skilldex-dev-6c0ff-export.json') as f:
    db = json.load(f)
keyNamePairs=[]
for section in db:
	if section == 'library':
		for key in db[section]:
			if key != db[section][key]['name']:
				keyNamePairs.append([key,db[section][key]['name']])

with open("skilldex-dev-6c0ff-export.json") as f:
	newText=f.read()
	for keyNamePair in keyNamePairs:
		newText = newText.replace(keyNamePair[0], keyNamePair[1])
with open("skilldex-dev-6c0ff-export_modified.json", "w") as f:
	f.write(newText)