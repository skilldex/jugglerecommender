currentTag = 'one-throw'
newTag = 'ss1'
with open("skilldex-dev-6c0ff-export.json") as f:
	currentDB=f.read()
	modifiedDB = currentDB.replace('\"'+currentTag+'\"', '\"'+newTag+'\"')
with open("skilldex-dev-6c0ff-export_modified.json", "w") as f:
	f.write(modifiedDB)