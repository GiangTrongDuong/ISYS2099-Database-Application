import json

catfile = '../../cat_att_list.json'
nf = './prod.txt'
out = './newprod.txt'

# record object['_id']['$oid'] and object['name']
f = open(catfile)
cats = json.load(f)
record_cat = {}
for cat in cats:
    record_cat[cat["name"]] = cat["_id"]["$oid"]
f.close()
# open db_inserts.sql; replace name with id
input_file  = open(nf, 'r')
output_file = open(out, 'w')
for count,line in enumerate(input_file):
    print("====== Line " + str(count))
    for cat_name in list(record_cat.keys()):
        wrapped_cat = f"\'{cat_name}\'"
        if(wrapped_cat in line):
            print(wrapped_cat)
            modified_line = line.replace(wrapped_cat, f"\'{record_cat[cat_name]}\'")
            output_file.write(modified_line)
            break
# TODO: Get all lowest children cat ids to use in future data gen