// ========== 전처리 기능 영역 ==========

// 검색 모드 0 : 동시, 1 : 코드만, 2 : 과목명만
let premode = 0;

// 코드, 이름 데이터
let prename0 = [ ];
let prename1 = [ ];
let prename2 = [ ];
let prename3 = [ ];

// 파일 읽기
function readtxt() {
    fetch('../data/name.txt')
	.then( response => response.text() )
        .then( text => prename0 = text.split('\n') )
        .then( text => divtext() )
        .catch(error => document.getElementById("output2").innerHTML = "파일 읽기 오류 : " + error);
}
function divtext() {
    for (let i = 0; i < prename0.length; i++) {
        if ( (prename0[i].indexOf("=") == -1) && (prename0[i].indexOf(",") != -1) ) {
            let temp = prename0[i].split(",");
            prename1.push( temp[0] );
            prename2.push( temp[1] );
            prename3.push( temp[2] );
            }
        }
    }
readtxt();

// ========== 범용 기능 함수 영역 ==========

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

// ========== 상호작용 함수 영역 ==========

// 수강과목 분석
document.getElementById("button0").addEventListener("click", function() { // 버튼 0 기능
    let datain = document.getElementById("input0").value;
    // 데이터 가져오기
    let dataout = "==========<br>";
    // 결과물 문자열

    // 줄바꿈을 공백으로
    datain = datain.replace(/\n/g, " ");
    datain = datain.replace(//g, "- ");

    // 공백 기반 나누기
    datain = datain.split(" ");
    for (i = 0; i < datain.length; i++) {
        if (datain[i] === "") {
            datain.splice(i, 1);
        }
    }
    
    // 영문3숫자4 [감지] -> -1 : type, 0 : code
    for (i = 0; i < datain.length; i++) {
        if ( ispat( datain[i] ) ) {
            dataout = dataout + datain[i] + ',' + datain[i - 1] + '<br>';
            }
        }
    
    // (마지막 15 항목 이내) 계 [감지] -> 1 : apply, 2 : get, 3 : gpa
    dataout = dataout + "==========<br>"
    if (datain.length > 15) {
            for (i = datain.length - 15; i < datain.length; i++) {
                if (datain[i] == "계") {
                    dataout = dataout + datain[i + 1] + "," + datain[i + 2] + "," + datain[i + 3];
                    }
            }
        }
    else {
        dataout = dataout + "0,0,0.0";
        }
    dataout = dataout + '<br>==========';
    
    document.getElementById("output0").innerHTML = '변환 결과물 : <br>' + dataout + '<br>종료';
    // 결과물 표시
});

// 부전공 조건 처리
document.getElementById("button1").addEventListener("click", function() { // 버튼 1 기능
    let datain = document.getElementById("input1").value;
    // 데이터 가져오기
    let dataout = "==========<br>";
    // 결과물 문자열
    let tp = ['일반', '전기', '전선', '전필', '교직', '대교', '교기', 'RC', '-', 'UICE', 'MB', 'ME', 'CC', 'MR', 'LHP'];
    // 학정코드 타입

    // 줄바꿈을 공백으로
    datain = datain.replace(/\n/g, " ");
    datain = datain.replace(//g, "- ");
    // 공백 기반 나누기
    datain = datain.split(" ");
    for (let i = 0; i < datain.length; i++) {
        if (datain[i] === "") {
            datain.splice(i, 1);
        }
    }

    for (let i = 0; i < tp.length; i++) {
        dataout = dataout + tp[i] + " : <br>";
        let temp = "";
        for (let j = 0; j < datain.length; j++) {
            if ( ispat( datain[j] ) ) {
                let tgt = datain.slice(j - 2, j + 2);
                if (tgt.indexOf( tp[i] ) != -1) {
                    temp = temp + datain[j] + ",";
                    }
                }
            }
        dataout = dataout + temp + "<br><br>";
        }

    dataout = dataout + '==========';
    document.getElementById("output1").innerHTML = '변환 결과물 : <br>' + dataout + '<br>종료';
    // 결과물 표시
});

// 모드 전환
document.getElementById("mode2").addEventListener("click", function() { // 모드 2 버튼 기능
    premode = (premode + 1) % 3;
    switch(premode) {
        case 0:
            document.getElementById("mode2").innerHTML = '학정코드, 과목명';
            break;
        case 1:
            document.getElementById("mode2").innerHTML = '학정코드';
            break;
        case 2:
            document.getElementById("mode2").innerHTML = '과목명';
            break;
        }
});

// 과목명 검색
document.getElementById("button2").addEventListener("click", function() { // 버튼 2 기능
    let datain = document.getElementById("input2").value;
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
    
    let dataout = "검색 결과물 : <br>==========<br>";
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

    document.getElementById("output2").innerHTML = dataout + '==========<br>종료';
    // 결과물 표시
});
