# CloScam product requirements document (PRD)

This document is meant to be complete. A person or a coding assistant should be able to build CloScam from this file and from /workspace/closcam/scenarios.md, without another briefing. If the two files ever differ on a drill, treat scenarios.md as the source of truth for scripts, choices, red flags, lessons and sources. This PRD is the source of truth for product scope, screens, scoring, legal rules, stack and the GenHacks plan.

Version: 1.0
Date: 27 November 2026
Deadline to submit: 26 December 2026, 10:00 pm Africa/Accra (GenHacks closes 26 December 2026, 5:00 pm Eastern)
Hackathon: GenHacks, https://genhacks-open.devpost.com/
Track to request: AI, Agentic Systems, Cybersecurity, and Dev Tools. Fallback: Open. Email organisers at projectdextera@gmail.com if the track is not yet confirmed.
Product name: CloScam
Tagline: CloScam: shut scammers out before they get in.

Do not put a personal name, personal email, school ID or phone number in the public repository, the Devpost page, or file metadata.

---

## 1. One-line pitch and tagline

Pitch: An in-app training simulator that walks Ghana mobile money users through realistic scam texts, chats and calls, scores their responses, and teaches the official red flags, without sending any real messages or collecting personal data.

Tagline: CloScam: shut scammers out before they get in.

Core idea in one sentence: Self-awareness is the defence, so CloScam lets people practise the scams they actually see, then leave with tools they can reuse.

---

## 2. Problem (with cited Ghana figures)

Ghana mobile money is everyday money. Fraud on payment service providers (the group that includes mobile money operators) is rising, and official bodies say a large part of it is social engineering, not clever hacking. People are talked into approving payments, sharing a PIN or a code, or sending money because a message looked official or looked like it came from a friend.

Cited figures, quoted from official pages and PDFs that were live when checked. Use these exact wordings. Do not upgrade "value at risk" into "losses".

- Bank of Ghana, Banks, SDIs and PSPs 2025 Fraud Report, https://www.bog.gov.gh/wp-content/uploads/2026/07/FRAUD-REPORT-2025.pdf: "In 2025, the number of electronic fraud incidents recorded was 24,124, representing a 54% rise as compared to the 15,673 cases recorded in 2024." "In 2025, the PSP sector recorded a value at risk of GH¢37 million, a significant increase from the GH¢19 million reported in 2024. This represents a 95% year-on-year rise."
- Bank of Ghana 2024 Fraud Report, https://www.bog.gov.gh/wp-content/uploads/2025/04/NOTICE-NO.-BG-GOV-SEC-2025-09-Publication-of-Banks-SDIS-and-PSPS-2024-Fraud-Report-1.pdf: fraudsters are "exploiting the vulnerabilities in these digital payment platforms and channels especially through mobile money and social engineering tactics."
- Bank of Ghana press release, "Digital Fraud and the Cost of Ignorance", 7 October 2026, https://www.bog.gov.gh/wp-content/uploads/2026/10/PRESS-RELEASE-DIGITAL-FRAUD-AND-THE-COST-OF-IGNORANCE-071026.pdf: "No legitimate bank, mobile money operator, payment service provider, or financial institution will request your PIN, password, or OTP via phone calls, text messages, emails, or social media." The same release says "Public awareness and financial literacy remain important tools in combating digital financial fraud."
- CSA, "Surge in WhatsApp Account Takeovers", 29 May 2024, https://www.csa.gov.gh/cert-gh-alert27.php: "One hundred and eighty-seven (187) reports have been recorded as of April 2024, equalling what was recorded for the entire year of 2023." After codes are shared, attackers "impersonate the victims and defraud their contacts."
- CSA, "Fraudulent Online Investment Schemes", 6 July 2026, https://www.csa.gov.gh/cert-gh-alert45.php: "In the first six (6) months of 2026, the CSA recorded 352 of such cases, amounting to a total financial loss of GHS 3,429,447."
- CSA, "Online shopping scam, Black Friday deals", 28 November 2025, https://csa.gov.gh/cert-gh-alert41.php: "The CSA recorded a total of 266 cases of online shopping fraud from January to October 2025, with monetary losses of over GHS 600,000."
- CSA, "Fraudulent Online Business Impersonation Schemes", 30 April 2026, https://www.csa.gov.gh/cert-gh-alert44.php: 54 cases from 1 January to 26 April 2026, "total financial loss of GHS 266,195.00", including forms that asked for a mobile money PIN.

Do not cite the 63 cases or GH¢73,510 data-bundle figures from news articles unless you later find them on an official CSA page.

---

## 3. Target users

Primary: people in Ghana who use mobile money, including students, traders, and anyone who buys data or receives WhatsApp messages from friends and family. The first build is English, on a phone browser, with a large tap area and low data use.

Secondary: family members who want to practise together on one shared phone, with no account.

Not a target for the MVP: banks, telecom staff, or paid enterprise training.

---

## 4. Goals and non-goals

Goals:
- Teach self-awareness through short, realistic, officially sourced drills.
- Let a first-time user complete at least one drill in under two minutes, and a demo path of three drills in under three minutes.
- Make every answer deterministic: one clearly correct choice, with red flags that do not depend on an AI guess.
- Keep the product legally conservative: in-app only, no personal data, fictional brands, SIMULATION banner on every fake surface.
- Fit the GenHacks cybersecurity track as a training tool, and include a small in-app red-flag tool so the project is not "only a quiz".
- Ship a public repo, a working deploy, and a 3-minute demo video by 26 December 2026, 10:00 pm Africa/Accra.

Non-goals:
- Sending real SMS, WhatsApp messages, emails or calls, including "surprise" phishing tests.
- Detecting live scams with AI, or giving a verdict that a real pasted message is "definitely a scam".
- Collecting accounts, emails, phone numbers, contacts, PINs, OTPs or WhatsApp codes.
- Using real operator, bank or regulator logos or trademarks in the simulations.
- Processing real payments, or using Paystack or any payments SDK.
- Building a backend, leaderboard, or Supabase project for the MVP.
- Teaching people how to write or export clean scam messages.
- Medical, legal or financial advice beyond pointing to official public advisories and report lines.

---

## 5. GenHacks mapping

Official track text (https://genhacks-open.devpost.com/): "AI, Agentic Systems, Cybersecurity, and Dev Tools. Your project integrates AI, makes software more secure, or helps developers build."

CloScam is a cybersecurity training tool. Social engineering is how people are tricked into misusing payment apps and PINs. Official Ghana sources treat this as a cybersecurity and fraud problem. That is a fair track fit, but the phrase "makes software more secure" is slightly software-centric, so it is borderline. Do not claim CloScam patches mobile money software.

To make the fit clearer:
- Word the Devpost page as a cybersecurity training tool that helps people resist social-engineering attacks on mobile money and payment apps.
- Ship an MVP rule-based red-flag highlighter (urgency words, requests for a PIN or code, unofficial sender numbers, "do not call", payment links). This is a tool, not an AI guess.
- Optional stretch only: an in-app, clearly labelled AI roleplay that never stores chats. Do not make this the core. It adds privacy risk and demo error risk.
- Email projectdextera@gmail.com and ask them to confirm the cybersecurity track. If they say no, submit to Open.

Judging, 25 percent each:

- Impact: Cite the official PSP figures and the WhatsApp takeover and investment figures. Show a person practising a real Ghana pattern and leaving with a checklist and official report numbers (292, 18555 or 191).
- Technical execution: SMS, WhatsApp-style chat, call script, and a fake payment page must all work on a phone. Branching choices, a score, and the red-flag tool should feel finished, not like a form.
- Creativity: Be honest. Training games already exist worldwide (see competitors). The fresh part is Ghana mobile money channels, locally sourced scripts, a fake payment-request page, and no login. Do not claim to be the first awareness product on earth.
- Presentation: The 3-minute video should show a working payment-page drill in the first 40 seconds, then the hijacked WhatsApp, then the short "upgrade your limit" drill, then the score and report lines.

Rules that are easy to miss:
- The project must be new after the hackathon start (treat this as after 1 November 2026, 5:00 pm Eastern, to be safe). Do not reuse an old repo of a different product.
- Public code link, tools listed on the project page, demo video of 3 minutes or less on YouTube or Vimeo with embedding on, every teammate added on Devpost.
- Late submissions are not judged.

Prizes (from the official page): CAD 500, 200 and 150 for the top three, plus CAD 50 for each track winner.

---

## 6. Competitors and how CloScam differs

Be honest. The training-game format is not new. Differentiation is Ghana mobile money, official local sources, free use, and no login.

- ScamSmart SA (https://scamsmartsa.obile.co.za/): a South African practice app for WhatsApp, SMS, email and phone scams, short question sets, no learner logins required on the marketing page. CloScam should not copy its branding. Difference: Ghana scripts (PulsePay-style wallets, data-seller payment links, local official citations and report lines 292 and 18555), plus a fake payment-request page.
- Scamproof.ca (https://scamproof.ca/): a Canadian AI-powered awareness platform with ChatGPT-style scammer chats and North American scenarios (CRA, crypto giveaways, tech support). Difference: CloScam is deterministic and Ghana-specific, and the MVP does not depend on an AI chat.
- ScamDrill (https://scamdrill.com/): paid family and business training that can send simulated scam emails, plus a checker app. Difference: CloScam never sends a message to a real inbox or phone, is free, and needs no account.
- Google Jigsaw Phishing Quiz (https://phishingquiz.withgoogle.com/): a well-known email quiz. Difference: CloScam uses Ghana chat, SMS, calls and a fake checkout, not Western emails.
- Cyberwareness Ghana MoMo agent training (https://cyberwareness.com/africa/ghana/momo-agents/): commercial modules for agents and aggregators. Difference: CloScam is a free consumer trainer, not a B2B course for kiosk staff, although it does include one "agent wants your phone" drill for ordinary customers.
- TrustCheck (https://trustcheckapp.com/): a Ghana-facing explainer and message helper that tells people to check their real wallet balance. Difference: CloScam is a multi-scenario scored trainer with several surfaces, not only a checker. The two can mention the same official rule (an SMS is not your ledger) without being the same product.

Devpost wording to use: "CloScam is not the first scam-training app. It is a free, no-login trainer built for Ghana mobile money, using local official advisories and the channels people here actually get scammed on."

---

## 7. Features

### MVP (must ship)

- First-run consent and disclaimer: training only, no real messages are sent, not affiliated with any operator or regulator, no personal data is stored, completing drills does not guarantee safety.
- Permanent "SIMULATION / TRAINING / NOT AFFILIATED" banner on every fake SMS, chat, call, prompt and web page.
- All 10 drills from scenarios.md, including the two headline drills (cheap data payment link, hijacked WhatsApp).
- Four surfaces: SMS thread, WhatsApp-style chat, call script, fake payment web page. Scenario 9 uses a simple in-person scene card.
- Multiple choice, one correct answer, immediate feedback, red flags, one-line lesson, and a source link.
- Score after each drill and a total at the end, stored only in the browser if the user wants to resume, with no name attached.
- Reusable checklist ("tools"): never share a PIN, OTP or WhatsApp code; official operators will not ask for them by call, text or social media; check official wallet menus, not an SMS; confirm a friend's money request by another channel; buy data from official channels; report to 292, 18555 or 191, or 0501603111.
- Sources and report-lines page, with the official URLs listed in scenarios.md.
- Rule-based red-flag highlighter: a "Practice tools" screen that can highlight flags in the current simulated message, and optionally in text the user pastes. Pasted text is processed only in the browser and is never stored or sent to a server. The tool explains rules. It does not give a legal or "this is definitely a scam" verdict.
- Mobile-first English UI, works offline after first load if practical (static assets and local JSON).
- Public GitHub repo, Vercel deploy, README that lists every tool used.

### Stretch (only after MVP is polished)

- Optional Twi strings for the home, checklist and lessons, with English still available.
- A "demo mode" button that plays scenarios 1, 2 and 6 in order, for the video.
- Optional nickname-only practice history, still local, no email.
- Very late, and only if organisers want "integrates AI": a clearly labelled in-app roleplay that stays on device or on a no-log path, watermarked, not stored. Not required to win the track if the red-flag tool is present.

### Explicitly out of scope (repeat)

No accounts, no analytics SDKs that identify people, no real PIN input fields, no official logos, no Paystack, no live "scam verdict" AI.

---

## 8. Full scenario set

The full scripts, choices, red flags, lessons and sources for all 10 drills live in /workspace/closcam/scenarios.md. Summary:

1. The cheap data seller (headline, medium): chat, then a redeem site. The seller asks you to send the money to their number first. The link comes after and asks for a PIN, or the bundle never arrives. Correct: do not send, buy data from official channels.
2. The hijacked WhatsApp (headline, medium): the ask arrives in an existing chat with a saved contact, not from a new number. The wallet number is different from the line you already save for them. Correct: call that saved line before you send money.
3. The verification code trap (easy): route B. A saved contact asks you to vote or to return a code. The SMS is a WhatsApp registration code in Chinese, because registration was started on a phone set to Chinese. Correct: do not forward it. Route A, a fictional PulseLink security call that asks you to read the same kind of code, is the live call. After either route, the attacker uses the account to ask your contacts for money. A short protection exercise covers two-step verification, foreign-language codes, calling the saved line, and recovery.
4. The prize call (easy): prize plus a fee or a PIN request. Correct: hang up.
5. Fake customer care wants your PIN (medium): wallet will be "blocked". Correct: hang up and use official care only.
6. "Upgrade your wallet limit" (easy): fee plus PIN or OTP. Correct: it is a scam, no fee, no PIN.
7. The too-good investment, with a job-offer twist (medium): GHS 300 becomes GHS 900, plus a paid "job" group. Correct: do not send money.
8. "I sent the money by mistake" (medium): fake credit SMS plus a pressuring call. Correct: do not send money, check the official wallet, use official reversal.
9. The agent who wants your phone (easy): kiosk scene. Correct: keep the phone, enter the PIN yourself, wait for official confirmation.
10. The unexpected payment prompt (medium): a "refund" prompt that is actually a payment out. Correct: cancel it.

Demo path: scenarios 1, 2 and 6, for the reasons in scenarios.md (impact, working surfaces, official close).

Keep scenarios.md beside this PRD when briefing another assistant, so the full scripts travel with the product plan.

---

## 9. User flows and screen-by-screen spec

Common chrome on every screen after launch: CloScam name, tagline or a short "Training simulation" mark, and the SIMULATION banner whenever fake content is visible. A "Leave drill" button returns home without saving personal data (there is none). Official report lines sit in the footer on feedback and sources screens: "In real life, report to 292, or 18555 or 191."

### 9.1 First-run disclaimer (once, can be re-read from menu)

Title: "Before you start".
Body, short paragraphs:
- CloScam is a training simulator. No real messages, calls or payments are sent.
- This app is not affiliated with, and is not approved by, any mobile money operator, bank, the Bank of Ghana, the Cyber Security Authority or the Ghana Police Service.
- Completing the drills does not guarantee you will not be scammed.
- We do not ask for your name, number, PIN or contacts, and we do not store personal data.
- You will see fictional names such as PulsePay and SwiftBundle. They are not real companies.
Button: "I understand, start training." Secondary: "Read official sources first."

### 9.2 Home

Heading: CloScam. Tagline under it.
Primary button: "Start training" (begins scenario 1, or the next incomplete one).
Secondary: "Pick a drill", "Practice tools" (red-flag highlighter), "Checklist", "Sources and help", "How this works" (3 short points: practise, get scored, reuse the checklist).
Optional: a quiet progress line, "3 of 10 drills completed", from local storage only.

### 9.3 Drill picker

A list of the 10 drills, each with title, surface icon (SMS, chat, call, page, scene), and difficulty (Easy or Medium). Headline drills marked "Start here". Completed drills get a simple tick, no public profile. Tapping one opens the setup card, then the surface.

### 9.4 Setup card (before each drill)

One or two sentences of setup from scenarios.md. Reminder: "This is a simulation." Button: "Continue."

### 9.5 SMS simulator

A phone-style thread. Sender, timestamp, and message bubbles from the scenario. Banner on top. Then the choice list as large buttons. No real keypad and no ability to text a real number.

### 9.6 WhatsApp-style simulator

A chat thread with a fictional contact name and a generic avatar (not a real photo of a person). Messages appear in a short sequence so the demo can be filmed. Then choices. Do not copy official WhatsApp trademarks or the official logo. Call it "Chat" in the UI if needed, and describe it on Devpost as a WhatsApp-style chat.

### 9.7 Call script simulator

Incoming call screen with a fictional caller ID, then a transcript that advances line by line, as if you are hearing the caller. A "Next line" or auto-play of about 2 seconds per line. Then choices. No microphone access. No real telephony.

### 9.8 Fake payment page simulator

An in-app web-page frame with a URL bar showing the fictional domain, a merchant name, an amount the seller set, and a disabled-looking "Approve and enter PIN" control that is not a real PIN field. The user does not type a PIN. They go back to the choice list, or the choices sit under the page. If they pick a wrong "I would enter my PIN" choice, show the feedback. Never log a PIN, because none is typed.

### 9.9 In-person scene (scenario 9)

A short typographic scene (kiosk), the agent's line, then choices. Keep it simple. No need for a heavy illustration.

### 9.10 Unexpected prompt (scenario 10)

A modal that looks like a wallet approval, clearly marked SIMULATION, amount and destination visible, Cancel as the safe visual action, and the choice list confirming the decision.

### 9.11 Feedback screen (after every drill)

- "Correct" or "Not this time", plain and calm, no shame.
- The one-line lesson.
- Red flags as a short list, with the phrases from the drill highlighted if possible.
- Official source, as a readable name plus URL.
- Buttons: "Next drill", "Try this one again" (retries do not change the first-try score), "Home".
- Report strip: 292, 18555 or 191, 0501603111.

### 9.12 Score screen

Shown after the last drill in a path, and available from home as "Your practice score". First-try correct count, percentage, and a band:
- 0 to 4 correct: "Keep practising. The checklist will help."
- 5 to 7 correct: "You are spotting many of the tricks. Review the ones you missed."
- 8 to 10 correct: "Strong awareness. Revisit the checklist and share the official report lines with family."
No leaderboard in the MVP. No share card that includes a personal name.

### 9.13 Checklist

The reusable tools, each one short, with a link to the related official source where it helps. This is what "tools in them" means for the user.

### 9.14 Practice tools (red-flag highlighter)

Two tabs: "This drill" and "Paste a message".
- This drill: highlights flags in the simulated text already on screen.
- Paste a message: a text box, "Highlight possible flags". Results are labels such as "urgency", "asks for a PIN or code", "asks you not to call", "payment link", "too-good price", "unofficial-looking number". A fixed disclaimer: "This is a training aid, not a decision that a message is or is not a scam. It does not send your text anywhere." A "Clear" button wipes the box. Nothing is written to a server or to long-term storage.

### 9.15 Sources and help

Plain list of official links and report lines from scenarios.md. No affiliate claim.

---

## 10. Scoring logic

- Each drill is worth 1 point if the first submitted choice is the correct one, otherwise 0.
- "Try again" is allowed for learning, but the recorded score stays the first try.
- Total score is the sum across the 10 drills, shown as "7 / 10" and as a percentage rounded to the nearest whole number.
- No partial credit, and no speed bonus (this is awareness, not a typing test).
- If the user skips a drill, it counts as not yet attempted, not as a zero, until they submit a choice.
- Persistence: optional localStorage key, for example closcam-progress, holding only drill ids, first-try results, and a timestamp. No name, no phone, no pasted text.
- The red-flag tool does not affect the score in the MVP.

---

## 11. Content and data model

Store drills in a static JSON file, for example data/scenarios.json, shipped with the app. Suggested schema:

```
{
  "version": 1,
  "scenarios": [
    {
      "id": "s01-data-payment-link",
      "title": "The cheap data payment link",
      "headline": true,
      "difficulty": "medium",
      "surfaces": ["whatsapp", "payment_page"],
      "setup": "A seller you do not know has messaged you...",
      "messages": [
        {
          "surface": "whatsapp",
          "sender": "SwiftBundle",
          "time": "14:03",
          "text": "Hi. We have 20GB for only GHS 15. ..."
        }
      ],
      "paymentPage": {
        "url": "pay-swiftbundle.online/request/15",
        "merchant": "SWIFT BUNDLE DEALS",
        "amount": "GHS 15.00",
        "buttonLabel": "Approve and enter PIN"
      },
      "choices": [
        { "id": "a", "text": "...", "correct": false },
        { "id": "b", "text": "...", "correct": true }
      ],
      "redFlags": ["..."],
      "lesson": "...",
      "sources": [
        {
          "name": "CSA online shopping scam alert, 28 November 2025",
          "url": "https://csa.gov.gh/cert-gh-alert41.php"
        }
      ]
    }
  ]
}
```

Rules for content:
- Copy wording from scenarios.md. Do not invent new official quotes.
- Fictional names only in simulated content.
- The simulated WhatsApp code in scenario 3 is a fixed fake value (382 194). Never read a real SMS.
- Choice order may be shuffled at runtime using a seeded shuffle so the demo path can be made stable if needed.

---

## 12. Tech stack, folder structure, deploy

Recommended MVP stack:
- Next.js (App Router) and TypeScript
- React
- CSS via Tailwind, mobile-first, no heavy UI kit required
- Static scenario JSON
- Deploy on Vercel as a public site
- No backend, no database, no auth, no Supabase for the MVP
- No analytics that identify users. If you need basic Vercel traffic counts, do not add a marketing pixel.

Suggested folder structure:

```
closcam/
  README.md
  package.json
  next.config.ts
  data/scenarios.json
  app/
    layout.tsx
    page.tsx
    disclaimer/page.tsx
    drills/page.tsx
    drills/[id]/page.tsx
    feedback/[id]/page.tsx
    score/page.tsx
    checklist/page.tsx
    tools/page.tsx
    sources/page.tsx
  components/
    SimulationBanner.tsx
    SmsThread.tsx
    ChatThread.tsx
    CallScript.tsx
    PaymentPageFrame.tsx
    SceneCard.tsx
    ChoiceList.tsx
    ReportStrip.tsx
    FlagHighlighter.tsx
  lib/
    scoring.ts
    storage.ts
    flags.ts
    types.ts
  public/
```

Keep public/ free of official logos. README must list every library, state that work started after the GenHacks start date, and state that no personal data is collected.

---

## 13. Accessibility and low data

- Large tap targets (at least 44px), high contrast, text that stays readable if the user zooms.
- Do not autoplay sound. The call simulator is visual. If you later add voice, it must be optional, captioned, and already in the bundle or loaded only on tap.
- Works on a mid-range Android phone in a mobile browser.
- Keep the first load light: system fonts, few images, no auto-playing video in the app itself.
- English first. Optional Twi later for home, checklist and lessons, not as a blocker.
- Keyboard and screen-reader labels on buttons, describing the action, not "button 2".
- Reduced-motion: respect prefers-reduced-motion for message animations.

---

## 14. Legal and safety rules (do not relax these)

This is a product brief, not legal advice.

- Everything stays in-app. Never send SMS, WhatsApp, email or phone calls to real people.
- Consent on first run.
- SIMULATION / TRAINING / NOT AFFILIATED banner on every fake surface.
- Fictional providers only in simulations (PulsePay, SwiftBundle, GoldRise Daily, and similar).
- Trade Marks Act, 2004 (Act 664), section 9: do not use registered marks in relation to the goods or services they cover, without agreement. No MTN, MoMo, Telecel, AT, bank, BoG, CSA or Police logos, and no lookalike official app chrome. Official names appear only as citations on the Sources screen.
- Data Protection Act, 2012 (Act 843): collect no personal data. No accounts. No logs of pastes. No GPS.
- Simulated "phishing" is only the in-app, consented kind. Do not run surprise tests on friends.
- Never ask the user to type a real PIN, OTP or WhatsApp code. Wrong answers are buttons such as "I would enter my PIN".
- Watermark simulated messages so a screenshot still says SIMULATION.
- Defender-only teaching. No "write a scam" mode and no export of clean scam copy.
- Disclaimers as in section 9.1, plus: we do not guarantee you will not be scammed.
- Cybersecurity Act, 2020 (Act 1038), section 60, supports public cybersecurity education. It does not make this app official.
- Electronic Transactions Act, 2008 (Act 772) and Criminal Offences Act, 1960 (Act 29) offences around false pretences and fraudulent transfers require intent to defraud a real person of property. A clearly labelled trainer that does not send real messages is a different activity. Do not blur that line.

---

## 15. Success metrics (hackathon and product)

Hackathon:
- A working public deploy and public repo before the deadline.
- A 3-minute video that shows three complete drills, including the fake payment page.
- Sources and tools listed on Devpost.
- A clear track choice (cybersecurity, or Open if told to move).

Product (optional, still without personal data):
- A first-time user can finish one drill in under two minutes.
- You can complete the demo path in under three minutes on a phone.
- All 10 drills reachable, all legal banners present, no console errors on the happy path.

Do not track individuals. If you measure anything after the hackathon, use only anonymous, short-lived counts, or none at all.

---

## 16. Risks and how to avoid them

- Track fit is borderline: email the organisers, ship the red-flag tool, keep Open as fallback.
- Trademark confusion: fictional brands and a hard banner.
- Looking like a generic quiz: lead the demo with the payment page and the hijacked chat.
- Teaching scams: defender-only, watermarked text.
- Privacy creep: no accounts, no paste logs, no PIN fields.
- Starting from old code: new repo, after the allowed start.
- Inventing official facts: only quotes and numbers in this PRD and in scenarios.md.
- "Sent by mistake" wording is not an official title: the drill still teaches official rules, and the honesty note stays in the source file.
- Similar products exist: say so, then stress Ghana mobile money, free access, and no login.
- Time pressure: lock MVP first (10 drills, four surfaces, score, checklist, sources, highlighter). Stretch only after that.

---

## 17. Week-by-week plan (27 November to 26 December 2026, 10:00 pm Africa/Accra)

Week 1 (27 November to 3 December):
- Create a new repo and a Next.js app. Add the disclaimer, banner, home, and one working surface.
- Put the 10 drills into data/scenarios.json from scenarios.md.
- Build scenario 1 (chat plus payment page) end to end, including feedback.

Week 2 (4 to 10 December):
- Build WhatsApp-style chat, call script, SMS, scene card, and prompt modal.
- Wire all 10 drills, scoring, and local progress.
- Build checklist and sources pages.

Week 3 (11 to 17 December):
- Build the rule-based red-flag highlighter (this-drill and paste, no storage).
- Phone testing, contrast, typography, and the SIMULATION banner on every fake view.
- Write the README, licence, and a tools-used list.

Week 4 (18 to 26 December):
- Record the 3-minute demo (scenarios 1, 2 and 6) on a real phone or a phone-width capture.
- Deploy on Vercel. Submit on Devpost: name, what it does, how it was built, tools, track, video, public repo, teammates.
- Re-read the disclaimer and trademark rules on the live site.
- Buffer of at least one day before 26 December, 10:00 pm Africa/Accra. Do not leave submission to the last hour.
- Stretch only if the MVP is already submitted or clearly ready: Twi strings, demo-mode button, nothing else.

---

## 18. Devpost submission checklist

- [ ] Project started after the official start, in a new repo
- [ ] Project name: CloScam
- [ ] Tagline and one-line pitch from this PRD
- [ ] Track: AI, Agentic Systems, Cybersecurity, and Dev Tools (or Open if organisers say so)
- [ ] Organisers emailed at projectdextera@gmail.com about the track, if not already confirmed
- [ ] What it does, how it was built, and every tool and library listed
- [ ] Public GitHub (or similar) link
- [ ] Live demo URL (Vercel)
- [ ] Demo video, 3 minutes or less, YouTube or Vimeo, embedding on, showing the app working
- [ ] Every teammate added on Devpost
- [ ] No personal email, phone, student ID, or secrets in the repo
- [ ] No official logos
- [ ] SIMULATION banner visible in the video
- [ ] Official figures worded as in this PRD
- [ ] Submitted before 26 December 2026, 10:00 pm Africa/Accra

---

## 19. Three-minute demo video script

On-screen text should be short. Speak plainly. Film the real phone UI, not slides, except for a 5-second title.

0:00 to 0:15. Title card: "CloScam: shut scammers out before they get in." Voice: "Mobile money fraud in Ghana is often social engineering. The Bank of Ghana's 2025 fraud report recorded 24,124 electronic fraud incidents at payment service providers, with a value at risk of GH¢37 million."
0:15 to 0:25. Open the app. Point to the disclaimer: training only, no real messages, not affiliated with any operator.
0:25 to 1:15. Scenario 1. Show the cheap-data chat, open the fake payment page, pick the correct action (close it, buy from official channels), show the red flags and lesson.
1:15 to 2:10. Scenario 2. Show Kofi's urgent money request and "don't call". Choose "confirm another way". Mention the CSA figure: 187 WhatsApp takeover reports as of April 2024, equal to all of 2023, and that attackers then defraud the person's contacts.
2:10 to 2:40. Scenario 6. Short "upgrade your limit" call. Hang up. On-screen source: a real operator will not ask for your PIN, OTP or a fee.
2:40 to 3:00. Score, checklist, report lines (292, 18555 or 191), and the public repo. End on the tagline. Do not run past 3:00.

---

## 20. Ready-to-paste build prompt

Copy everything in this section into a coding assistant when you are ready to build.

BEGIN BUILD PROMPT

Build CloScam, a free, no-login web app for a student hackathon (GenHacks). It is an in-app social-engineering trainer for Ghana mobile money scams. Tagline: "CloScam: shut scammers out before they get in."

Read and follow the product requirements in CloScam-PRD.md and the full drill scripts in scenarios.md. Do not invent official statistics or official quotes. Do not use MTN, Telecel, AT, MoMo, bank, Bank of Ghana, CSA or Police names or logos in simulated messages or fake pages. Those names may appear only on a Sources page as citations. Use fictional names from the docs (PulsePay, SwiftBundle, GoldRise Daily, Kofi, Ama).

Stack: Next.js (App Router), TypeScript, Tailwind, static JSON for drills, deployable on Vercel. No backend, no database, no auth, no Supabase, no Paystack, no analytics that identify users, no AI required.

Every fake SMS, chat, call, prompt or web page must show a permanent banner: "SIMULATION / TRAINING / NOT AFFILIATED". Never send real messages. Never ask the user to type a PIN, OTP or WhatsApp code. Use choice buttons only. Process any "paste a message" text only in the browser and never store it. No personal data, no accounts, no contacts, no GPS.

Implement all 10 drills from scenarios.md, with the surfaces described there (SMS, WhatsApp-style chat, call script, fake payment page, in-person scene, payment prompt). Include first-run disclaimer, home, drill picker, feedback, first-try scoring, checklist, sources and report lines (CSA 292, WhatsApp 0501603111, Police 18555 or 191), and a rule-based red-flag highlighter (urgency, PIN or code request, "do not call", payment link, too-good price, unofficial-looking number) with a disclaimer that it is a training aid, not a verdict.

Make it mobile-first, accessible, low-data, and calm in tone. Shuffle choices at runtime but keep the correct answer in the data file. Optional localStorage for progress only (drill ids and first-try results, no names).

Also add a README that lists every tool, states that no personal data is collected, and describes the project clearly for Devpost.

Do not add features outside the MVP unless I ask: no Twi, no AI roleplay, no leaderboard, no sound, no official brand assets.

END BUILD PROMPT

End of PRD.
