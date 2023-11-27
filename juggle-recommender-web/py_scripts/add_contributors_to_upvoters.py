import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)
allTricks = ""
for pattern in db['library']:
	contributor = ''
	if 'contributor' in db['library'][pattern]:
		contributor = db['library'][pattern]['contributor']
	else:
		contributor = 'loj'
	relationships = ['prereqs','dependents','related']
	for relationship in relationships:
		if relationship in db['library'][pattern] :
			for related_pattern in db['library'][pattern][relationship]:
				if 'upvoters' not in db['library'][pattern][relationship][related_pattern]:
					db['library'][pattern][relationship][related_pattern]['upvoters'] = []
				if contributor not in db['library'][pattern][relationship][related_pattern]['upvoters']:
					db['library'][pattern][relationship][related_pattern]['upvoters'].append(contributor)

with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(json.dumps(db, indent=4, sort_keys=True))		