import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)
allTricks = ""
for pattern in db['library']:
	relationship_pairs = [['prereqs','dependents'],['dependents','prereqs'],['related','related']]
	for pair in relationship_pairs:
		if pair[0] in db['library'][pattern] :
			for related_pattern in db['library'][pattern][pair[0]]:
				print('related_pattern',related_pattern)
				print('pattern',pattern)
				if related_pattern in db['library']:
					if pair[1] not in db['library'][related_pattern]:
						db['library'][related_pattern][pair[1]] = {}
						db['library'][related_pattern][pair[1]][pattern] = {'source':'contributed'}
					elif pattern not in db['library'][related_pattern][pair[1]]:
						db['library'][related_pattern][pair[1]][pattern] = {'source':'contributed'}

with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(json.dumps(db, indent=4, sort_keys=True))		