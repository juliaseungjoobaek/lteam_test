// 검색 모드 0 : 동시, 1 : 코드만, 2 : 과목명만
let mode = 0;

// 코드, 이름 데이터
let name0 = [ ];
let name1 = [ ];
let name2 = [ ];
let name3 = [ ];

function readtxt() {
    fetch('name.txt')
	.then( response => response.text() )
        .then( text => name0 = text.split('\n') )
        .then( text => divtext() )
        .catch(error => document.getElementById("output1").innerHTML = "파일 읽기 오류 : " + error);
}
function divtext() {
    for (let i = 0; i < name0.length; i++) {
        if ( (name0[i].indexOf("=") == -1) && (name0[i].indexOf(",") != -1) ) {
            let temp = name0[i].split(",");
            name1.push( temp[0] );
            name2.push( temp[1] );
            name3.push( temp[2] );
            }
        }
    }
// 파일 읽기
readtxt();

// 부전공 조건 처리
document.getElementById("convert0").addEventListener("click", function() {
    let data = document.getElementById("input0").value;
    // 데이터 가져오기
    let conv = "==========<br>";
    // 결과물 문자열
    let tp = ['일반', '전기', '전선', '전필', '교직', '대교', '교기', 'RC', '-', 'UICE', 'MB', 'ME', 'CC', 'MR', 'LHP'];
    // 학정코드 타입

    // 줄바꿈을 공백으로
    data = data.replace(/\n/g, " ");
    data = data.replace(//g, "- ");
    // 공백 기반 나누기
    data = data.split(" ");
    for (let i = 0; i < data.length; i++) {
        if (data[i] === "") {
            data.splice(i, 1);
        }
    }

    for (let i = 0; i < tp.length; i++) {
        conv = conv + tp[i] + " : <br>";
        let temp = "";
        for (let j = 0; j < data.length; j++) {
            if ( ispat( data[j] ) ) {
                let tgt = data.slice(j - 2, j + 2);
                if (tgt.indexOf( tp[i] ) != -1) {
                    temp = temp + data[j] + ",";
                    }
                }
            }
        conv = conv + temp + "<br><br>";
        }

    conv = conv + '==========';
    document.getElementById("output0").innerHTML = '변환 결과물 : <br>' + conv + '<br>종료';
    // 결과물 표시
});

// 과목명 검색
document.getElementById("convert1").addEventListener("click", function() {
    let data = document.getElementById("input1").value;
    // 데이터 가져오기
    data = data.replace(/ /g, "");
    // 공백 삭제
    data = data.split('\n');
    for (let i = 0; i < data.length; i++) {
        if (data[i] === "") {
            data.splice(i, 1);
        }
    }
    
    let conv = "검색 결과물 : <br>==========<br>";
    // 검색 결과물
    for (let i = 0; i < data.length; i++) {
        let tgt = data[i];
        conv = conv + tgt + " : <br>";
        switch(mode) {
            case 0:
                conv = conv + sch2( sch0(tgt).concat( sch1(tgt) ) );
                break;
            case 1:
                conv = conv + sch2( sch0(tgt) );
                break;
            case 2:
                conv = conv + sch2( sch1(tgt) );
                break;
            }
        }

    document.getElementById("output1").innerHTML = conv + '==========<br>종료';
    // 결과물 표시
});

// 검색 함수 by code
function sch0(text) {
    let intext = text.toUpperCase();
    let result = [ ];
    for (let i = 0; i < name1.length; i++) {
        if (name1[i].indexOf(intext) != -1) {
            result.push(i);
            }
        }
    return result;
    }

// 검색 함수 by name
function sch1(text) {
    let intext = text.toLowerCase();
    let result = [ ];
    for (let i = 0; i < name2.length; i++) {
        if (name2[i].indexOf(intext) != -1) {
            result.push(i);
            }
        }
    for (let i = 0; i < name3.length; i++) {
        if (name3[i].indexOf(intext) != -1) {
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
            output = output + name1[tgt] + ", " + name2[tgt] + ", " + name3[tgt] + "<br>";
            temp.push(tgt);
            }
        }
    return output + "<br>";
    }

// 모드 전환
document.getElementById("mode1").addEventListener("click", function() {
    mode = (mode + 1) % 3;
    switch(mode) {
        case 0:
            document.getElementById("mode1").innerHTML = '학정코드, 과목명';
            break;
        case 1:
            document.getElementById("mode1").innerHTML = '학정코드';
            break;
        case 2:
            document.getElementById("mode1").innerHTML = '과목명';
            break;
        }
});

// 학정코드 패턴인지 확인
function ispat(inputString) {
  // 문자열을 대문자로 변환
  const upperCaseString = inputString.toUpperCase();

  // 정규 표현식을 사용하여 패턴 일치 여부 확인
  const pattern = /^[A-Z]{3}\d{4}$/;

  return pattern.test(upperCaseString);
}

