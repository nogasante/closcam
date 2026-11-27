# CloScam

**CloScam: shut scammers out before they get in.**

## Pitch

An in-app training simulator that walks Ghana mobile money users through realistic scam texts, chats and calls, scores their responses, and teaches the official red flags, without sending any real messages or collecting personal data.

CloScam is a free, no-login trainer for a phone browser. People practise the channels they actually see: a chat, a text message, a call script, and a fake payment page. Every fake surface is marked SIMULATION / TRAINING / NOT AFFILIATED. Names inside the drills are fictional (PulsePay, SwiftBundle, GoldRise Daily). Official names appear only as citations on the sources and feedback screens.

This is not the first scam-training app. It is a free trainer built for Ghana mobile money, using local official advisories and the channels people here get scammed on.

Built for [GenHacks](https://genhacks-open.devpost.com/). Deadline: 26 December 2026, 10:00 pm Africa/Accra. Work in this repository started after the hackathon start (after 1 November 2026).

## How to run

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in a phone browser, or in a narrow desktop window. The first screen is a short disclaimer. No account, API key, or environment variable is required.

A production build:

```bash
npm run build
npm start
```

Then open http://localhost:3000.

Nothing in the app sends an SMS, a chat, a call, or a payment. Do not type a real PIN. The drills use choice buttons only.

## Deploy on Vercel

1. Import this GitHub repository in the Vercel dashboard, or run the Vercel CLI from the repository root.
2. Framework preset: Next.js. Root directory: the repository root.
3. Build command: `npm run build`. Output: the Next.js default.
4. Leave environment variables empty. Do not add an analytics product that identifies people.
5. Deploy. The app is static pages plus client-side progress stored in the browser.

No backend, database, or server secret is used.

## Tools used

- Next.js 16 (App Router) and React 19, for the training app
- TypeScript 5
- Tailwind CSS 4
- Framer Motion, MIT, for message entrance
- @splinetool/react-spline and @splinetool/runtime, for the landing hero scene
- Lucide icons, ISC
- Nunito and Source Sans 3, SIL Open Font License 1.1, via Fontsource
- IBM Plex Mono, SIL Open Font License 1.1, via Fontsource, for amounts and numbers
- Vercel AI SDK, Apache-2.0, for the optional live-call line
- ESLint 9, with eslint-config-next
- Node.js
- Vercel, for the public deploy
- GitHub, for the public repository

Room art, the in-app phone frame, and the chat wallpaper are original and drawn in the app. Low-poly kits were not used after a box scene read as a placeholder.

The landing hero, on a wide screen, is the Spline Community scene "iPhone Mockup" by vexus, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). File: https://community.spline.design/file/5209eac0-5eb0-4577-9f00-402a1561c0cf. A drawn phone plays in its place on a small screen, a slow connection, reduced motion, or while the scene is still loading.

No database, no authentication service, no payments SDK, and no analytics SDK. Next.js anonymous framework telemetry is turned off in the npm scripts (`NEXT_TELEMETRY_DISABLED=1`). Drill scripts are static JSON in `data/scenarios.json`. Optional progress is stored only in the browser, under the key `closcam-progress`, and holds drill ids, first-try results, and a timestamp. No name is attached.

## Privacy

CloScam does not collect personal data. It does not ask for a name, phone number, PIN, OTP, WhatsApp code, or contacts. Pasted text in the practice tool stays in memory for that moment and is never stored or sent. Completing the drills does not guarantee safety.

## Docs

- [Product requirements](docs/CloScam-PRD.md)
- [Drill scripts](docs/scenarios.md)

If the two files differ on a drill, `docs/scenarios.md` is the source of truth for scripts, choices, red flags, lessons, and sources.

## Licence

MIT. See [LICENSE](LICENSE).
