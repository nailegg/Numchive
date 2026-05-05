# Numchive Design Brief

이 문서는 Numchive의 대대적인 비주얼 리디자인을 위해 디자이너에게 공유할 기준 문서입니다. 큰 레이아웃 구조는 유지한다고 가정하고, 색상, 타이포그래피, 컴포넌트, 상태, 인터랙션, 화면별 위계에서 재설계할 요소를 정리합니다.

## 1. 제품 개요

Numchive는 KAIST 창작뮤지컬 동아리 Number의 공연 MR/넘버를 탐색하고 재생하는 아카이브형 음악 웹 앱입니다. 일반 음악 스트리밍 앱처럼 탐색, 재생, 현재 재생목록, 로컬 플레이리스트를 제공하지만, 중심 콘텐츠는 아티스트/앨범이 아니라 `공연(show)`과 `넘버(track)`입니다.

핵심 사용자 흐름은 다음과 같습니다.

- 공연 목록을 둘러본다.
- 공연 상세에서 넘버 목록을 보고 재생한다.
- 검색으로 공연 또는 넘버를 찾는다.
- 원하는 곡을 로컬 플레이리스트에 추가한다.
- 플레이리스트를 앨범처럼 열어 재생하고 정렬한다.
- 하단 고정 플레이어로 현재 곡을 제어한다.

현재 앱의 톤은 어두운 아카이브/극장/음반 라이브러리 느낌입니다. 리디자인에서는 이 방향을 유지하거나 바꿀 수 있지만, 공연 아카이브라는 정체성은 남아야 합니다.

## 2. 고정되는 큰 레이아웃

큰 구조는 유지합니다.

### Global Shell

- 상단 고정 헤더
  - 좌측: Numchive 로고/브랜드
  - 중앙: 검색창
  - 우측: 보조 컨트롤, 현재는 accent color picker
- 하단 고정 플레이어
  - 모든 페이지에서 현재 곡이 있을 때 표시
  - 진행 바는 플레이어 상단 전체 폭
  - 플레이어 내부는 좌측 재생 컨트롤, 중앙 곡 정보, 우측 볼륨/반복/재생목록
- 메인 콘텐츠 영역
  - 헤더 아래, 플레이어 위 공간을 사용
  - 현재 재생목록 패널이 열리면 오른쪽 공간을 양보하고 살짝 scale down

### Desktop Page Families

- 홈 `/`
  - 좌측: 로컬 플레이리스트 사이드바
  - 우측 메인: 공연 목록 그리드
- 공연 상세 `/[showId]`
  - 좌측 상단: 공연 목록 그리드
  - 좌측 하단: 플레이리스트 목록 그리드
  - 우측 메인: 공연 상세 히어로 + 트랙 목록
- 플레이리스트 상세 `/playlist/[playlistId]`
  - 좌측 상단: 공연 목록 그리드
  - 좌측 하단: 플레이리스트 목록 그리드
  - 우측 메인: 플레이리스트 상세 히어로 + 트랙 목록
- 검색 `/search?q=...`
  - 현재는 메인 영역 중심의 결과 페이지
  - 검색 결과는 공연 섹션과 넘버 섹션으로 분리

## 3. 현재 디자인 토큰

현재 CSS 변수는 `app/globals.css`와 `tailwind.config.ts`에 정의되어 있습니다.

### Current Colors

```css
--nc-bg: #070908;
--nc-surface: #0f1210;
--nc-surface2: #181d1a;
--nc-accent: #9abca4;
--nc-accent2: #789b83;
--nc-text: #eef3ef;
--nc-text-muted: #6f7a72;
--nc-text-dim: #aab4ad;
--nc-border: 255, 255, 255;
```

현재 색상 역할은 다음과 같습니다.

- `nc-bg`: 앱 전체 배경
- `nc-surface`: 헤더, 플레이어, 패널 배경
- `nc-surface2`: 이미지 placeholder, 낮은 위계의 면
- `nc-accent`: primary action, active state, highlight
- `nc-accent2`: primary action hover
- `nc-text`: 기본 본문
- `nc-text-dim`: 보조 본문
- `nc-text-muted`: 메타 정보, label, 비활성 텍스트
- `white/10`, `white/5`: 대부분의 border와 hover surface

### Color Redesign Considerations

현재 방향은 sage를 단일 키 컬러로 쓰는 dark music library입니다. 디자이너가 점검해야 할 주요 색상 체계:

- 기본 배경의 성격
  - 완전한 black 계열 유지
  - 약간 따뜻한 charcoal
  - 공연장 조명 같은 어두운 burgundy/navy/green undertone
- accent의 성격
  - 현재는 muted sage
  - 별도 palette picker는 제거하고 active, primary action, progress, focus state를 sage 계열로 통일
- 앨범/공연 아트워크와의 관계
  - artwork가 많은 화면에서 UI 색상이 과하게 경쟁하지 않아야 함
  - 히어로 영역의 blurred background와 텍스트 대비 기준 필요
- active state와 hover state
  - active는 확실하되, 전체 화면이 금색으로 과밀해지지 않게 해야 함
- destructive state
  - 삭제 버튼은 현재 muted style이며 명확한 red 토큰이 없음
  - `danger`, `danger-hover`, `danger-muted` 토큰 필요 가능

권장 토큰 세트:

- `bg/base`
- `bg/elevated`
- `bg/raised`
- `bg/subtle-hover`
- `border/subtle`
- `border/strong`
- `text/primary`
- `text/secondary`
- `text/tertiary`
- `text/inverse`
- `accent/base`
- `accent/hover`
- `accent/subtle`
- `accent/ring`
- `danger/base`
- `danger/subtle`

## 4. Typography

현재 폰트 변수:

```css
--font-sans: "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif;
--font-display: Georgia, "Times New Roman", serif;
--font-mono: "SFMono-Regular", "Menlo", "Monaco", "Consolas", monospace;
```

현재 사용 패턴:

- Display serif
  - 앱 이름
  - 공연/플레이리스트 상세 제목
  - 큰 제목
- Sans
  - 일반 UI 텍스트
  - 트랙 제목
  - 버튼 텍스트 일부
- Mono
  - label, metadata, counts, uppercase eyebrow
  - 예: `Archive`, `Search Results`, `17 tracks`

### Typography Redesign Considerations

- 한국어 제목이 핵심이므로 display font가 한글에서 어색하지 않아야 함
- 현재 serif display는 영어에는 분위기가 있지만 한글 제목에는 일관성이 약할 수 있음
- 트랙 목록은 스캔성이 중요하므로 sans 중심이 안전
- Mono label은 현재 과하게 자주 쓰이므로 사용 범위를 줄일지 결정 필요
- 제목/본문/메타의 크기 scale을 명확히 정의해야 함

권장 타입 스케일:

- Page title: 32-48px
- Section title: 14-18px
- Card title: 12-15px
- Track title: 14px
- Track metadata: 10-12px
- Label/eyebrow: 9-10px uppercase or spaced text
- Player title: 13-14px

## 5. Spacing, Radius, Border

현재 UI는 다음 패턴이 많습니다.

- Radius: 대부분 `rounded-sm`
- Border: `border-white/10`
- Hover: `bg-white/5`
- Panel padding: 16-24px
- Main page padding: 32-40px
- Grid gap: 8-16px

### Redesign Considerations

- 공연/플레이리스트 카드 radius는 통일 필요
  - 현재는 작은 radius로 아카이브/도구 느낌
  - 음악 앱 느낌을 강화하려면 cover는 4-8px, panel은 0-8px 권장
- border와 surface의 위계가 현재 다소 비슷함
  - panel separator, card hover, selected card, button border의 강도를 분리
- 하단 플레이어는 dense하게 유지하되, 버튼 터치 영역은 충분히 확보
- 좌측 사이드바 안의 두 그리드가 답답하지 않게 vertical spacing 조정 필요

## 6. Core Components

### Header

현재 구성:

- 고정 높이: `h-21`
- 좌측 브랜드
- 중앙 검색
- 우측 accent color picker

디자인 고려:

- 브랜드 영역이 현재 작은 mono label + serif logo 구조
- 검색창이 중앙 고정 폭으로 놓임
- 헤더는 앱 전체의 기준선이므로 가장 먼저 디자인 확정 필요
- 검색창은 focused, pending, empty, filled 상태 필요
- accent color picker는 리디자인 범위에서 제거/숨김/테마 메뉴화 가능

### Left Sidebar

역할:

- 홈: 플레이리스트 목록만 표시
- 공연 상세/플레이리스트 상세: 위쪽 공연 목록, 아래쪽 플레이리스트 목록

현재 패턴:

- 폭: `w-72`
- border-right
- grid cards: 2 columns
- 새 플레이리스트는 첫 카드로 표시

디자인 고려:

- 공연 목록과 플레이리스트 목록이 같은 밀도로 보이면 위계가 헷갈릴 수 있음
- 사이드바 내 카드 크기, 제목 줄수, 메타 노출 기준 필요
- 현재는 playlist cover collage가 show artwork와 같은 카드 컴포넌트 크기
- active state는 ring/accent text
- create card는 `+` centered cover + title row
- 홈에서는 좌측이 playlist만 있으므로 빈 공간 처리 필요

필요 상태:

- Empty playlist list
- Create playlist card hover
- Active playlist
- Active show
- Long title truncation
- Missing artwork

### Show Card

역할:

- 공연을 cover + title + year/season으로 표현

현재 구조:

- square artwork
- hover overlay with play icon
- active ring
- title
- metadata

디자인 고려:

- 공연 카드가 실제 album card처럼 보일지, archive record처럼 보일지 결정
- overlay action이 카드 클릭 navigation과 혼동되지 않아야 함
- season 표기 `S/F` 또는 `Spring/Fall` 표준화 필요
- image placeholder가 현재 theatrical emoji인데, 리디자인에서는 icon/abstract placeholder 필요

### Playlist Card

역할:

- 로컬 playlist를 공연/앨범과 같은 수준의 card로 표현

현재 구조:

- auto collage cover
- title
- track count
- active state

디자인 고려:

- 로컬 저장이라는 사실을 얼마나 드러낼지
- 플레이리스트 cover collage 규칙
  - 0 tracks: placeholder
  - 1 artwork: full cover
  - 2-4 artworks: collage
- 생성 카드와 일반 카드의 alignment 유지
- long playlist names 처리

### Show Detail Hero

현재 구성:

- blurred artwork background
- dark gradient overlay
- square cover
- year/season metadata
- large title
- 전체 재생 / 셔플 재생 buttons

디자인 고려:

- 히어로 높이와 정보 밀도
- cover size
- blurred background opacity
- title가 길 때 truncation 또는 multiline
- action buttons의 hierarchy
- 현재 페이지 안에서 하단 player와 겹치지 않는 높이

### Playlist Detail Hero

현재 구성:

- playlist cover collage
- editable title input
- metadata: local playlist + track count
- play, shuffle, delete actions

디자인 고려:

- 공연 상세와 같은 구조를 공유하되, playlist-specific actions가 자연스럽게 보여야 함
- title editing이 항상 input처럼 보이는 것이 좋은지, edit button으로 분리할지 결정
- delete action의 위험도 표현
- empty playlist state의 hero treatment

### Track List

사용 위치:

- 공연 상세
- 플레이리스트 상세
- 검색 결과의 넘버 섹션
- 현재 재생목록 패널

현재 기본 행:

- number/index
- optional artwork
- title
- show title metadata
- duration
- `+` add menu or remove button

디자인 고려:

- 현재 playing row
- hover row
- selected/dragging row
- disabled/unavailable audio state
- duration null일 때 alignment
- `+` menu trigger visibility
- playlist row에는 drag handle과 remove가 있음
- album track row에는 add-to-playlist menu가 있음

필요 상태:

- Default
- Hover
- Current playing
- Dragging
- Empty
- Duplicate already added in menu

### Add To Playlist Menu

역할:

- 트랙의 `+` 버튼을 눌렀을 때 playlist 선택

현재 구조:

- small floating menu
- playlist list, scrollable
- already added disabled state
- new playlist creation form at bottom

디자인 고려:

- 팝업 위치: track row에서는 아래, player에서는 위
- viewport edge collision
- max height
- scroll styling
- added state
- empty playlist state
- create playlist flow와 sidebar create flow의 통일감

### Queue Panel

역할:

- 현재 재생목록 표시
- 오른쪽에서 올라오거나 나타나는 패널
- 열릴 때 main content가 오른쪽 공간을 양보하고 scale down

현재 구조:

- fixed right panel
- width: `w-96`
- top under header, bottom above player
- header: title + sourceTitle/track count
- track rows

디자인 고려:

- 팝업이 아니라 docked panel로 느껴져야 함
- main scaling/margin transition의 시각적 자연스러움
- panel shadow/elevation
- panel open/close affordance
- empty queue state
- current playing row
- source title가 긴 경우

### Bottom Player

현재 구성:

- top progress bar
- waveform visual above player
- left: prev/play/next + time
- center: artwork + title + show + add menu
- right: repeat, volume, queue toggle

상태:

- no current track: hidden
- playing
- paused
- progress hover/drag
- repeat off/all/one
- volume 0/low/high
- queue open/closed

디자인 고려:

- Player는 가장 많이 보는 UI이므로 density와 readability 균형 필요
- Icon set 통일 필요
  - 현재 일부는 emoji/text symbols, 일부는 Hugeicons
  - 리디자인에서는 icon system을 통일하는 것이 좋음
- Progress bar hit area
- Waveform의 역할
  - decoration인지 real audio visualizer인지
  - 너무 강하면 하단 UI가 산만할 수 있음
- Current track title truncation
- Add menu가 player에서 열릴 때 겹침 방지
- Repeat button의 off/all/one 상태 시각화

### Search

현재 구성:

- Header 중앙 검색창
- `/search` 결과 페이지
- 공연 결과 grid
- 넘버 결과 list

디자인 고려:

- 검색창 width, focus state, pending state
- 결과 없을 때 empty state
- 결과 페이지에서 검색어 표시 여부
- 공연/넘버 섹션 간 위계
- 검색 결과 track row와 일반 track row의 차이

## 7. Interaction Patterns

### Navigation

- Show card click: show detail로 이동
- Playlist card click: playlist detail로 이동
- Track row click:
  - show detail: 해당 공연 전체를 queue로 만들고 clicked track부터 재생
  - playlist detail: 해당 playlist 전체를 queue로 만들고 clicked track부터 재생
  - search result: single queue로 재생
- Player queue button: 오른쪽 queue panel toggle
- Add button: playlist selection menu

### Playback Context

현재 재생목록은 다음 세 가지로 엄격히 구분됩니다.

- Single: 검색 등 단일 곡
- Album: 공연 상세에서 재생
- Playlist: 로컬 플레이리스트에서 재생

디자인상 queue panel은 이 context를 노출할 수 있지만, 과한 설명 텍스트는 피해야 합니다.

### Repeat

반복 버튼 상태:

- Off
- All
- One

디자인 필요:

- Off state와 active state가 명확해야 함
- One repeat는 숫자 `1` 또는 badge로 구분
- Tooltip 또는 label 필요 가능

### Create Playlist

현재 방향:

- sidebar grid의 첫 카드가 create trigger
- 클릭하면 centered modal
- 이름 입력 후 생성
- 생성 후 playlist detail로 이동

디자인 필요:

- Create card가 playlist card와 같은 grid rhythm 유지
- Modal visual style
- Modal backdrop
- Input focus
- Cancel/create buttons

## 8. Current Screens To Redesign

### Home

구조:

- Left sidebar: playlists only
- Main: show archive grid

디자인 목표:

- 앱 첫 화면에서 공연 아카이브가 주인공이어야 함
- 플레이리스트 사이드바는 보조 내비게이션
- 빈 플레이리스트 사용자에게 create affordance가 자연스러워야 함

### Show Detail

구조:

- Left top: shows
- Left bottom: playlists
- Main: show hero + track list

디자인 목표:

- 현재 공연이 명확해야 함
- track list scan speed가 좋아야 함
- play all/shuffle/add interactions가 음악 앱답게 직관적이어야 함

### Playlist Detail

구조:

- Left top: shows
- Left bottom: playlists
- Main: playlist hero + track list

디자인 목표:

- 로컬 playlist지만 album처럼 보여야 함
- playlist cover collage가 어색하지 않아야 함
- editing/deleting/reordering이 관리 UI처럼 과하게 보이지 않아야 함

### Search Results

구조:

- Main content results

디자인 목표:

- 검색 결과의 종류가 명확해야 함
- 결과가 없을 때 차갑지 않게 안내
- add-to-playlist와 play action이 구분되어야 함

## 9. Component Inventory

현재 주요 컴포넌트:

- `AddToPlaylistMenu`: track -> playlist add dropdown
- `KeyboardShortcuts`: space play/pause
- `LibrarySidebar`: playlist sidebar grid + create modal
- `MainContentFrame`: queue open시 main scaling/margin
- `Player`: bottom playback bar
- `PlaylistCard`: playlist card
- `PlaylistCover`: playlist cover collage
- `PlaylistPage`: playlist detail
- `QueuePanel`: current playback queue
- `SearchBar`: header search
- `SearchResultNumbers`: search result track list
- `ShowCard`: show card
- `ShowNav`: sidebar show grid
- `ShowPlayButtons`: play all/shuffle
- `TrackList`: show detail track list
- `Waveform`: player visual layer

UI primitive:

- `components/ui/button`
- `components/ui/sheet`
- `components/ui/slider`
- `components/ui/tooltip`

Icon system:

- `@hugeicons/react`
- `@hugeicons/core-free-icons`
- 주요 버튼과 placeholder는 `@hugeicons` 기반으로 통일했습니다.

## 10. Design Risks And Notes

### 1. One-note dark theme

현재는 dark charcoal + sage가 강합니다. palette picker를 제거했기 때문에, UI가 단색 계열로 납작해지지 않도록 surface 단계, artwork blur, semantic colors를 명확히 정의하는 것이 좋습니다.

### 2. Artwork-heavy UI

공연 cover가 많기 때문에 UI 자체가 너무 장식적이면 화면이 혼잡해질 수 있습니다. Navigation, track list, player는 차분한 density를 유지하는 편이 좋습니다.

### 3. Korean typography

한국어 공연명과 넘버명이 핵심입니다. Display serif를 유지할 경우 한글 품질을 반드시 검토해야 합니다.

### 4. Hidden local-only behavior

플레이리스트는 서버 저장이 아닙니다. 디자인에서 “로컬”이라는 정보를 과하게 강조할 필요는 없지만, 삭제/브라우저 데이터 삭제 등의 상황을 고려한 empty/error state가 필요합니다.

### 5. Dense desktop interface

현재 앱은 desktop-first입니다. 모바일 대응을 할 경우 sidebar, player, queue panel의 구조를 별도로 설계해야 합니다. 이번 리디자인에서는 desktop 고정 여부를 먼저 확정하는 것이 좋습니다.

## 11. Suggested Deliverables From Design

디자이너에게 요청하면 좋은 산출물:

- Color token proposal
- Type scale proposal
- Header redesign
- Left sidebar redesign
- Show card and playlist card variants
- Show detail hero
- Playlist detail hero
- Track row variants
- Add-to-playlist menu
- Queue panel open/closed state
- Bottom player full state set
- Empty states
- Hover/active/focus states
- Icon usage guideline

## 12. Acceptance Checklist

리디자인 구현 전 확인할 것:

- 공연과 플레이리스트가 둘 다 album-like entity로 보이는가?
- show detail과 playlist detail이 같은 family로 느껴지는가?
- track row에서 play action과 add action이 헷갈리지 않는가?
- bottom player가 항상 읽기 쉽고 과하게 무겁지 않은가?
- queue panel이 main을 가리지 않고 docked panel처럼 느껴지는가?
- active item이 sidebar, track list, queue에서 일관되게 보이는가?
- long Korean titles가 깨지지 않는가?
- artwork가 없는 경우도 충분히 아름다운가?
- empty playlist, empty search, no current track 상태가 준비되어 있는가?
