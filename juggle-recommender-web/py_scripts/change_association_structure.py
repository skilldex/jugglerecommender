import json
with open('skilldex-4ebb4-export.json') as f:
    db = json.load(f)
allTricks = ""
pattern_count = 0
for pattern in db['library']:
	pattern_count +=1
	if 'prereqs' in db['library'][pattern] :
		new_prereqs = {}
		for prereq in db['library'][pattern]['prereqs']:
			prereqKey = prereq.replace('[','({').replace(']','})').replace('/','-')
			new_prereqs[prereqKey] = {'source':'contributed'}
			#print(prereqKey)
		db['library'][pattern]['prereqs'] = new_prereqs
	if 'related' in db['library'][pattern] :
		new_related = {}
		for related in db['library'][pattern]['related']:
			relatedKey = related.replace('[','({').replace(']','})').replace('/','-')
			new_related[relatedKey] = {'source':'contributed'}
			#print(relatedKey)
		db['library'][pattern]['related'] = new_related
	if 'dependents' in db['library'][pattern] :
		new_dependents = {}
		for dependent in db['library'][pattern]['dependents']:
			dependentKey = dependent.replace('[','({').replace(']','})').replace('/','-')
			new_dependents[dependentKey] = {'source':'contributed'}
			#print(dependentKey)
		db['library'][pattern]['dependents'] = new_dependents

with open("skilldex-4ebb4-export_modified.json", "w") as f:
	f.write(json.dumps(db, indent=4, sort_keys=True))		