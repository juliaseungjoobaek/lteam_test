document.getElementById("convert").addEventListener("click", function() {
    let data = document.getElementById("input").value;
    // 데이터 가져오기
    let conv = "==========<br>";
    // 결과물 문자열

    // 줄바꿈을 공백으로
    data = data.replace(/\n/g, " ");
    data = data.replace(//g, "- ");

    // 공백 기반 나누기
    data = data.split(" ");
    for (i = 0; i < data.length; i++) {
        if (data[i] === "") {
            data.splice(i, 1);
        }
    }
    
    // 영문3숫자4 [감지] -> -1 : type, 0 : code
    for (i = 0; i < data.length; i++) {
        if ( ispat( data[i] ) ) {
            conv = conv + data[i] + ',' + data[i - 1] + '<br>';
            }
        }
    
    // (마지막 15 항목 이내) 계 [감지] -> 1 : apply, 2 : get, 3 : gpa
    conv = conv + "==========<br>"
    if (data.length > 15) {
            for (i = data.length - 15; i < data.length; i++) {
                if (data[i] == "계") {
                    conv = conv + data[i + 1] + "," + data[i + 2] + "," + data[i + 3];
                    }
            }
        }
    else {
        conv = conv + "0,0,0.0";
        }
    conv = conv + '<br>==========';
    
    document.getElementById("output").innerHTML = '변환 결과물 : <br>' + conv + '<br>종료';
    // 결과물 표시
});

function ispat(inputString) {
  // 문자열을 대문자로 변환
  const upperCaseString = inputString.toUpperCase();

  // 정규 표현식을 사용하여 패턴 일치 여부 확인
  const pattern = /^[A-Z]{3}\d{4}$/;

  return pattern.test(upperCaseString);
}
