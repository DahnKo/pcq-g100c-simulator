# PCQ 3급 · G100C 인버터 시뮬레이터

LS ELECTRIC G100C의 키패드 조작 연습을 위한 **비공식 학습 프로젝트**입니다. 2024~2026년 PCQ 3급 공개 기출 48개에서 인버터 관련 내용을 데이터화했습니다.

## 실행하기

- **GitHub Pages:** 저장소의 `Settings → Pages`에서 `Deploy from a branch`, `main`, `/ (root)`를 선택합니다. 공개 주소는 `https://<계정명>.github.io/<저장소명>/` 형태입니다.
- **오프라인 실행:** `offline/G100C_PCQ_시뮬레이터_v12_오프라인.html` 파일을 Chrome/Edge에서 엽니다. JSON·CSS·JS가 단일 파일에 포함되어 있어 인터넷이 없어도 실행됩니다.
- `index.html`은 웹 서버에서 `data/exams-all.json`을 불러옵니다. `file://`로 바로 열 때 일부 브라우저에서는 `fetch`가 제한됩니다.

## 프로젝트 구성

```
index.html                  웹사이트 진입점
css/style.css              스타일
js/app.js                  인버터 LCD, 키 조작, 문제·채점 로직
data/index.json            날짜별 목록 및 개별 JSON 경로, 단자 유형 번호
data/terminal-types.json   P3·P4·P5 단자 배치별 고정 유형 번호
data/exams/YYYY-MM-DD.json  날짜별 원문 추출 및 구조화된 요구사항
data/exams-all.json        프런트엔드용 통합 데이터
/data/exams-summary.csv    48회 비교표
scripts/rebuild_data.py    개별 JSON 수정 이후 목록·통합 데이터·CSV 재생성
scripts/validate_exams.py 데이터 검증
scripts/build_offline.py  단일 HTML 오프라인 파일 재생성
offline/                    만들어진 단일 HTML 파일
.github/workflows/         JSON 검증 자동화
```

## 새 기출 추가 또는 수정하기

1. `data/exams/YYYY-MM-DD.json`을 추가하거나 해당 JSON을 편집합니다. 날짜는 파일명과 `id`, `date` 필드가 일치해야 합니다.
2. `python scripts/rebuild_data.py` 실행
3. `python scripts/validate_exams.py` 실행
4. `python scripts/build_offline.py` 실행
5. 수정된 파일을 GitHub에 commit & push하면 Pages에서 사이트를 다시 배포합니다.

연습/시험 모드의 요구사항은 기출 데이터에서 생성됩니다. 시험모드는 완료 전까지 파라미터 코드와 채점 진행도를 숨기며, `직접 설정` 편집은 연습모드에서만 가능합니다. **연습 → 시험**, **처음 상태로**, **문제 변경**은 확인창을 표시하며 확인하면 인버터 설정과 조작 기록이 초기화됩니다. **시험 → 연습**은 종료 확인만 하고 설정을 유지합니다. 선택한 문제를 다시 선택하면 초기화하지 않습니다. `dr.93`을 통한 인버터 내부 파라미터 초기화는 별도 조작입니다.

## 원본 검토가 필요한 2회

아래 문제에는 **문제지에 기재된 P3/P4/P5의 기능 배치와 다단속 표의 ON/OFF 조합 사이에 불일치**가 있습니다. 자동으로 정정하지 않았으며 원문 그대로 기록했습니다.

- `2024-09-29`: P4=Speed-L, P5=Speed-M인데 1속 행에서 P5만 ON, 2속 행에서 P4만 ON
- `2024-11-14`: P4=Speed-M, P5=Speed-L인데 1속 행에서 P4만 ON, 2속 행에서 P5만 ON

2024년 9월의 일부 기출은 비상정지를 표의 행이 아닌 별도 문장으로 기술합니다. 해당 사실과 문장도 데이터에 남겨 두었습니다.

## 데이터 구조

각 날짜 JSON에는 시험일, 출처 PDF 파일명 및 실제 페이지, 제1과제 단자별 기능·주파수·SS ON/OFF, 제3과제 명칭·RS-485 관련 설정·동작사항, 자동 추출의 검토 상태가 있습니다.

`task3.operationSteps`의 `frequencies_hz`는 **해당 원문 단락에서 발견된 주파수 수치**이며, 모터 운전 명령의 완벽한 상태 머신이나 조건 간 우선순위를 보증하는 값은 아닙니다.

## 구현 범위 및 주의

- 실제 7세그먼트 LCD와 키패드 조작, 일부 파라미터 초기화·설정, BX 및 다단속 주파수 표시, 가상 RS-485 설정 연습을 제공합니다.
- 인버터 전체 제어, 실제 Modbus/PLC 통신, 가·감속 모델, 3과제 PLC 로직은 완전한 에뮬레이션이 아닙니다.
- 원본 PDF 48개와 사용설명서는 이 저장소에 포함하지 않았습니다. 공개 문제지의 재배포 여부는 권리자 정책·이용 허락을 별도로 확인하세요. JSON에 수록된 동작사항 문구 등도 공개 범위를 검토하세요.
- 이 프로젝트는 LS ELECTRIC의 공식 제작물이 아닙니다.

## v1.2: 단자 배치 유형 및 초기화 확인

- 드롭다운의 끝 `*`, `**`, `***`는 각각 단자배치 유형 1/2/3이며 주파수나 3과제 유형은 반영하지 않습니다.
- 유형1: P3 BX / P4 Speed-L / P5 Speed-M (43회)
- 유형2: P3 BX / P4 Speed-M / P5 Speed-L (2회)
- 유형3: P3 Speed-L / P4 Speed-M / P5 BX (3회)
- 새 단자 배치가 들어오면 `python scripts/rebuild_data.py`가 `data/terminal-types.json`에 다음 번호를 추가합니다. 기존 번호는 유지됩니다.
- `js/app.js`에서 `fillExamSelect`(별), `chooseExam`(문제 변경 확인 및 초기화), `setMode`(연습/시험 전환), `newSession`/`resetForNewAttempt`(초기화)를 구현합니다.
- 이전 버전 오프라인 HTML은 역사적 산출물로 남아 있지만, 배포된 사이트의 진입점은 항상 루트 `index.html`입니다.
