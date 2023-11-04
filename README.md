# 리더십 팀 프로젝트 2조

연의23 리더십 팀 프로젝트 2조의 진급요건 계산기 웹 버전입니다.

도움말을 자세히 읽어보시고,

저희 조의 계산기를 사용한 후 만족도 조사에 응답해주세요!

추가 문의사항은 다음 관리자에게 연락해 주세요.

```
조장 : 김세진
총무 : 구민교
기술담당 : 고태욱
```

# 사용 방법 (기본형)
```
진급 요건 계산이 귀찮으신가요?
혹시 놓친 조건은 없는지 확인하고 싶으시다고요?
부전공 계획이 얼마나 완료되었는지 알고 싶으신가요?
```
```
2조의 진급요건 계산기 기본형은 마구리부터 옵세까지, 
모든 동기들에게 알맞은 자동화된 진급요건 계산 서비스를 제공합니다.
```
- 들은 과목 입력법

이미 수강한 과목 정보를 입력할 때는 연세포탈의 성적 확인서를 사용합니다.

```
학사정보시스템 > 성적 > 전체성적조회 > 출력 > 저장
```

출력한 성적 확인서의 모든 텍스트를 드래그 후 복사 붙여넣기 하여 입력할 수 있습니다.

- 들을 과목 입력법

수강 예정인 과목 정보를 입력할 때는 ```학정코드,강의종류,학점수,성적,추가정보(선택)``` 형식으로 입력합니다.

인식되는 강의종류는 ```일반 전기 전선 전필 교직 대교 교기 RC - UICE MB ME CC MR LHP``` 이며,

입력 가능한 성적 종류는 ```A+ A0 A- B+ B0 B- C+ C0 C- D+ D0 D- F P NP``` 입니다.

강의종류를 생략하여 자동인식시킬 수 있으나, 항상 작동하는 것은 아닙니다.

- 과목 검색법

오른쪽 검색창에서 학정코드 또는 강의 이름을 입력하여 검색할 수 있습니다.

버튼을 눌러 검색 범위를 지정할 수 있습니다.

- 특수과목 규칙

인문사회의학 3, 4의 학정코드가 아직 나오지 않은 관계로

이 프로그램에서는 임의로 각각 ```MED2111, MED2112```를 사용합니다.

입력시 이 학정코드를 사용해 주세요.

- 상세정보 확인

F12를 누르고 Console 탭에서 진급요건에 대한 더 자세한 정보를 확인할 수 있습니다.

# FAQ (기본형)

### 성적 확인서 글자 드래그가 안 돼요

문자가 아니라 이미지로 출력된 경우입니다.

```전체성적조회 > 출력 > save > 저장``` 경로를 따랐는지 확인하세요.

추가로 ```문자를 이미지로 표현``` 옵션을 꺼 놓았는지 확인하세요.

### 입력한 정보를 지우고 싶어요

다음과 같이 무의미한 코드를 입력하여 전에 입력한 정보를 지울 수 있습니다.

```
- aaa0000 0 A0     이미 수강한 정보창
aaa0000,,0,A0  ,  이제 수강할 정보창
```

### 입력한 정보를 저장하고 싶어요

이 페이지는 쿠키를 사용하여 지난번에 입력한 수강 과목 정보를 저장합니다.

페이지에 다시 접속해도 정보가 남아 있습니다.

### 사용 예시가 필요해요

```
// 성적 확인서 텍스트 예시
본 정보 학번 2023191000 성명 김연세 학년 1 재학구분 재학 소속 의과대학 의예과
학기 신청 취득 평균 종별 학정번호 분반 교과목명 담당교수 학점 평가 비고
2023학년도 여름학기 6 6 3.85 대교 STA1001 03 통계학입문 이선순 3 A0
전기 STA1002 01 미분적분학 박영자 3 A- 
```

```
// 수강 예정 과목 정보 예시
UCI1175,-,1,P, (연정인)
AIC2130,대교,3,C-
bio1102,대교,3,C+  , 어바.
sta2102,,3,B-
```

# update log

### 2023.09 ~ 2023.10

신기술 공개용 GitHub page 생성. 수강과목 코드 추출 기능, 부전공 조건 정리 툴 공개.

### 2023.10.22

페이지 리뉴얼. 관리자 페이지 개시.

### 2023.10.23

메인페이지 디자인 추가.

### 2023.10.24

사용자 페이지 외형 제작.

### 2023.10.25 ~ 2023.10.26

사용자 페이지 기능 구현. 디자인 개선.

### 2023.10.27

일부 버그 수정. 콘솔창 추가정보 출력 설정.

### 2023.11.01

대학 교양 정보 업데이트.

### 2023.11.03 ~ 2023.11.05

도움말 추가. 크롤링 툴 작성.
