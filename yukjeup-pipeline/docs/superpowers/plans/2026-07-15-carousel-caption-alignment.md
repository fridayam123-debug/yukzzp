# Carousel Caption Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 선택된 캡션과 캐러셀의 세 질문을 동일한 표현으로 통일하고, 브랜드 증거 슬라이드를 추가한 8장 PNG를 만든다.

**Architecture:** `03_script.md`와 `05_caption.md`를 콘텐츠 소스로 확정하고, 단일 `slides.html` 안의 8개 `.slide` 프레임으로 구현한다. 프로젝트 렌더러를 1배율 1080×1440 출력으로 고친 뒤 Playwright로 01~08.png를 생성하고 자동·시각 검증한다.

**Tech Stack:** HTML/CSS, Node.js, Playwright, Vitest, PNG

## Global Constraints

- 캔버스는 정확히 1080×1440이다.
- 사진은 `docs/PHOTO_LIBRARY.md`의 S/A 등급만 사용한다.
- Fraunces와 Pretendard 두 폰트만 사용한다.
- 전면 균일 딤은 금지하고 텍스트 존 그라디언트만 사용한다.
- 텍스트는 좌우·상단 80px 안쪽, 핵심 문구는 하단 120px 밖에 둔다.
- 브랜드 사실은 `docs/00_BRAND.md`의 증거 자산만 사용한다.
- 2026-07-14 결과물은 변경하지 않는다.

---

### Task 1: 렌더러를 정확한 1080×1440 출력으로 고정

**Files:**
- Modify: `C:/Users/pc/Desktop/j project/tests/unit/render-slides.test.ts`
- Modify: `C:/Users/pc/Desktop/j project/yukjeup-pipeline/scripts/render_slides.js`

**Interfaces:**
- Consumes: 입력 폴더의 `slides.html`과 `.slide` 요소
- Produces: 출력 폴더의 `01.png~NN.png`, 각 1080×1440

- [ ] **Step 1: PNG 크기 회귀 테스트 추가**

```ts
import { readFileSync } from "node:fs";

const files = readdirSync(output).sort();
expect(files).toEqual(["01.png", "02.png"]);

for (const file of files) {
  const png = readFileSync(path.join(output, file));
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBe(1440);
}
```

- [ ] **Step 2: 테스트가 현재 2배율 출력에서 실패하는지 확인**

Run: `npm test -- --run tests/unit/render-slides.test.ts` from `C:/Users/pc/Desktop/j project`

Expected: FAIL with received width `2160` or height `2880`.

- [ ] **Step 3: 렌더 배율과 폰트 대기를 수정**

```js
const page = await browser.newPage({
  viewport: { width: 1080, height: 1440 },
  deviceScaleFactor: 1,
});

await page.goto('file://' + single);
await page.evaluate(() => document.fonts.ready);
```

개별 파일 모드에서도 `page.goto` 다음에 `document.fonts.ready`를 동일하게 실행한다.

- [ ] **Step 4: 렌더러 테스트 통과 확인**

Run: `npm test -- --run tests/unit/render-slides.test.ts`

Expected: PASS, 1 test passed.

- [ ] **Step 5: 렌더러 수정 커밋**

```bash
git add tests/unit/render-slides.test.ts yukjeup-pipeline/scripts/render_slides.js
git commit -m "fix: render carousel slides at 1080x1440"
```

### Task 2: 스크립트와 확정 캡션 동기화

**Files:**
- Modify: `C:/Users/pc/Desktop/j project/yukjeup-pipeline/output/2026-07-15/03_script.md`
- Modify: `C:/Users/pc/Desktop/j project/yukjeup-pipeline/output/2026-07-15/05_caption.md`

**Interfaces:**
- Consumes: 승인된 8장 디자인 스펙과 사용자가 선택한 캡션
- Produces: HTML 문구의 단일 콘텐츠 기준

- [ ] **Step 1: `03_script.md`를 8장 구조로 변경**

다음 문구를 정확히 반영한다.

```markdown
- 유형: SAVE (체크리스트형) / 총 8장
- 저장 앵커: 6번 페이지

2. 인트로
- 미니제목: 답은 세 가지입니다
- 상세설명: 연기 · 굽기 · 룸 — 맛집 검색보다 먼저 확인하세요.

4. 체크 ②
- 미니제목: ② 고기는 누가 굽나요?
- 부가 설명: 전담 서버 그릴링

5. 체크 ③
- 미니제목: ③ 인원에 맞는 룸이 있나요?
- 부가 설명: 4~40인 룸

7. 맛의 근거
- 미니제목: 맛의 근거도 있습니다
- 증거: 산청 흑돼지 · 특허 파동숙성
- 증거: 정육왕 블라인드 테스트 — 한국 5대 프리미엄 돼지 중 밸런스 1위
- 증거: 이원일 셰프 · 211TV 소개

8. 엔드
- 행동 유도 문구: 6번째 장을 지금 저장해두세요
```

- [ ] **Step 2: `05_caption.md`를 선택된 최종 캡션으로 교체**

```text
양재역 회식 장소나 을지로 회식 장소를 고를 때 무엇을 확인해야 할까요?

답은 세 가지입니다. 연기가 아래로 빠지는지, 고기는 누가 굽는지, 인원에 맞는 룸이 있는지 확인하세요.

육즙관리소 양재역점과 더룸 을지로점은 연기를 테이블 아래로 배출하는 하향식 덕트를 사용합니다. 전담 서버가 처음부터 끝까지 고기를 구워 손님은 대화에 집중할 수 있고, 4인 소회식부터 40인 부서 회식까지 인원에 맞는 룸을 선택할 수 있습니다.

맛의 근거도 있습니다. 산청 흑돼지를 특허 파동숙성으로 관리하며, 정육왕 블라인드 테스트에서 한국 5대 프리미엄 돼지 중 밸런스 1위로 선정됐습니다. 이원일 셰프가 211TV에서 소개한 흑돼지 맛집이기도 합니다.

예약 전에 꺼내 쓸 3초 체크리스트는 6번째 장에 있습니다. 지금 저장해두세요.

#양재역회식 #을지로회식 #회식장소 #회식장소추천
#양재역맛집 #을지로맛집 #흑돼지맛집 #룸식당
#전담서버 #육즙관리소 #더룸을지로
```

- [ ] **Step 3: 콘텐츠 소스 검증**

Run:

```powershell
rg -n "총 8장|고기는 누가 굽나요|인원에 맞는 룸이 있나요|맛의 근거도 있습니다|6번째 장" output/2026-07-15/03_script.md output/2026-07-15/05_caption.md
```

Expected: 두 파일에서 승인 문구가 모두 검색된다.

- [ ] **Step 4: 콘텐츠 소스 커밋**

```bash
git add yukjeup-pipeline/output/2026-07-15/03_script.md yukjeup-pipeline/output/2026-07-15/05_caption.md
git commit -m "content: align carousel script with selected caption"
```

### Task 3: `slides.html`을 8장으로 확장

**Files:**
- Modify: `C:/Users/pc/Desktop/j project/yukjeup-pipeline/output/2026-07-15/design/slides.html`

**Interfaces:**
- Consumes: Task 2의 확정 문구와 `assets/photos/yukjeup-menu-04.jpg`, `yukjeup-menu-05.jpg`
- Produces: Playwright가 캡처할 8개 `.slide` 요소

- [ ] **Step 1: 기존 질문·인트로·저장 앵커 문구 통일**

```html
<!-- 02 -->
<h2>답은 세 가지입니다</h2>
<div class="body">연기 · 굽기 · 룸 — 맛집 검색보다 먼저 확인하세요.</div>

<!-- 04 -->
<h2>② 고기는<br>누가 굽나요?</h2>
<div class="note">전담 서버 그릴링</div>

<!-- 05 -->
<h2>③ 인원에 맞는<br>룸이 있나요?</h2>
<div class="note">4~40인 룸</div>

<!-- 06 -->
<div class="q">연기, 아래로 빠지나요?</div>
<div class="q">고기는 누가 굽나요?</div>
<div class="q">인원에 맞는 룸이 있나요?</div>
```

- [ ] **Step 2: 07 증거 슬라이드 추가**

```html
<!-- 07 PROOF — yukjeup-menu-04 (S) -->
<div class="slide">
  <div class="photo" style="background-image:url('../../../assets/photos/yukjeup-menu-04.jpg');background-position:center 0%;"></div>
  <div class="scrim-top" style="background:linear-gradient(180deg,rgba(26,26,26,.72) 0%,rgba(26,26,26,.46) 34%,rgba(26,26,26,0) 58%);"></div>
  <div class="grain"></div>
  <div class="masthead">
    <div class="brand">Proof of Taste</div>
    <div class="index">07 / 08</div>
  </div>
  <div class="content" style="top:196px;text-align:center;">
    <div class="kicker">Verified</div>
    <h2>맛의 근거도 있습니다</h2>
    <div class="body" style="max-width:none;margin-top:28px;">
      산청 흑돼지 · 특허 파동숙성<br>
      정육왕 블라인드 테스트 — 한국 5대 프리미엄 돼지 중 밸런스 1위<br>
      이원일 셰프 · 211TV 소개
    </div>
  </div>
</div>
```

- [ ] **Step 3: 08 엔드 슬라이드 교체**

```html
<!-- 08 END — yukjeup-menu-05 (S) -->
<div class="slide">
  <div class="photo" style="background-image:url('../../../assets/photos/yukjeup-menu-05.jpg');background-position:center 12%;"></div>
  <div class="scrim-top" style="background:linear-gradient(180deg,rgba(26,26,26,.68) 0%,rgba(26,26,26,.38) 34%,rgba(26,26,26,0) 56%);"></div>
  <div class="grain"></div>
  <div class="masthead">
    <div class="brand">Yukjeup Office</div>
    <div class="index">08 / 08</div>
  </div>
  <div class="content" style="top:196px;text-align:center;">
    <div class="kicker">Save · 3 Second Check</div>
    <h2>6번째 장을<br>지금 저장해두세요</h2>
    <div class="hairline" style="margin:24px auto;"></div>
    <div class="profile">육즙관리소 <span class="id">@yukjeup_official</span></div>
    <div class="sub" style="text-align:center;color:rgba(237,230,216,.7);margin-top:6px;">양재역점 · 더룸 을지로점</div>
  </div>
</div>
```

- [ ] **Step 4: 인덱스와 커버 도트 갱신**

모든 `02 / 07~07 / 07`을 `02 / 08~08 / 08`로 변경하고, 커버 `.dots`에 `<span></span>`을 하나 추가해 총 8개로 만든다.

- [ ] **Step 5: HTML 구조 검증**

Run:

```powershell
node -e "const fs=require('fs');const h=fs.readFileSync('output/2026-07-15/design/slides.html','utf8');console.log({slides:(h.match(/class=\\\"slide\\\"/g)||[]).length,index08:(h.match(/\\/ 08/g)||[]).length,dots:(h.match(/<span/g)||[]).length})"
```

Expected: `slides: 8`, 인덱스가 모두 `/08`, 커버 도트 `8`.

- [ ] **Step 6: HTML 수정 커밋**

```bash
git add yukjeup-pipeline/output/2026-07-15/design/slides.html
git commit -m "feat: add proof slide and align carousel copy"
```

### Task 4: 01~08 PNG 렌더링 및 자동 검증

**Files:**
- Generate: `C:/Users/pc/Desktop/j project/yukjeup-pipeline/output/2026-07-15/design/01.png~08.png`

**Interfaces:**
- Consumes: Task 1의 렌더러와 Task 3의 8개 `.slide`
- Produces: Instagram 업로드용 8개 PNG

- [ ] **Step 1: 8개 PNG 렌더링**

Run from `C:/Users/pc/Desktop/j project/yukjeup-pipeline`:

```powershell
node scripts/render_slides.js output/2026-07-15/design output/2026-07-15/design
```

Expected: `rendered 01.png`부터 `rendered 08.png`, 마지막에 `done`.

- [ ] **Step 2: 파일 수와 PNG 해상도 검증**

```powershell
$files = Get-ChildItem output/2026-07-15/design -Filter '0?.png' | Sort-Object Name
if ($files.Count -ne 8) { throw "Expected 8 PNGs" }
node -e "const fs=require('fs');for(let i=1;i<=8;i++){const p='output/2026-07-15/design/'+String(i).padStart(2,'0')+'.png';const b=fs.readFileSync(p);if(b.readUInt32BE(16)!==1080||b.readUInt32BE(20)!==1440)throw new Error(p);console.log(p,'1080x1440')}"
```

Expected: 8개 파일 모두 `1080x1440`.

- [ ] **Step 3: 브라우저 구조·폰트·경계 검증**

Playwright로 `slides.html`을 열고 다음을 확인한다.

```js
expect(await page.locator('.slide').count()).toBe(8);
await page.evaluate(() => document.fonts.ready);
expect(await page.evaluate(() => Array.from(document.fonts).some(f => f.family === 'Fraunces' && f.status === 'loaded'))).toBe(true);
expect(await page.evaluate(() => Array.from(document.fonts).some(f => f.family === 'Pretendard Variable' && f.status === 'loaded'))).toBe(true);
```

각 텍스트 Range가 슬라이드 캔버스 밖으로 나가지 않고, `.content`와 `.masthead`가 좌우 80px·하단 120px 규칙을 지키는지 검사한다. 콘솔 warning/error와 실패한 요청은 0건이어야 한다.

- [ ] **Step 4: 렌더 결과 커밋**

```bash
git add yukjeup-pipeline/output/2026-07-15/design/01.png yukjeup-pipeline/output/2026-07-15/design/02.png yukjeup-pipeline/output/2026-07-15/design/03.png yukjeup-pipeline/output/2026-07-15/design/04.png yukjeup-pipeline/output/2026-07-15/design/05.png yukjeup-pipeline/output/2026-07-15/design/06.png yukjeup-pipeline/output/2026-07-15/design/07.png yukjeup-pipeline/output/2026-07-15/design/08.png
git commit -m "chore: render aligned carousel assets"
```

### Task 5: 전 슬라이드 시각 QA

**Files:**
- Inspect: `C:/Users/pc/Desktop/j project/yukjeup-pipeline/output/2026-07-15/design/01.png~08.png`

**Interfaces:**
- Consumes: Task 4의 최종 PNG
- Produces: 사용자에게 보고할 검증 결과

- [ ] **Step 1: 01~08을 원본 해상도로 모두 열기**

각 이미지를 `view_image(detail: original)`로 확인한다.

- [ ] **Step 2: 시각 체크리스트 적용**

각 장에서 다음을 확인한다.

- 텍스트 잘림·겹침·어색한 한국어 줄바꿈 없음
- 사진의 중심부 하이라이트가 살아 있고 회색 전면 딤이 없음
- 질문 문구가 03~06에서 동일하게 반복됨
- 07의 세 증거가 읽히며 고기 사진과 시선 경쟁을 하지 않음
- 08 CTA가 `6번째 장`을 정확히 가리킴

- [ ] **Step 3: 최종 회귀 테스트**

Run: `npm test -- --run tests/unit/render-slides.test.ts`

Expected: PASS, 1 test passed.

- [ ] **Step 4: 최종 보고**

수정한 소스, 8개 PNG 링크, 자동 검증 결과, 시각 검토 결과를 요약한다.
