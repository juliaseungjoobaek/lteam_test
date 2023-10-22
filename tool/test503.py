import PyPDF2
import re
import sys

def hlp():
    text = """
이 프로그램은 교과과정 pdf로부터 학정코드, 수업이름, 수업종류를 추출하고 가공하는 프로그램입니다.
다음과 같은 5개의 모드가 있습니다.

1. help (./pgrname.exe help)
도움말을 출력합니다.

2. search all (./pgrname.exe search text)
학정코드, 한국어이름, 영어이름 중 하나라도 text가 포함된 항목을 검색해 출력합니다.

3. search code (./pgrname.exe searchbycode text)
학정코드에 text가 포함된 항목을 검색해 출력합니다.

4. search name (./pgrname.exe searchbyname text)
한국어이름 또는 영어이름에 text가 포함된 항목을 검색해 출력합니다.

5. convert (./pgrname.exe convert pdfname.pdf)
교과과정 pdf를 해석하여 텍스트 데이터 파일을 생성합니다.

변환 과정은 다음과 같습니다.
pdf파일의 텍스트를 추출하여 text.txt 생성.
text.txt에서 알파벳 3글자 + 숫자 4글자의 조합을 찾아 code.txt 생성.
code.txt의 학정코드 라인의 텍스트를 추출하여 temp.txt 생성.
code.txt의 학정코드에 알맞은 이름을 찾아 쉼표로 구분한 name.txt 생성.
code.txt의 학정코드에 알맞은 강의 종류를 찾아 쉼표로 구분한 type.txt 생성.
"""
    print(text)

def cnv0(fname):
    print('pdf -> text')
    pdf = open(fname, 'rb')
    reader = PyPDF2.PdfReader(pdf)
    page = reader.pages[0]
    text = page.extract_text()
    alltext = ''
    count = 0
    for i in reader.pages:
        alltext = alltext + i.extract_text()
        count = count + 1
        print(f'current page : {count}')
    print(f'alltext length : {len(alltext)}')
    pdf.close()
    with open('text.txt', 'w', encoding = 'utf-8') as f:
        f.write(alltext)

    print('text -> code')
    pattern = re.findall(r'[a-zA-Z]{3}[0-9]{4}', alltext)
    for i in range( 0, len(pattern) ):
        pattern[i] = pattern[i].upper()
    print('pattering clear')
    output = [ ]
    address = [ ]
    for i in pattern:
        if not (i[0:3] in address):
            address.append( i[0:3] )
            output = output + [ [ ] ]
        col = address.index( i[0:3] )
        if not( i in output[col] ):
            output[col].append(i)
    for i in range( 0,len(output) ):
        output[i].sort()
    with open('code.txt', 'w', encoding='utf-8') as f:
        for i in output:
            for j in i:
                f.write(j + '\n')
            f.write('==========\n')

    print('code -> temp')
    with open('text.txt','r',encoding='utf-8') as f:
        txt = f.readlines()
    with open('temp.txt','w',encoding='utf-8') as f:
        alpha = [ chr(x) for x in range(65,91) ]
        num = [ str(x) for x in range(0,10) ]
        print(alpha)
        print(num)
        for i in txt:
            if (i[0] in alpha) and (i[1] in alpha) and (i[2] in alpha):
                if (i[3] in num) and (i[4] in num) and (i[5] in num) and (i[6] in num):
                    if ('(' in i) and (')' in i):
                        f.write(i)
def cnv1():
    print('temp -> name')
    with open('code.txt','r',encoding='utf-8') as f:
        raw0 = [ x.strip() for x in f.readlines() ]
    with open('temp.txt','r',encoding='utf-8') as f:
        raw1 = [ x.strip() for x in f.readlines() ]
    raw2 = [ x[0:7] for x in raw1 ]
    
    with open('name.txt','w',encoding='utf-8') as f:
        for i in raw0:
            f.write(i)
            try:
                if raw2.count(i) == 0:
                    raise Exception('count 0')
                elif raw2.count(i) == 1:
                    temp = raw1[ raw2.index(i) ][7:]
                    tempp = temp.split('(')
                    temp = [ ]
                    for j in tempp:
                        temp = temp + j.split(')')
                    wtmp = [ x.replace(' ','') for x in temp if x != '' ]
                    wlen = [ len(x) for x in wtmp ]
                    temp = len(wlen) - 1
                    while True:
                        if wlen[temp] >= 5:
                            break
                        else:
                            temp = temp - 1
                    f.write( ',' + ''.join( wtmp[0:temp] ).replace(',','&') + ',' + ''.join( wtmp[temp:] ).replace(',','&').lower() )
                else:
                    print(i, '2+')
                    rar = [ ]
                    for j in range( 0,len(raw2) ):
                        if raw2[j] == i:
                            rar.append( raw1[j][7:] )
                    alpha = [ chr(x) for x in range(65,91) ] + [ chr(x) for x in range(97,123) ]
                    alen = [0] * len(rar)
                    for j in range( 0,len(rar) ):
                        temp = 0
                        for k in rar[j]:
                            if k in alpha:
                                temp = temp + 1
                        alen[j] = temp
                    temp = 0
                    for j in range( 0,len(alen) ):
                        if alen[temp] < alen[j]:
                            temp = j
                    temp = rar[temp]
                    tempp = temp.split('(')
                    temp = [ ]
                    for j in tempp:
                        temp = temp + j.split(')')
                    wtmp = [ x.replace(' ','') for x in temp if x != '' ]
                    wlen = [ len(x) for x in wtmp ]
                    temp = len(wlen) - 1
                    while True:
                        if wlen[temp] >= 5:
                            break
                        else:
                            temp = temp - 1
                    f.write( ',' + ''.join( wtmp[0:temp] ).replace(',','&') + ',' + ''.join( wtmp[temp:] ).replace(',','&').lower() )
            except Exception as e:
                print(i,e)
                if i != '==========':
                    f.write(',,')
            f.write('\n')

def cnv2():
    print('text -> type')
    with open('text.txt','r',encoding='utf-8') as f:
        raw = f.read()
    with open('code.txt','r',encoding='utf-8') as f:
        codes = [ x.strip() for x in f.readlines() ]
    types = ['일반', '전기', '전선', '전필', '교직', '대교', '교기', 'RC', '-', 'UICE', 'MB', 'ME', 'CC', 'MR', 'LHP']

    with open('type.txt','w',encoding='utf-8') as f:
        f.write('==========\n')
        for i in range( 0,len(codes) ):
            if codes[i] == '==========':
                f.write('==========\n')
                if i + 1 < len(codes):
                    print(f'chunk : {codes[i+1][0:3]}')
            else:
                f.write( codes[i] + ',')
                try:
                    pattern = '(' + '|'.join(types) + ')\s{0,}' + codes[i]
                    found = re.search(pattern,raw).group()
                    for j in types:
                        if j in found:
                            temp = j
                except:
                    temp = 'unknown'
                f.write(temp + '\n')

def getdt():
    with open('name.txt', 'r', encoding='utf-8') as f:
        temp = [ x.split(',') for x in [y[0:-1] for y in f.readlines() if y != '==========\n'] ]
    temp = [ [x[0] for x in temp], [x[1] for x in temp], [x[2] for x in temp] ]
    # [학정번호 리스트, 한국어이름 리스트, 영어이름 리스트]
    return temp
    
def schcd(codes, text):
    text = text.upper()
    output = [ x for x in range( 0, len(codes) ) if text in codes[x] ]
    return output

def schnm(nm0, nm1, text):
    text = text.lower()
    output = [ x for x in range( 0, len(nm0) ) if text in nm0[x] ] + [ x for x in range( 0, len(nm1) ) if text in nm1[x] ]
    return output

def prtres(res):
    with open('name.txt', 'r', encoding='utf-8') as f:
        temp = [y[0:-1] for y in f.readlines() if y != '==========\n']
    text = [temp[x] for x in res]
    print( '\n'.join(text) )
    print(f'전체 검색 결과 {len(text)} 건')

def main(args):
    if len(args) == 1:
        raise Exception('not enough args')
    if args[1] == 'help':
        hlp()
    elif args[1] == 'search':
        data = getdt()
        temp = schcd( data[0], args[2] ) + schnm( data[1], data[2], args[2] )
        res = [ ]
        for i in temp:
            if i not in res:
                res.append(i)
        prtres(res)
    elif args[1] == 'searchbycode':
        data = getdt()
        temp = schcd( data[0], args[2] )
        res = [ ]
        for i in temp:
            if i not in res:
                res.append(i)
        prtres(res)
    elif args[1] == 'searchbyname':
        data = getdt()
        temp = schnm( data[1], data[2], args[2] )
        res = [ ]
        for i in temp:
            if i not in res:
                res.append(i)
        prtres(res)
    elif args[1] == 'convert':
        cnv0( args[2] )
        cnv1()
        cnv2()
        print('all conversion cleared successfully')
    else:
        raise Exception('unknown args')

try:
    main(sys.argv)
except Exception as e:
    text = f"program error : {e}\n"
    text = text + "execute this program in CMD terminal with argument\n"
    text = text + "command example : ./pgrname.exe help\n"
    print(text)
input("press ENTER to exit... ")
