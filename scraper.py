
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
num_tricks = 200
f = open("./trick_relationships.txt", "w") 
current_ball_num = 0
for line in tree_lines:	
	if 'Three Ball Patterns' in line:
		current_ball_num = 3
	if 'Four Ball Patterns' in line:
		current_ball_num = 4
	if 'Five Ball Patterns' in line:
		current_ball_num = 5
	if 'Six Ball Patterns' in line:
		current_ball_num = 6
	if "href" in line and "Tricks/" in line and num_parsed_tricks < num_tricks:
		num_parsed_tricks += 1
		link = line.split("\"")[1]
		trick_name = link.split("/")[2]
		trick_name = trick_name.replace(".html","")
		trick_name_with_spaces = line.split(">")[2]
		trick_name_with_spaces = trick_name_with_spaces.split("<")[0]
		trick_info = get_div_contents(main_url + link,"ul","otherinfo")
		all_tricks[trick_name] = {}
		all_tricks[trick_name]["prereqs"] = []
		all_tricks[trick_name]["related"] = []
		all_tricks[trick_name]["url"] = main_url + link
		all_tricks[trick_name]['name'] = trick_name_with_spaces
		all_tricks[trick_name]['num'] = current_ball_num
		next_line_prereq = False
		next_line_related = False
		for line in trick_info:
			#print("LINE " , line)
			if "Related" in line:
				next_line_prereq = False
			if next_line_prereq and "<a" in line:
				match = re.findall("\">(.+)</a", line)
				#print("MATCH " ,match)
				if match:
					#print(match[0])
					all_tricks[trick_name]['prereqs'].append(match[0])
					f.write(trick_name + " requires " + match[0] + "\n")
			if next_line_related and "<a" in line:
				match = re.findall("\">(.+)</a", line)
				#print("MATCH " ,match)
				if match:
					#print(match[0])
					all_tricks[trick_name]['related'].append(match[0])
					f.write(trick_name + " related " + match[0] + "\n")
			if next_line_prereq and "<li" in line:
				next_line_prereq = False
			if next_line_related and "<li" in line:
				next_line_related = False
			if "Prereq" in line:
				next_line_prereq = True
				match = re.findall("\">(.+)</a", line)
				#print("MATCH " ,match)
				if match:
					#print(match[0])
					all_tricks[trick_name]['prereqs'].append(match[0])
					f.write(trick_name + " requires " + match[0] + "\n")
			if "Related" in line:
				next_line_related = True
				#next_line_prereq = False
				match = re.findall("\">(.+)</a", line)
				#print("MATCH " ,match)
				if match:
					#print(match[0])
					all_tricks[trick_name]['related'].append(match[0])
					f.write(trick_name + " related " + match[0] + "\n")

'''all_tricks['FourBallWindmill']["prereqs"] = ['Windmill','Fountain','Four Ball Mills Mess']
all_tricks['534MillsMess']["prereqs"] = ["Four Ball Mills Mess",'534',"531 Mills Mess"]
all_tricks['ChopShower']["prereqs"] = ["Windmill",'Crossed-Arm Reverse Cascade']
all_tricks['ChopShower']["related"] = ["Chops",'Frantic Cascade',"Statue of Liberty"]
all_tricks['Takearound']["prereqs"] = ["Takeouts",'Flying Disco Drop']
all_tricks["Shuffler'sMess"]["prereqs"] = ["531",'Mills Mess','531 Mills Mess']
all_tricks["Levels"]["prereqs"] = ["N-Box","Luke's Shuffle"]
all_tricks["Frostbite"]["related"] = ["Kraken","Kato's Crux","Shuffler's Mess"]
all_tricks["FlyingDiscoDrop"]["prereqs"] = ["Shower","Orka's Mess","Hands of Time"]
all_tricks["TrueBox"]["prereqs"] = ["Box","Inverted Shower"]'''

f.close()
print(json.dumps(all_tricks, indent = 4, separators = (",",": ")))

with open('./jugglingLibrary.js', 'w') as outfile:  
    json.dump(all_tricks, outfile, indent = 4, separators = (",",": "))