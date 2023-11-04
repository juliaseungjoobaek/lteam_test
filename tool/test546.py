from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.keys import Keys

import requests
from bs4 import BeautifulSoup

import time
import sys

url0 = "https://underwood1.yonsei.ac.kr/com/lgin/SsoCtr/initExtPageWork.do?link=handbList&locale=ko" # 수강편람 조회

path0 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[1]/div/div' # 순번
path1 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[2]/div/div' # 학기
path2 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[3]/div/div' # 캠퍼스
path3 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[6]/div/div/div' # 과목종류
path4 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[8]/div/div' # 학정번호-분반-실습
path5 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[13]/div/div' # 학점
path6 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[14]/div/div/div' # 과목명
path7 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[15]/div/div/div' # 폐강여부
path8 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[17]/div/div/div' # 강의시간
path9 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[18]/div/div/div' # 강의실
# replace alpha -> 1 ~ n
path10 = '//*[@id="uuid-6w"]/div/div[3]/div/div[3]/div/div[1]/div/div/div/div[1]/div/div/div/div' # 총건수 텍스트

# 마일리지부
m0 = '//*[@id="uuid-6w"]/div/div[3]/div/div[2]/div/div[1]/div/div/div[alpha]/div[12]/div/div' # m button
m1 = '//*[@id="uuid-ew"]/div/div[4]/div/div'
m2 = '//*[@id="uuid-1qn"]/div/div[3]/div/div[2]/div/div[1]/div/div/div/div[22]/div/div' # 평균 마일리지
m3 = '//*[@id="uuid-1rb"]/div' # 닫기 버튼
m4 = '//*[@id="uuid-f1"]/div' # 닫기, 조회 없을 때

input0 = '//*[@id="uuid-5s"]/div/input' # 학정코드 입력부
input1 = '//*[@id="uuid-5w"]/a/div' # 조회버튼

# 반환 령식 : [ [...]... ]

def init(): # 페이지 연결 시작
    #옵션설정
    options = webdriver.EdgeOptions()
    options.add_argument('headless') #헤드레스만
    options.add_argument("disable-gpu")
    options.add_argument('window-size=1920x1080')
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.4044.138 Safari/537.36")

    #드라이버 설정
    global driver
    service = Service("msedgedriver.exe")
    service.creation_flags = 0x08000000
    driver = webdriver.Edge(options=options,service=service)

    #액션 설정
    global action
    action = ActionChains(driver)

    driver.get(url0)
    driver.implicitly_wait(90)
    time.sleep(0.5)

def end(): # 페이지 연결 종료
    global driver
    driver.quit()

def sch(code): # 코드 검색
    global driver
    global action

    temp = driver.find_element(By.XPATH, input0)
    action.move_to_element(temp).perform()
    time.sleep(0.5)

    for i in range(0, 10):
        temp.send_keys(Keys.BACK_SPACE)
    time.sleep(0.5)
    
    temp.send_keys(code)
    driver.implicitly_wait(15)
    time.sleep(0.5)

    temp = driver.find_element(By.XPATH, input1)
    action.move_to_element(temp).perform()
    time.sleep(0.5)
    temp.click()
    driver.implicitly_wait(15)
    time.sleep(3)

    try:
        temp = Alert(driver)
        temp.accept()
    except:
        temp = 0

def find_data(code): # 처음 나오는 종류, 이름, 학점수 반환
    sch(code)
    time.sleep(0.5)

    global driver
    global action

    temp = driver.find_element(By.XPATH, path10)
    temp = temp.text
    number = int( temp[ temp.find("[") + 1:temp.find("]") ] ) # 결과수
    output = ["", "", ""] # 반환 종류, 이름, 학점수

    if number == 0:
        output[0] = "unknown"
        output[2] = "unknown"

    else:
        temp = driver.find_element( By.XPATH, path3.replace( 'alpha', "1" ) )
        output[0] = temp.text
        temp = driver.find_element( By.XPATH, path6.replace( 'alpha', "1" ) )
        output[1] = temp.text
        temp = driver.find_element( By.XPATH, path5.replace( 'alpha', "1" ) )
        output[2] = temp.text

    return output

def conv(): # unknown ,, 만 검색
    init()
    
    with open('name.txt', 'r', encoding='utf-8') as f:
        names = f.readlines()
    with open('type.txt', 'r', encoding='utf-8') as f:
        types = f.readlines()
    with open('count.txt', 'r', encoding='utf-8') as f:
        counts = f.readlines()

    count0 = 0 # name success
    count1 = 0 # still ,,
    count2 = 0 # error
    count3 = 0 # type success
    count4 = 0 # still unknown
    count5 = 0 # error
    count6 = 0 # count success
    count7 = 0 # still unknown
    count8 = 0 # error
    for i in range( 0, len(names) ):
        print(i)
        tgt = names[i]
        if tgt[7:9] == ",,":
            try:
                temp = find_data( tgt[0:7] )
                names[i] = tgt[0:8] + temp[1] + ",\n"
                if temp[1] == "":
                    count1 = count1 + 1
                else:
                    count0 = count0 + 1
            except:
                count2 = count2 + 1

    for i in range( 0, len(types) ):
        print(i)
        tgt = types[i]
        if tgt[8:] == "unknown\n":
            try:
                temp = find_data( tgt[0:7] )
                types[i] = tgt[0:8] + temp[0] + "\n"
                if temp[0] == "unknown":
                    count4 = count4 + 1
                else:
                    count3 = count3 + 1
            except:
                count5 = count5 + 1
                
    for i in range( 0, len(counts) ):
        print(i)
        tgt = counts[i]
        if tgt[8:] == "unknown\n":
            try:
                temp = find_data( tgt[0:7] )
                counts[i] = tgt[0:8] + temp[2] + "\n"
                if temp[2] == "unknown":
                    count7 = count7 + 1
                else:
                    count6 = count6 + 1
            except:
                count8 = count8 + 1

    with open('name.txt', 'w', encoding='utf-8') as f:
        f.write( ''.join(names) )
    with open('type.txt', 'w', encoding='utf-8') as f:
        f.write( ''.join(types) )
    with open('count.txt', 'w', encoding='utf-8') as f:
        f.write( ''.join(counts) )

    end()
    print(f'name {len(names)}\nsuccess {count0}, fail {count1} error {count2}\ntype {len(types)}\nsuccess {count3} fail {count4} error {count5}\ncount {len(counts)}\nsuccess {count6} fail {count7} error {count8}')

def c0(): # 이름 전체 재검색
    init()
    
    with open('name.txt', 'r', encoding='utf-8') as f:
        names = f.readlines()

    count0 = 0 # name success
    count1 = 0 # still ,,
    count2 = 0 # error

    for i in range( 0, len(names) ):
        print(i)
        tgt = names[i]
        if tgt[0] == "=":
            continue
        try:
            temp = find_data( tgt[0:7] )
            if temp[1] == "":
                count1 = count1 + 1
            else:
                names[i] = tgt[0:8] + temp[1] + ",\n"
                count0 = count0 + 1
        except:
            temp = ["unknown", ""]
            count2 = count2 + 1

    with open('name.txt', 'w', encoding='utf-8') as f:
        f.write( ''.join(names) )

    end()
    print(f'name {len(names)}\nsuccess {count0}, fail {count1} error {count2}')

def c1(): # 종류 전체 재검색
    init()
    
    with open('type.txt', 'r', encoding='utf-8') as f:
        types = f.readlines()

    count3 = 0 # type success
    count4 = 0 # still unknown
    count5 = 0 # error

    for i in range( 0, len(types) ):
        print(i)
        tgt = types[i]
        if tgt[0] == "=":
            continue
        try:
            temp = find_data( tgt[0:7] )
            if temp[0] == "unknown":
                count4 = count4 + 1
            else:
                types[i] = tgt[0:8] + temp[0] + "\n"
                count3 = count3 + 1
        except:
            temp = ["unknown", ""]
            count5 = count5 + 1
            
    with open('type.txt', 'w', encoding='utf-8') as f:
        f.write( ''.join(types) )

    end()
    print(f'type {len(types)}\nsuccess {count3} fail {count4} error {count5}')

def c2(): # 학점수 전체 재검색
    init()
    
    with open('count.txt', 'r', encoding='utf-8') as f:
        counts = f.readlines()

    count6 = 0 # count success
    count7 = 0 # still unknown
    count8 = 0 # error

    for i in range( 0, len(counts) ):
        print(i)
        tgt = counts[i]
        if tgt[0] == "=":
            continue
        try:
            temp = find_data( tgt[0:7] )
            if temp[2] == "unknown":
                count7 = count7 + 1
            else:
                counts[i] = tgt[0:8] + temp[2] + "\n"
                count6 = count6 + 1
        except:
            temp = ["unknown", ""]
            count8 = count8 + 1
            
    with open('count.txt', 'w', encoding='utf-8') as f:
        f.write( ''.join(counts) )

    end()
    print(f'count {len(counts)}\nsuccess {count6} fail {count7} error {count8}')

def find_sub(num):
    global driver
    global action

    output = [""] * 9 # 학기 캠퍼스 종류 코드 학점 이름 시간 위치 마일리지
    
    temp = driver.find_element( By.XPATH, path1.replace( 'alpha', str(num) ) ).text
    t = temp[0:4] + '.'
    if '여름' in temp:
        t = t + "s"
    elif '겨울' in temp:
        t = t + "w"
    elif '1학기' in temp:
        t = t + "1"
    elif '2학기' in temp:
        t = t + "2"
    output[0] = t

    temp = driver.find_element( By.XPATH, path2.replace( 'alpha', str(num) ) ).text
    output[1] = temp

    temp = driver.find_element( By.XPATH, path3.replace( 'alpha', str(num) ) ).text
    output[2] = temp

    temp = driver.find_element( By.XPATH, path4.replace( 'alpha', str(num) ) ).text
    output[3] = temp[ 0:temp.find('-') ]

    temp = driver.find_element( By.XPATH, path5.replace( 'alpha', str(num) ) ).text
    output[4] = temp

    temp = driver.find_element( By.XPATH, path6.replace( 'alpha', str(num) ) ).text
    output[5] = temp

    temp = driver.find_element( By.XPATH, path8.replace( 'alpha', str(num) ) ).text
    output[6] = temp

    temp = driver.find_element( By.XPATH, path9.replace( 'alpha', str(num) ) ).text
    output[7] = temp[0]

    temp = driver.find_element( By.XPATH, m0.replace( 'alpha', str(num) ) )
    temp.click()
    driver.implicitly_wait(15)
    time.sleep(0.5)

    temp = driver.page_source
    if '조회된 내역이 없습니다.' in temp:
        output[8] = "0"
        temp = driver.find_element(By.XPATH, m4)
    
    else:
        temp = driver.find_element(By.XPATH, m2).text
        output[8] = temp
        temp = driver.find_element(By.XPATH, m3)
        
    temp.click()
    driver.implicitly_wait(15)
    time.sleep(0.5)

    return output

def find_all(code): # 전체 정보 크롤링
    sch(code)
    time.sleep(0.5)

    global driver
    global action

    output = [""] * 9 # 학기 캠퍼스 종류 코드 학점 이름 시간 위치 마일리지

def main(args):
    if len(args) == 1:
        raise Exception('not enough args')
    if args[1] == 'help':
        text = "모드 0 : unknown만 검색\n모드 1 : 이름 전체 재검색\n모드 2 : 종류 전체 재검색\n3 : 학점수 전체 재검색\n./pgrname.exe 0"
        print(text)
    elif args[1] == '0':
        conv()
    elif args[1] == '1':
        c0()
    elif args[1] == '2':
        c1()
    elif args[1] == '3':
        c2()
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
