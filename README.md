# SEHI 홈페이지 (Jekyll / GitHub Pages)

## 구조
| 경로 | 역할 |
|---|---|
| `_config.yml` | 사이트 제목, 회사 정보(주소·전화·이메일) |
| `_data/menu.yml` | 상단 메뉴 · 서브메뉴 구조 |
| `_layouts/default.html` | 모든 페이지 공통 틀 (head + 헤더 + 본문 + 푸터) |
| `_layouts/sub.html` | 서브페이지 틀 (상단 타이틀 + 서브메뉴 + 위치표시) |
| `_includes/` | 헤더, 로고, 푸터, 하단 바로가기, 상담 CTA 조각 |
| `*.html` | 각 페이지 본문만 들어 있음 |
| `assets/css`, `assets/js` | 스타일, 스크립트 |

## 자주 하는 수정
- 전화번호·주소 변경 → `_config.yml`의 `company`만 수정
- 메뉴 추가 → `_data/menu.yml`에 한 줄 추가 + 새 페이지 파일 생성
- 새 페이지 → 아래처럼 맨 위에 머리말을 넣고 본문만 작성

```
---
layout: sub
title: "페이지 제목"
group: "About SEHI"   # menu.yml의 name과 같아야 서브메뉴가 나옴
---
<p>본문</p>
```
