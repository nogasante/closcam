# CloScam

**CloScam: shut scammers out before they get in.**

## Pitch

An in-app training simulator that walks Ghana mobile money users through realistic scam texts, chats and calls, scores their responses, and teaches the official red flags, without sending any real messages or collecting personal data.

CloScam is a free, no-login trainer for a phone browser. People practise the channels they actually see: a chat, an SMS, a call script, and a fake payment page. Every fake surface is marked SIMULATION / TRAINING / NOT AFFILIATED. Names inside the drills are fictional (PulsePay, SwiftBundle, and similar). Official names appear only as citations on the sources page.

This is not the first scam-training app. It is a free trainer built for Ghana mobile money, using local official advisories and the channels people here get scammed on.

Built for [GenHacks](https://genhacks-open.devpost.com/). Deadline: 26 December 2026, 10:00 pm Africa/Accra. Work in this repository started after the hackathon start (after 1 November 2026).

## How to run

The product spec and the 10 drill scripts are in `docs/`. The Next.js training app is added in a pull request against `main`. After that code is merged:

1. Install Node.js 20 or newer.
2. From the repository root, install dependencies and start the dev server:

```bash
npm install
npm run dev
```

3. Open http://localhost:3000 on a phone, or in a narrow browser window.

A production build:

```bash
npm run build
npm start
```

No environment variables, API keys, or accounts are required. Nothing in the app sends an SMS, a chat, a call, or a payment.

## Deploy on Vercel

1. Import this GitHub repository in Vercel.
2. Framework preset: Next.js. Root directory: the repository root.
3. Leave environment variables empty. Do not add an analytics product that identifies people.
4. Deploy. The site is a static-friendly Next.js app with no backend.

## Tools used

- Next.js (App Router) and React, for the training app
- TypeScript
- Tailwind CSS
- ESLint
- Node.js
- Vercel, for the public deploy
- GitHub, for the public repository

No database, no authentication service, no payments SDK, and no analytics SDK. Drill scripts are static JSON shipped with the app. Optional progress is stored only in the browser.

## Privacy

CloScam does not collect personal data. It does not ask for a name, phone number, PIN, OTP, WhatsApp code, or contacts. Pasted text in the practice tool stays in the browser for that moment and is never stored or sent. Completing the drills does not guarantee safety.

## Docs

- [Product requirements](docs/CloScam-PRD.md)
- [Drill scripts](docs/scenarios.md)

If the two files differ on a drill, `docs/scenarios.md` is the source of truth for scripts, choices, red flags, lessons, and sources.
