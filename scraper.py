
from bs4 import BeautifulSoup
from urllib.request import urlopen
import re 
import sys
sys.path.append('../')
import sys
import json
sys.path.insert(0, './author-profiling/src/')
sys.path.insert(0, './author-profiling/src/feature')
sys.path.insert(0, './author-profiling/src/feature/readability')
sys.path.insert(0, './author-profiling/src/readability')
tricks = {}

main_url="http://www.libraryofjuggling.com/"
def get_div_contents(url,element_type,el_id):
	main_page=urlopen(url).read()
	soup=BeautifulSoup(main_page,'html.parser')
	div=str(soup.find_all(element_type, {"id":el_id}))
	lines = div.splitlines()
	return lines
tree_lines = get_div_contents(main_url,"div","tree")
num_parsed_tricks = 0
all_tricks = {}
num_tricks = 20
f = open("./trick_relationships.txt", "w") 
for line in tree_lines:	

	if "href" in line and "Tricks/" in line and num_parsed_tricks < num_tricks:
		num_parsed_tricks += 1
		link = line.split("\"")[1]
		trick_name = link.split("/")[2]
		trick_name = trick_name.replace(".html","")
		trick_info = get_div_contents(main_url + link,"ul","otherinfo")
		all_tricks[trick_name] = {}
		all_tricks[trick_name]["prereqs"] = []
		next_line_prereq = False
		for line in trick_info:
			print("LINE " , line)
			if next_line_prereq and "<a" in line:
				match = re.findall("\">(.+)</a", line)
				print("MATCH " ,match)
				if match:
					print(match[0])
					match[0] = match[0].replace(" ","")
					all_tricks[trick_name]['prereqs'].append(match[0])
					f.write(trick_name + " requires " + match[0] + "\n")
			if next_line_prereq and "<li" in line:
				next_line_prereq = False
			if "Prereq" in line:
				next_line_prereq = True
				match = re.findall("\">(.+)</a", line)
				print("MATCH " ,match)
				if match:
					print(match[0])
					match[0] = match[0].replace(" ","")
					all_tricks[trick_name]['prereqs'].append(match[0])
					f.write(trick_name + " requires " + match[0] + "\n")

f.close()
print(json.dumps(all_tricks, indent = 4, separators = (",",": ")))