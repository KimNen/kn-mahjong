# 🀄 KN Mahjong

> 리치 마작 웹 게임 — 3 봇 + 1 플레이어

## Features

- 🎴 퐁 · 치 · 깡 · 론 · 쯔모 · 리치 · 도라
- ⭐ **역만**: 국사무쌍, 사암각, 대삼원, 자일색, 친로또, 대/소사희
- 🤖 스마트 봇 AI (텐파이 탐색, 자동 리치)
- 🐣 초보자 모드 (추천 버리기, 대기패 힌트, 고양이 조언)
- 🔊 효과음 (Web Audio API)
- 🗣️ 자연스러운 음성 안내 (프리미엄 TTS 음성 자동 선택)
- 🎨 실제 탁(卓) 레이아웃 (좌우 세로, 사분면 버림패)

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
git init && git add . && git commit -m "init"
git branch -M main
git remote add origin https://github.com/<USER>/kn-mahjong.git
git push -u origin main
```

Settings → Pages → Source: **GitHub Actions**

> `vite.config.js`의 `base`를 repo명과 맞추세요

## License

MIT
