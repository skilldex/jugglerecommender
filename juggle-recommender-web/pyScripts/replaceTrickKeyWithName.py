import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)
keyNamePairs=[]
for key in db['library']:
	if key != db['library'][key]['name'] and not 'contributor' in db['library'][key] and not '.' in db['library'][key]['name']:
		keyNamePairs.append([key,db['library'][key]['name']])

with open("skilldex-4ebb4-export.json") as f:
	newText=f.read()
	for keyNamePair in keyNamePairs:
		newText = newText.replace(keyNamePair[0], keyNamePair[1])
with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(newText)