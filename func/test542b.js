// ========== 전처리 영역 ==========

// 검색 모드 0 : 동시, 1 : 코드만, 2 : 과목명만
let premode = 0;

// 코드, 이름 데이터
let prename0 = [ ];
let prename1 = [ ];
let prename2 = [ ];
let prename3 = [ ];

// 파일 읽기
async function readtxt() {
    fetch('../data/name.txt')
	.then( response => response.text() )
        .then( text => prename0 = text.split('\n') )
        .then( text => divtext() )
        .catch(error => document.getElementById("output4").innerHTML = "파일 읽기 오류 : " + error);
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

// 텍스트 초기화
async function initpage() {
    print("txt0", "진급요건 계산기 기본형", 400);
    print("txt1", "들은 강의, 들을 강의를 확인하고 부전공 요건 체크, 진급요건 계산이 가능합니다.", 800);
    const windowed = document.querySelectorAll(".layer1");
    for (let i = 0; i < windowed.length; i++) {
        setTimeout( () => {windowed[i].style.opacity = 1}, 1200 + 400 * i );
        } // 0.1초 간격으로 다음 링크 표시
    print("txt2", "성적조회 pdf 처리", 1200);
    print("output2", "여기에 이미 수강한 과목이 표시됩니다.", 1200);
    print("txt3", "수강할 과목 처리", 1600);
    print("output3", "여기에 앞으로 수강할 과목이 표시됩니다.", 1600);
    print("txt4", "과목코드/과목명 검색", 2000);
    print("output4", "여기에 검색 결과가 표시됩니다.", 2000);
    const exe = document.querySelector(".layer4");
    setTimeout( () => {exe.style.opacity = 1}, 2400 );
}
initpage();

// ========== 공용 함수 영역 ==========

async function print(printer, strin, wait) {
    const tele = document.getElementById(printer);
    for (let i = 0; i < strin.length; i++) {
        setTimeout( () => {tele.textContent += strin[i]}, wait + 30 * i );
        }
}

async function color(printer, mode, wait) {
    const tele = document.getElementById(printer);
    if (mode == 0) {
        setTimeout( () => {tele.style.backgroundColor = "green"}, wait);
    } else if (mode == 1) {
        setTimeout( () => {tele.style.backgroundColor = "lightcoral"}, wait);
    } else {
        setTimeout( () => {tele.style.backgroundColor = "midnightblue"}, wait);
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

// ========== 상호작용 기능 영역 ==========

// 진급요건 계산하기
document.getElementById("button5").addEventListener("click", function() {
    const windowed = document.querySelectorAll(".layer3");
    for (let i = 0; i < windowed.length; i++) {
        windowed[i].innerHTML = "-";
        windowed[i].style.backgroundColor = "royaleblue";
        } // 초기 출력부 숨기기
    let result0 = [
        "<영어성적> : TOEFL iBT 100 / TOEIC 860 / New-Teps 392 중 하나 이상 만족? >>> Pass",
        "<봉사시간> : 예과 2년간 60시간 이상의 봉사시간 채움? >>> Pass",
        "<교양기초> : 글쓰기 / 기독교 / 채플 도합 7학점 이수? >>> Fail",
        "<대학교양/필수교양> : 교양 8영역 중 잉포메 / 통입 포함 6개 이상 이수? >>> Fail",
        "<전공기초> : 어켐 / 어바 이수? >>> Fail",
        "<전공필수> : 전공필수 8개 과목 이수? >>> Pass",
        "<전공선택/자유선택> : 프레시맨 / 리더십팀 포함 -전공과목- 29학점 이상 이수? >>> Pass",
        "<기초교육> : RC / 사회참여 도합 2학점 이수? >>> Pass",
        "<과락여부/평량평균> : F / NP가 없으며 평점 2.3 이상 총 82학점 이상 이수? >>> Pass",
        ".\n최종 진급 여부 : Fail (진급 불가, 평균 4.3, 학점 82)\n."
        ];
    let result1 = [0, 0, 1, 1, 1, 0, 0, 0, 0, 1]; // 0 : P, 1 : F
    let result2 = ["<부전공 진행 정도>\n응용통계학과 부전공 100.0%\n의학AI융합심화전공 87.6%\n컴퓨터프로그래밍 마이크로전공 15.6%\n.",
    "<수강 추천과목>\nSTA1001 (통계학입문)\nSTA1002 (미분적분학)\nMED1112 (인문사회의학1)\n."];

    for (let i = 0; i < 10; i++) {
        print("show" + i.toString(), result0[i], 150 + 1200 * i);
        color("show" + i.toString(), result1[i], 150 + 1200 * i + 30 * result0[i].length);
        } // 진급요건 출력 (10개)
    for (let i = 10; i < 12; i++) {
        print("show" + i.toString(), result2[i - 10], 150 + 1200 * i);
        color("show" + i.toString(), 2, 150 + 1200 * i + 30 * result2[i - 10].length);
    } // 부전공 요건 출력 (2개)
});