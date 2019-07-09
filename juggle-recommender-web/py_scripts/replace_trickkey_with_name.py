import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)
key_name_pairs=[]
for key in db['library']:
	if key != db['library'][key]['name'] and not 'contributor' in db['library'][key] and not '.' in db['library'][key]['name']:
		key_name_pairs.append([key,db['library'][key]['name']])

with open("skilldex-4ebb4-export.json") as f:
	new_text=f.read()
	for key_name_pair in key_name_pairs:
		new_text = new_text.replace(key_name_pair[0], key_name_pair[1])
with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(new_text)