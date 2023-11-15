// ========== 전처리 영역 ==========

// 검색 모드 0 : 동시, 1 : 코드만, 2 : 과목명만
let premode = 0;

// 코드, 이름 데이터
let prename0 = [ ];
let prename1 = [ ];
let prename2 = [ ];
let prename3 = [ ];

// 이름 파일 읽기
async function readtxt0() {
    fetch('../data/name.txt')
	.then( response => response.text() )
        .then( text => prename0 = text.split('\n') )
        .then( () => divtext0() )
        .catch(error => document.getElementById("output4").innerHTML = "파일 읽기 오류 : " + error);
}
async function divtext0() {
    for (let i = 0; i < prename0.length; i++) {
        if ( (prename0[i].indexOf("=") == -1) && (prename0[i].indexOf(",") != -1) ) {
            let temp = prename0[i].split(",");
            prename1.push( temp[0] );
            prename2.push( temp[1] );
            prename3.push( temp[2] );
            }
        }
    }

// 대학 교양 분류
let prebasics0 = [ ];
let prebasics1 = [ ]; // type *10
let prebasics2 = [ ]; // codes []*10

async function readtxt1() {
    fetch("../data/basics.txt")
    .then( response => response.text() )
    .then( text => prebasics0 = text.split("\n") )
    .then( () => divtext1() )
    .then( () => prespecial() ) // 교양 데이터 입력 후 재지정
    .catch(error => document.getElementById("output4").innerHTML = "파일 읽기 오류 : " + error);
}

async function divtext1() {
    let current = "";
    let temp = [ ];
    for (let i = 0; i < prebasics0.length; i++) {
        if (prebasics0[i][0] == "<") {
            if (current != "") {
                prebasics1.push(current);
                prebasics2.push(temp);
            }
            current = prebasics0[i].substring(1, prebasics0[i].length - 2);
            temp = [ ];
        }
        else {
            if (prebasics0[i] != "\r" && prebasics0[i] != "") {
                temp.push( prebasics0[i].replace("\r", "") );
            }
        }
    }
    prebasics1.push(current);
    prebasics2.push(temp);
}

// 부전공 데이터 해석
let preminor0 = [ ];
let preminor1 = [ ];
let preminor2 = [ ];

async function readtxt2() {
    fetch("../data/minors.txt")
    .then( response => response.text() )
    .then( text => preminor0 = text.replace(/\n/g, "").replace(/ /g, "").replace(/\r/g, "").split(";") )
    .then( () => divtext2() )
    .catch(error => document.getElementById("output4").innerHTML = "파일 읽기 오류 : " + error);
}

async function divtext2() {
    preminor0.splice(preminor0.length - 1, 1);
    let current = "";
    let temp = [ ];
    for (let i = 0; i < preminor0.length; i++) {
        if (preminor0[i].substring(0, 2) != "//") {
            if (preminor0[i][0] == "<") {
                if (current != "") {
                    preminor1.push(current);
                    preminor2.push(temp);
                }
                current = preminor0[i].substring(1, preminor0[i].length - 1);
                temp = [ ];
            } else {
                temp.push( preminor0[i] );
            }
        }
    }
    preminor1.push(current);
    preminor2.push(temp);
}

// 코드별 강의종류
async function readtxt3() {
    fetch("../data/type.txt")
    .then( response => response.text() )
    .then( text => pretype0 = text.replace(/\r/g, "").split("\n") )
    .then( () => divtext3() )
    .catch(error => document.getElementById("output4").innerHTML = "파일 읽기 오류 : " + error);
}

async function divtext3() {
    for (let i = 0; i < pretype0.length; i++) {
        let temp = pretype0[i];
        if (temp != "") {
            if (temp[0] != "=") {
                let t = temp.split(",");
                pretype1.push(t[0]);
                pretype2.push(t[1]);
            }
        }
    }
}

let pretype0 = [ ];
let pretype1 = [ ];
let pretype2 = [ ];

// 학점수 인식
async function readtxt4() {
    fetch("../data/count.txt")
    .then( response => response.text() )
    .then( text => precount0 = text.replace(/\r/g, "").split("\n") )
    .then( () => divtext4() )
    .catch(error => document.getElementById("output4").innerHTML = "파일 읽기 오류 : " + error);
}

async function divtext4() {
    for (let i = 0; i < precount0.length; i++) {
        let temp = precount0[i];
        if (temp != "") {
            if (temp[0] != "=") {
                let t = temp.split(",");
                precount1.push(t[0]);
                if (t[1] == "unknown") {
                    precount2.push(3); // unknown -> 3
                } else {
                    precount2.push( Number(t[1]) );
                }
            }
        }
    }
}

let precount0 = [ ];
let precount1 = [ ];
let precount2 = [ ];

// !!!!!!!!!! 특수과목 (문의필요) !!!!!!!!!!
let predouble = ["STA1001", "MED2131"]; // 중복 카운트 가능한 과목
let prechoose = ["CHE1101", "BIO1101"]; // 교양 아닌 전공선택으로 인정되는 과목
let prephysics = ["PHY1001", "PHY1002"]; // 자연과우주 아닌 논리와수리로 인정되는 물리학 과목
async function prespecial() { // 물리학 과목 재지정
    let ins = 0;
    for (let i = 0; i < prebasics1.length; i++) {
        if (prebasics1[i] == "논리와수리") {
            ins = i;
        }
    }
    for (let i = 0; i < prephysics.length; i++) {
        let tgt = prephysics[i];
        let flag = false;
        for (let j = 0; j < prebasics2.length; j++) {
            let temp = prebasics2[j].indexOf(tgt);
            if (temp != -1) {
                flag = true;
                prebasics2[j].splice(temp, 1);
                j--;
            }
        }
        if (flag) {
            prebasics2[ins].push(tgt);
        }
    }
}

// 쿠키 가져오기
function precookie() {
    precookie0 = getCookie("c0"); // listened
    precookie1 = getCookie("c1"); // tolisten
    if (precookie0 == "") {precookie0 = "여기에 이미 수강한 과목이 표시됩니다.";}
    if (precookie1 == "") {precookie1 = "여기에 앞으로 수강할 과목이 표시됩니다.";}
    listened = readtxtcode(precookie0);
    tolisten = readtxtcode(precookie1);
}
let precookie0 = "";
let precookie1 = "";
let listened = [ ]; // 이미 들은 과목 정보
let tolisten = [ ]; // 이제 들을 과목 정보

// 텍스트 초기화
async function initpage() {
    print("txt0", "진급요건 계산기 기본형", 400);
    print("txt1", "들은 강의, 들을 강의를 확인하고 부전공 요건 체크, 진급요건 계산이 가능합니다.", 800);
    const windowed = document.querySelectorAll(".layer1");
    for (let i = 0; i < windowed.length; i++) {
        setTimeout( () => {windowed[i].style.opacity = 1}, 1200 + 400 * i );
        } // 0.1초 간격으로 다음 링크 표시
    print("txt2", "성적조회 pdf 처리", 1200);
    if (precookie0[0] == "*") {
        print2("output2", "현재까지 수강한 과목 :<br>" + precookie0.replace(/\n/g, "<br>"), 1400);
    } else {
        print("output2", precookie0, 1200);
    }
    print("txt3", "수강할 과목 처리", 1600);
    if (precookie1[0] == "*") {
        print2("output3", "앞으로 수강할 과목 :<br>" + precookie1.replace(/\n/g, "<br>"), 1800);
    } else {
        print("output3", precookie1, 1600);
    }
    print("txt4", "과목코드/과목명 검색", 2000);
    print("output4", "여기에 검색 결과가 표시됩니다.", 2000);
    const exe = document.querySelector(".layer4");
    setTimeout( () => {exe.style.opacity = 1}, 2400 );
}

readtxt0();
readtxt1();
readtxt2();
readtxt3();
readtxt4();
precookie();
initpage();
console.log("기본 데이터 로드 완료");

let register0 = [ ]; // 현재 과목 계산 담당 저장소
let register1 = [ ]; // 교양과목 저장소

// ========== 공용 함수 영역 ==========

// 쿠키를 설정하는 함수
function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + cookieValue;
  }
  
// 쿠키를 가져오는 함수
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return '';
}

function readtxtcode(text) { // 텍스트 읽고 학정코드 데이터 리스트 반환
    if (text[0] == "*") {
        let temp = text.substring(1, text.length - 1).replace(/ /g, "").split("\n");
        for (let i = 0; i < temp.length; i++) {
            temp[i] = temp[i].split(",");
        }
        return temp;
    } else {
        return [ ];
    }
}
// *AAA1001, 대교, 3, A+* 형식

async function print(printer, strin, wait) {
    const tele = document.getElementById(printer);
    tele.textContent = "";
    for (let i = 0; i < strin.length; i++) {
        setTimeout( () => {tele.textContent += strin[i]}, wait + 30 * i );
        }
}

async function print2(printer, strin, wait) {
    const tele = document.getElementById(printer);
    setTimeout( () => {tele.innerHTML = strin}, wait);
}

async function color(printer, mode, wait) {
    const tele = document.getElementById(printer);
    if (mode == 0) {
        setTimeout( () => {tele.style.backgroundColor = "green"}, wait);
    } else if (mode == 1) {
        setTimeout( () => {tele.style.backgroundColor = "lightcoral"}, wait);
    } else if (mode == 2) {
        setTimeout( () => {tele.style.backgroundColor = "midnightblue"}, wait);
    } else {
        setTimeout( () => {tele.style.backgroundColor = "royalblue"}, wait);
    }
}

function ispat(inputString) { // 학정코드 패턴인지 확인
    // 문자열을 대문자로 변환
    const upperCaseString = inputString.toUpperCase();
    // 정규 표현식을 사용하여 패턴 일치 여부 확인
    const pattern = /^[A-Z]{3}\d{4}$/;
  
    return pattern.test(upperCaseString);
  }
  
  // 검색 함수 by code
  function sch0(text) {
      let intext = text.toUpperCase();
      let result = [ ];
      for (let i = 0; i < prename1.length; i++) {
          if (prename1[i].indexOf(intext) != -1) {
              result.push(i);
              }
          }
      return result;
      }
  
  // 검색 함수 by name
  function sch1(text) {
      let intext = text.toLowerCase();
      let result = [ ];
      for (let i = 0; i < prename2.length; i++) {
          if (prename2[i].indexOf(intext) != -1) {
              result.push(i);
              }
          }
      for (let i = 0; i < prename3.length; i++) {
          if (prename3[i].indexOf(intext) != -1) {
              result.push(i);
              }
          }
      return result;
      }
  
  // 검색 함수 중복 제거
  function sch2(result) {
      let temp = [ ];
      let output = "";
      for (let i = 0; i < result.length; i++) {
          let tgt = result[i];
          if (temp.indexOf(tgt) == -1) {
              output = output + prename1[tgt] + ", " + prename2[tgt] + ", " + prename3[tgt] + "<br>";
              temp.push(tgt);
              }
          }
      return output + "<br>";
    }

// 강의 수강 요건을 확인하는 함수, 확인 후 제거됨
function checkcode(num, codes) {
    let check = 0;
    for (let i = 0; i < codes.length; i++) {
        for (let j = 0; j < register0.length; j++) {
            if (register0[j][0] == codes[i] && register0[j][3] != "NP" && register0[j][3] != 0.0) {
                if (predouble.indexOf(register0[j][0]) == -1) {
                    register0.splice(j, 1);
                    j--;
                }
                check = check + 1;
                break;
            }
        }
    }
    return check >= num;
}

// 부전공 조건 해석기
function checkminor(state, codes) {
    let order = [ ];
    let temp = "";
    for (let i = 0; i < state.length; i++) {
        if (state[i] == "/") {
            order.push(temp);
            order.push("/");
            temp = "";
        } else if (state[i] == ",") {
            order.push(temp);
            temp = "";
        } else if (state[i] == "|") {
            order.push(temp);
            order.push("|");
            i = i + 1;
            temp = "";
        } else if (state[i] == "&") {
            order.push(temp);
            order.push("&");
            i = i + 1;
            temp = "";
        } else {
            temp = temp + state[i];
        }
    }
    if (temp != "") {
        order.push(temp);
    }
    
    order.push("&");
    order.push(true);
    let start = order.indexOf("/") - 1; // /연산자 시작
    let end = start;
    while (start != -2) {
        temp = start;
        while (order[temp] != "&" && order[temp] != "|") {
            temp = temp + 1;
        }
        end = temp; // /연산자 종료
        temp = 0;
        for (let i = start + 2; i < end; i++) {
            if (codes.indexOf( order[i] ) != -1) {
                temp = temp + 1;
            }
        }
        order.splice(start + 1, end - start - 1);
        if (Number( order[start] ) > temp) {
            order[start] = false;
        } else {
            order[start] = true;
        }
        start = order.indexOf("/") - 1;
    }
    
    temp = order.indexOf("&");
    while (temp != -1) {
        if ( order[temp - 1] && order[temp + 1] ) {
            order.splice(temp, 2);
            order[temp - 1] = true;
        } else {
            order.splice(temp, 2);
            order[temp - 1] = false;
        }
        temp = order.indexOf("&");
    }

    temp = order.indexOf("|");
    while (temp != -1) {
        if ( order[temp - 1] || order[temp + 1] ) {
            order.splice(temp, 2);
            order[temp - 1] = true;
        } else {
            order.splice(temp, 2);
            order[temp - 1] = false;
        }
        temp = order.indexOf("|");
    }

    return order[0];
}

// 대학교양 겹침 테스트기
function checkdouble(name) {
    let flag = false; // 적절한 조합이 존재?
    for (let i = 0; i < register1.length; i++) {
        let tgt0 = [ ]; // 부전공들
        let tgt1 = [ ]; // 교양들
        let temp = true; // 조건 구분자
        for (let j = 0; j < register0.length; j++) {
            tgt0.push( register0[j][0] );
        }
        tgt0.push( register1[i] );
        for (let j = 0; j < register1.length; j++) {
            if (i != j) {
                tgt1.push( register1[j] );
            }
        }

        // 부전공 조건 카운트
        for (let j = 0; j < preminor2[name].length; j++) {
            if ( checkminor(preminor2[name][j], tgt0) == false ) {
                temp = false;
                break;
            }
        }

        let count = 0; // 교양 분야 카운트
        if (tgt1.indexOf("YCF1413") == -1 || tgt1.indexOf("STA1001") == -1) {
            temp = false; // 잉포메 통입 카운트
        }
        for (let j = 0; j < prebasics1.length; j++) {
            let isin = false;
            for (let k = 0; k < prebasics2[j].length; k++) {
                if (tgt1.indexOf( prebasics2[j][k] ) != -1) {
                    isin = true;
                }
            }
            if (isin && prebasics1[j] != "자연과우주" && prebasics1[j] != "생명과환경") {
                count = count + 1;
            }
        }
        if (count < 6) {
            temp = false;
        }

        if (temp) {
            flag = true;
        }
    }

    console.log("부전공 교양 겹침", preminor1[name], flag);
    return flag;
}

// 학기 판단 함수 0 ~ 3
function checksemester(status) {
    let count0 = status[2] + status[3] + status[4] + status[7]; // 1학년에 완료되어야 할 과목들
    let count1 = 0; // 전선.자선 학점수
    for (let i = 0; i < register0.length; i++) {
        count1 = count1 + register0[i][2];
    }
    let count2 = status[5] + status[6]; // 완료되면 거의 예과가 끝인 항목

    if (count2 == 2 && count1 < 22) {
        if (count0 < 2) {
            if (count1 > 17) {
                return 3;
            } else {
                return 2;
            }
        } else {
            if (count1 > 7) {
                return 1;
            } else {
                return 0;
            }
        }
    } else {
        return 3;
    }
}

// 부전공 요건의 학정코드를 가져오는 함수
function getminorcode(state) {
    let order = [ ];
    let temp = "";
    for (let i = 0; i < state.length; i++) {
        if (state[i] == "/") {
            temp = "";
        } else if (state[i] == ",") {
            order.push(temp);
            temp = "";
        } else if (state[i] == "|") {
            order.push(temp);
            i = i + 1;
            temp = "";
        } else if (state[i] == "&") {
            order.push(temp);
            i = i + 1;
            temp = "";
        } else {
            temp = temp + state[i];
        }
    }
    if (temp != "") {
        order.push(temp);
    }
    return order;
}

// ========== 상호작용 기능 영역 ==========

// 수강과목 분석 0
document.getElementById("button2").addEventListener("click", function() { // 버튼 2 기능
    let datain = document.getElementById("input2").value;
    // 데이터 가져오기
    let dataout = "*";
    // 결과물 문자열

    // 줄바꿈을 공백으로
    datain = datain.replace(/\n/g, " ");
    datain = datain.replace(//g, "- ");

    // 공백 기반 나누기
    datain = datain.split(" ");
    for (i = 0; i < datain.length; i++) {
        if (datain[i] === "") {
            datain.splice(i, 1);
            i--;
        }
    }
    
    // 학정코드 인식 -> 성적 인식
    let grade = ["A+", "A0", "A-", "B+", "B0", "B-", "C+", "C0", "C-", "D+", "D0", "D-", "F", "P", "NP"];
    for (let i = 0; i < datain.length; i++) {
        if ( ispat( datain[i] ) ) {
            dataout = dataout + datain[i] + ',' + datain[i - 1] + ',';
        } else if (grade.indexOf( datain[i] ) != -1) {
            dataout = dataout + datain[i - 1] + ',' + datain[i] + "\n";
        }
    }
    
    dataout = dataout.substring(0, dataout.length - 1) + '*';
    precookie0 = dataout;
    listened = readtxtcode(precookie0);
    setCookie("c0", precookie0, 360);
    
    print2("output2", "현재까지 수강한 과목 :<br>" + dataout.replace(/\n/g, "<br>"), 50);
    // 결과물 표시
});

// 수강과목 분석 1
document.getElementById("button3").addEventListener("click", function() { // 버튼 3
    let datain = document.getElementById("input3").value.toUpperCase();
    datain = datain.replace(/ /g, "").split("\n");
    // 데이터 가져오기
    let dataout = "*";
    // 결과물 문자열

    let tp = ['일반', '전기', '전선', '전필', '교직', '대교', '교기', 'RC', '-', 'UICE', 'MB', 'ME', 'CC', 'MR', 'LHP'];
    let cotp = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let i = 0; i < datain.length; i++) {
        if (datain[i] === "") {
            datain.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < datain.length; i++) {
        let temp = datain[i].split(",");
        let a = temp[0];
        let b = temp[1];
        let c = temp[2];
        let d = temp[3];
        if ( ispat(a) ) {
            if (tp.indexOf(b) == -1) {
                b = "unknown";
                for (let j = 0; j < pretype1.length; j++) {
                    if (pretype1[j] == a) {
                        b = pretype2[j];
                        break;
                    }
                }
            }
            if (cotp.indexOf(c) == -1) {
                c = 3;
                for (let j = 0; j < precount1.length; j++) {
                    if (precount1[j] == a) {
                        c = precount2[j];
                        break;
                    }
                }
            }
            dataout = dataout + a + "," + b + "," + c + "," + d + "\n";
        }
    }

    // 결과물 표시
    dataout = dataout.substring(0, dataout.length - 1) + '*';
    precookie1 = dataout;
    tolisten = readtxtcode(precookie1);
    setCookie("c1", precookie1, 360);
    print2("output3", "앞으로 수강할 과목 :<br>" + dataout.replace(/\n/g, "<br>"), 50);
} );

// 모드 전환
document.getElementById("mode4").addEventListener("click", function() { // 모드 4 버튼 기능
    premode = (premode + 1) % 3;
    switch(premode) {
        case 0:
            document.getElementById("mode4").innerHTML = '학정코드, 과목명';
            break;
        case 1:
            document.getElementById("mode4").innerHTML = '학정코드';
            break;
        case 2:
            document.getElementById("mode4").innerHTML = '과목명';
            break;
        }
});

// 과목명 검색
document.getElementById("button4").addEventListener("click", function() { // 버튼 4 기능
    let datain = document.getElementById("input4").value;
    // 데이터 가져오기
    datain = datain.replace(/ /g, "");
    // 공백 삭제
    datain = datain.split('\n');
    temp = [ ];
    for (let i = 0; i < datain.length; i++) {
        if (datain[i] != "") {
            temp.push( datain[i] )
        }
    }
    datain = temp;
    
    let dataout = "";
    // 검색 결과물
    for (let i = 0; i < datain.length; i++) {
        let tgt = datain[i];
        dataout = dataout + tgt + " : <br>";
        switch(premode) {
            case 0:
                dataout = dataout + sch2( sch0(tgt).concat( sch1(tgt) ) );
                break;
            case 1:
                dataout = dataout + sch2( sch0(tgt) );
                break;
            case 2:
                dataout = dataout + sch2( sch1(tgt) );
                break;
            }
        }

    document.getElementById("output4").innerHTML = dataout;
    // 결과물 표시
});

// 진급요건 계산하기
document.getElementById("button5").addEventListener("click", function() {
    const windowed = document.querySelectorAll(".layer3");
    for (let i = 0; i < windowed.length; i++) {
        print("show" + i.toString(), "-", 0);
        color("show" + i.toString(), 3, 0);
        } // 초기 출력부 숨기기

    // 출력부 모으기
    let result0 = ["", "", "", "", "", "", "", "", "", ""];
    let result1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // 0 : P, 1 : F
    let temp = upf0();
    if (document.getElementById("checkbox0").checked) {
        result0[0] = "<영어성적> : TOEFL iBT 100 / TOEIC 860 / New-Teps 392 중 하나 이상 만족? >>> Pass";
        result1[0] = 0;
    } else {
        result0[0] = "<영어성적> : TOEFL iBT 100 / TOEIC 860 / New-Teps 392 중 하나 이상 만족? >>> Fail";
        result1[0] = 1;
    }
    if (document.getElementById("checkbox1").checked) {
        result0[1] = "<봉사시간> : 예과 2년간 60시간 이상의 봉사시간 채움? >>> Pass";
        result1[1] = 0;
    } else {
        result0[1] = "<봉사시간> : 예과 2년간 60시간 이상의 봉사시간 채움? >>> Fail";
        result1[1] = 1;
    }
    if ( upf1() ) {
        result0[2] = "<교양기초> : 글쓰기 / 기독교 / 채플 도합 7학점 이수? >>> Pass";
        result1[2] = 0;
    } else {
        result0[2] = "<교양기초> : 글쓰기 / 기독교 / 채플 도합 7학점 이수? >>> Fail";
        result1[2] = 1;
    }
    if ( upf2() ) {
        result0[3] = "<대학교양/필수교양> : 교양 8영역 중 잉포메 / 통입 포함 6개 이상 이수? >>> Pass";
        result1[3] = 0;
    } else {
        result0[3] = "<대학교양/필수교양> : 교양 8영역 중 잉포메 / 통입 포함 6개 이상 이수? >>> Fail";
        result1[3] = 1;
    }
    if ( upf3() ) {
        result0[4] = "<전공기초> : 어켐 / 어바 이수? >>> Pass";
        result1[4] = 0;
    } else {
        result0[4] = "<전공기초> : 어켐 / 어바 이수? >>> Fail";
        result1[4] = 1;
    }
    if ( upf4() ) {
        result0[5] = "<전공필수> : 전공필수 8개 과목 이수? >>> Pass";
        result1[5] = 0;
    } else {
        result0[5] = "<전공필수> : 전공필수 8개 과목 이수? >>> Fail";
        result1[5] = 1;
    }
    if ( upf5() ) {
        result0[6] = "<전공선택/자유선택> : 프레시맨 / 리더십팀 포함 -전공과목- 29학점 이상 이수? >>> Pass";
        result1[6] = 0;
    } else {
        result0[6] = "<전공선택/자유선택> : 프레시맨 / 리더십팀 포함 -전공과목- 29학점 이상 이수? >>> Fail";
        result1[6] = 1;
    }
    if ( upf6() ) {
        result0[7] = "<기초교육> : RC / 사회참여 도합 2학점 이수? >>> Pass";
        result1[7] = 0;
    } else {
        result0[7] = "<기초교육> : RC / 사회참여 도합 2학점 이수? >>> Fail";
        result1[7] = 1;
    }
    if ( upf7() && temp[2] >= 2.3 && temp[0] >= 82 ) {
        result0[8] = "<과락여부/평량평균> : F / NP가 없으며 평점 2.3 이상 총 82학점 이상 이수? >>> Pass";
        result1[8] = 0;
    } else {
        result0[8] = "<과락여부/평량평균> : F / NP가 없으며 평점 2.3 이상 총 82학점 이상 이수? >>> Fail";
        result1[8] = 1;
    }
    let flag = 0;
    for (let i = 0; i < 9; i++) {
        flag = flag + result1[i];
    }
    if (flag == 0) {
        result0[9] = ".\n최종 진급 여부 : Pass (진급 가능, 평균 " + temp[2].toString().substring(0, 5) + ", 학점 " + temp[0].toString() + ")\n.";
        result1[9] = 0;
    } else {
        result0[9] = ".\n최종 진급 여부 : Fail (진급 불가, 평균 " + temp[2].toString().substring(0, 5) + ", 학점 " + temp[0].toString() + ")\n.";
        result1[9] = 1;
    }

    let result2 = ["<부전공 진행 정도>\n", ""];
    temp = subf0();
    for (let i = 0; i < 3; i++) {
        result2[0] = result2[0] + preminor1[ temp[i][0] ] + " " + (temp[i][1] * 100).toString().substring(0, 5) + "%\n"
    }
    result2[0] = result2[0] + ".";
    result2[1] = subf1(temp);

    for (let i = 0; i < 10; i++) {
        print("show" + i.toString(), result0[i], 150 + 1200 * i);
        color("show" + i.toString(), result1[i], 150 + 1200 * i + 30 * result0[i].length);
        } // 진급요건 출력 (10개)
    for (let i = 10; i < 12; i++) {
        print("show" + i.toString(), result2[i - 10], 150 + 1200 * i);
        color("show" + i.toString(), 2, 150 + 1200 * i + 30 * result2[i - 10].length);
    } // 부전공 요건 출력 (2개)

    if ( subf2(result1) ) {
        alert("경고 : 당신은 예3 위험군입니다.");
    }
});

// ========== 진급요건 계산부 ==========

function upf0() { // 중복 삭제, 특수과목 입력, 전처리
    let output = [ ];
    let grade0 = ["A+", "A0", "A-", "B+", "B0", "B-", "C+", "C0", "C-", "D+", "D0", "D-", "F", "P", "NP"];
    let grade1 = [4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0, "P", "NP"];

    for (let i = 0; i < listened.length; i++) {
        let a = listened[i][0]; // 학정코드
        let b = listened[i][1]; // 강의종류
        let c = parseFloat( listened[i][2] ); // 학점수
        let d = listened[i][3]; // 성적

        if (prechoose.indexOf(a) != -1) {
            b = "전선"; // 전선으로 인정받는 젠바젠켐 등
        }

        for (let j = 0; j < grade0.length; j++) {
            if (grade0[j] == d) {
                d = grade1[j];
            }
        } // 성적 숫자화

        let flag = true;
        for (let j = 0; j < output.length; j++) {
            if (output[j][0] == a) {
                flag = false;
                if (output[j][3] == "P" || output[j][3] == "NP") {
                    if (output[j][3] == "NP" && d == "P") {output[j][3] == "P";}
                } else {
                    if (output[j][3] < d) {output[j][3] == d;}
                }
            }
        }
        if (flag) {
            output.push( [a, b, c, d] );
        } // 중복 삭제
    }

    for (let i = 0; i < tolisten.length; i++) {
        let a = tolisten[i][0]; // 학정코드
        let b = tolisten[i][1]; // 강의종류
        let c = parseFloat( tolisten[i][2] ); // 학점수
        let d = tolisten[i][3]; // 성적

        if (prechoose.indexOf(a) != -1) {
            b = "전선"; // 전선으로 인정받는 젠바젠켐 등
        }

        for (let j = 0; j < grade0.length; j++) {
            if (grade0[j] == d) {
                d = grade1[j];
            }
        } // 성적 숫자화

        let flag = true;
        for (let j = 0; j < output.length; j++) {
            if (output[j][0] == a) {
                flag = false;
                if (output[j][3] == "P" || output[j][3] == "NP") {
                    if (output[j][3] == "NP" && d == "P") {output[j][3] == "P";}
                } else {
                    if (output[j][3] < d) {output[j][3] == d;}
                }
            }
        }
        if (flag) {
            output.push( [a, b, c, d] );
        }
    }
    console.log("수강과목 처리본", output);

    register0 = output;
    let var0 = 0; // 들은 총 학점수
    let var1 = 0; // 들은 성적 평가 대상 학점수
    let var2 = 0.0; // 평랑평균
    for (let i = 0; i < register0.length; i++) {
        var0 = var0 + register0[i][2];
        if (register0[i][3] != "P" && register0[i][3] != "NP") {
            var1 = var1 + register0[i][2];
            var2 = var2 + register0[i][2] * register0[i][3];
        }
    }
    if (var1 != 0) {var2 = var2 / var1;}
    console.log("총학점", var0, "성적학점", var1, "평점", var2);
    return [var0, var1, var2];
}

function upf1() { // 교양기초
    let c0 = ["YCA1005", "YCA1006", "YCA1007", "YCA1008"]; // 채플
    let c1 = ["YCB1101"]; // 글쓰기
    let c2 = ["YCA1101", "YCA1102", "YCA1103"]; // 기독교
    let flag = true;
    if ( checkcode(2, c0) == false ) {
        console.log("채플 조건 불만족");
        flag = false;
    }
    if ( checkcode(1, c1) == false ) {
        console.log("글쓰기 조건 불만족");
        flag = false;
    }
    if ( checkcode(1, c2) == false ) {
        console.log("기독교 조건 불만족");
        flag = false;
    }
    return flag;
}

function upf2() { // 대학교양, 통입 잉포메 포함
    for (let i = 0; i < register0.length; i++) {
        if (register0[i][1] == "대교" && register0[i][3] != 0.0 && register0[i][3] != "NP") {
            register1.push( register0[i][0] );
            if (predouble.indexOf(register0[i][0]) == -1) {
                register0.splice(i, 1);
                i--;
            }
        }
    }
    console.log("대학교양 수강목록", register1);

    let flag = true;
    if (register1.indexOf("YCF1413") == -1 || register1.indexOf("STA1001") == -1) {
        console.log("통입/잉포메 조건 불만족");
        flag = false;
    }
    let count = 0;
    for (let i = 0; i < prebasics1.length; i++) {
        let isin = false;
        for (let j = 0; j < prebasics2[i].length; j++) {
            if (register1.indexOf( prebasics2[i][j] ) != -1) {
                isin = true;
            }
        }
        if (isin && prebasics1[i] != "자연과우주" && prebasics1[i] != "생명과환경") {
            count = count + 1;
        }
    }
    if (count < 6) {
        console.log("수강 교양 영역수", count);
        flag = false;
    }

    return flag;
}

function upf3() { // 전공기초 어바어켐
    if (register1.indexOf("CHE1102") != -1 && register1.indexOf("BIO1102") != -1) {
        return true;
    } else {
        return false;
    }
}

function upf4() { // 전공필수 20학점
    let codes = ["MED1112", "MED1113", "MED2111", "MED2112", "MED1109", "MED2104", "MED2130", "MED2131"]; // 인사의34 학정코드 조회 필요 !!!!!!!!!!!!!
    return checkcode(8, codes);
}

function upf5() { // 전선.자선 29학점
    let tp = ["전필", "전기", "전선", "전탐"];
    let count = 0;
    for (let i = 0; i < register0.length; i++) {
        if (tp.indexOf( register0[i][1] ) != -1 ) {
            if (register0[i][3] != 0.0 && register0[i][3] != "NP") {
                count = count + register0[i][2];
            }
        }
    }
    let flag = 0;
    for (let i = 0; i < register0.length; i++) {
        if (register0[i][0] == "MED1111" || register0[i][0] == "MED1114") {
            flag = flag + 1;
        }
    }
    if (flag < 2) {
        console.log("프레시맨, 리더십팀 조건 불만족");
        count = 0;
    }
    console.log("전공과목 학점수", count);
    if (count < 29) {
        return false;
    } else {
        return true;
    }
}

function upf6() { // 기초교육 2학점
    let codes = ["UCR1015", "UCR1013", "UCR1014"]; // 사참, rc, 자율 등에서 3개 이상 이수
    return checkcode(3, codes);
}

function upf7() { // 남은 f np 존재 확인
    let flag = true;
    for (let i = 0; i < register0.length; i++) {
        if (register0[i][3] == 0.0 || register0[i][3] == "NP") {
            flag = false;
        }
    }
    return flag;
}

function subf0() { // 부전공 진행 척도 3개
    let progress = [ ];
    let codes = [ ];
    for (let i = 0; i < register0.length; i++) {
        codes.push( register0[i][0] );
    }
    for (let i = 0; i < preminor1.length; i++) {
        let pe = 0;
        let ne = 0;
        for (let j = 0; j < preminor2[i].length; j++) {
            if ( checkminor(preminor2[i][j], codes) ){
                pe = pe + 1;
            } else {
                ne = ne + 1;
            }
        }
        progress.push( pe / (pe + ne) );
    }

    for (let i = 0; i < progress.length; i++) {
        if (progress[i] >= 0.5) { // 중복도 조건 확인 기준
            if ( checkdouble(i) ) {
                progress[i] = 1.0;
            }
        }
    }

    let a0 = 0;
    let a1 = 0;
    let a2 = 0;
    for (let i = 0; i < progress.length; i++) {
	if (progress[i] > 0.01) {
	    console.log(preminor1[i], (progress[i] * 100).toString().substring(0, 5) + "%");
	}
    }
    for (let i = 0; i < progress.length; i++) {
        if ( progress[a0] <= progress[i] ){
            a0 = i;
        }
    }
    for (let i = 0; i < progress.length; i++) {
        if (progress[a1] <= progress[i] && a0 != i){
            a1 = i;
        }
    }
    for (let i = 0; i < progress.length; i++) {
        if (progress[a2] <= progress[i] && a0 != i && a1 != i){
            a2 = i;
        }
    }
    return [ [ a0, progress[a0] ], [ a1, progress[a1] ], [ a2, progress[a2] ] ];
}

function subf1(progress) { // 수강 추천과목
    let codes = [ ]; // 들은 과목
    for (let i = 0; i < listened.length; i++) {
        codes.push( listened[i][0] );
    }
    for (let i = 0; i < tolisten.length; i++) {
        codes.push( tolisten[i][0] );
    }
    let candidate = [ ]; // 수강 추천 후보
    for (let i = 0; i < progress.length; i++) {
        if (progress[i][1] < 0.99) {
            for (let j = 0; j < preminor2[ progress[i][0] ].length; j++) {
                let temp = getminorcode( preminor2[ progress[i][0] ][j] );
                for (let k = 0; k < temp.length; k++) {
                    if (codes.indexOf( temp[k] ) == -1 && candidate.indexOf( temp[k] ) == -1) {
                        candidate.push( temp[k] );
                    }
                }
            }
        }
    }
    if (candidate.length < 3) {
        candidate.push("MED2104");
        candidate.push("MED2130");
        candidate.push("MED2131");
    }
    let output = "<수강 추천과목>\n";
    for (let i = 0; i < 3; i++) {
        let temp = sch0( candidate[i] ); // [ ] or [230, 451, 212...]
        if ( temp == [ ] ) {
            temp = "이름 정보 없음";
        } else {
            temp = prename2[ temp[0] ];
            if (temp == "") {
                temp = "이름 정보 없음";
            }
        }
        output = output + candidate[i] + " (" + temp + ")\n";
    }
    output = output + ".";
    return output;
}

function subf2(status) { // 예3 위험도
    let semester = checksemester(status);
    console.log("측정된 학기수", semester + 1);
    if (semester == 3) {
        if (status[0] + status[1] == 2) {
            return true;
        } else if (register0.length < 7){
            return true;
        } else {
            return false;
        }
    } else if (semester == 2 && register0.length < 3) {
        return true;
    } else {
        return false;
    }
}
