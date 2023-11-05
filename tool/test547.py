def names():
    with open("name_old.txt", "r", encoding="utf-8") as f:
        old = list( filter( lambda x: "=" not in x, f.readlines() ) )
    with open("name_new.txt", "r", encoding="utf-8") as f:
        new = list( filter( lambda x: "=" not in x, f.readlines() ) )
    temp = [x.split(",") for x in old]
    temp = [x if len(x) == 3 else x + [""] for x in temp]
    old = dict()
    for i in temp:
        if i != "\n":
            old[ i[0] ]  = i[2]
    temp = [x.split(",") for x in new]
    temp = [x if len(x) == 3 else x + [""] for x in temp]
    new = [ ]
    for i in temp:
        new.append( i[0].upper().replace(",", ".") )
        new.append(",")
        new.append( i[1].lower().replace(",", ".") )
        new.append(",")
        if i[0] in old and i[2] == "\n":
            new.append( old[ i[0] ].lower().replace(",", ".") )
        else:
            new.append( i[2].lower() )
    with open("name.txt", "w", encoding="utf-8") as f:
        f.write( "".join(new).replace(" ", "") )

def types():
    with open("type.txt", "r", encoding="utf-8") as f:
        tp = list( filter( lambda x: "=" not in x, f.readlines() ) )
    with open("type.txt", "w", encoding="utf-8") as f:
        f.write( "".join(tp).replace(" ", "") )

def counts():
    with open("count.txt", "r", encoding="utf-8") as f:
        ct = list( filter( lambda x: "=" not in x, f.readlines() ) )
    with open("count.txt", "w", encoding="utf-8") as f:
        f.write( "".join(ct).replace(" ", "") )
    
print("검색기 결과용 컨버터")
try:
    names()
    types()
    counts()
except Exception as e:
    print(e)
input("press ENTER to exit... ")
