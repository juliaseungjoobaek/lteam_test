print("텍스트 파일의 =====과 공백을 지웁니다.\n검색기 돌린 결과에 사용하세요.")
name = input("txt name : ")
with open(name, "r", encoding='utf-8') as f:
    temp = f.readlines()
new = [ ]
for i in temp:
    if i[0] != "=":
        new.append( i.replace(" ", "") )
with open(name, "w", encoding="utf-8") as f:
    f.write( "".join(new) )
input("press ENTER to exit... ")
