import urllib.request
from bs4 import BeautifulSoup
import sys
import json
import re 


base_site = 'http://davesgarden.com/guides/pf/'
baser_site = 'https://davesgarden.com'
default_flower = 'http://bigbouquet.com.au/bigbouquet/wp-content/uploads/2016/01/Aliance.jpg'
isSearch = False
if sys.argv[1].isdigit():
	# print("plant scrape")
	urlpull = base_site + 'go/' + sys.argv[1]
else:
	searchSeq = '%20'.join(sys.argv[1:])
	# print("plant search")
	isSearch = True
	# urlpull = base_site + 'search/results.php?gralcom=' + searchSeq
	urlpull = 'http://davesgarden.com/sitewidesearch.php?q=' + searchSeq + '&Search=Search'




html = ""
req = urllib.request.Request(urlpull, headers={'User-Agent' : "Magic Browser"}) 
with urllib.request.urlopen(req) as response:
   html = response.read()
# https://stackoverflow.com/questions/23377533/python-beautifulsoup-parsing-table

soup = BeautifulSoup(html,"html.parser")
# print(soup)
# allDicts = []
allDicts = {}
if isSearch:

	dumbCheck = soup.find(text = 'Plant name')
	# print(dumbCheck)
	if dumbCheck != None:
		temp = soup.find(text = 'Plant name').parent.parent.parent.parent
		# print("tehmp is")
		# print(temp)
		row = temp.findNextSibling('tr')

		while row:
			d = {}
			# print("---------------------------")
			# print(row)
			# print(row.find_all('a'))
			# print("link")
			# print(row.a['href'])
			d['link'] = row.a['href']
			d['id'] = re.sub("\D","", d['link'])
			# print(re.sub("\D","", d['link']))

			# print(type(d['link']))
			# print("normal name")
			# print(row.find_all('a')[-1].contents[0])
			d['normal'] = str(row.find_all('a')[-1].contents[0])
			# print(type(d['normal']))
			# print("science")
			# print(row.i.contents[0])
			d['scientific'] = row.i.contents[0]


			# print(row.find_all('img'))
			# if len(row.find_all('a')) > 1:
			# 	# print("img info")
			# 	# print(row.img['src'])
			# 	# print(row.img['alt'])
			# 	d['imgLink'] = row.img['src']
			# 	d['imgAlt'] = row.img['alt']
			if d['normal'] != '<br/>' and len(row.find_all('a')) > 1:
				d['imgLink'] = row.img['src']
				d['imgAlt'] = row.img['alt']
				# allDicts.append(d)
				allDicts[d['id']] = d
			row = row.findNextSibling('tr')

else:
	dumbCheck = soup.find(text = 'Not found')
	if dumbCheck == None:
		d={}
		row = soup.h1
		d['name'] = row.contents[0]
		row = soup.h2
		d['scientific'] = row.contents[0]



		row = soup.h4

		# print(temp)
		while row:
			temp = row.findNextSibling()
			# print(row.contents[0][:-1])
			# print(temp.contents[0])
			if type(temp.contents[0]) == type(row.contents[0]):
				# print(type())
				d[row.contents[0][:-1]] = temp.contents[0]
			row = row.findNextSibling('h4')

		if 'Water Requirements' in d:
			if 'high moisture' in d['Water Requirements']:
				d['Water Requirements'] = 1
			elif 'Drought' in d['Water Requirements']:
				d['Water Requirements'] = 5
			else:
				d['Water Requirements'] = 3
		else:
			d['Water Requirements'] = 3

		imgCrop = soup.find(src=re.compile("widht")) #yes that is how it is spelt on the site dont shoot the messenger ok
		if imgCrop:
			d['imgCrop'] = baser_site + imgCrop['src']
		else:
			d['imgCrop'] = default_flower
		allDicts = d


print(json.dumps(allDicts))

# print(row)

# print(urlpull)
#print(html)
#print("hello world")