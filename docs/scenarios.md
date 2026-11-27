# CloScam scenario set

Project: CloScam
Tagline: CloScam: shut scammers out before they get in.
Purpose: In-app social engineering trainer that builds self-awareness so people can spot and refuse Ghana mobile money scams before they lose money.
Legal rule for every screen: show a permanent banner that says "SIMULATION / TRAINING / NOT AFFILIATED". Never send a real SMS, WhatsApp message or call. Never ask the user to type a real PIN, OTP or WhatsApp code. Use choice buttons only. Use fictional provider and shop names only. Do not use MTN, Telecel, AT, MoMo, bank, Bank of Ghana, Cyber Security Authority or Police names or logos in the simulated messages or fake pages. Those official names may appear only on the Sources and report-lines screen, as citations.

How to read this file: each drill has a title, surface, difficulty, the fake script, 2 to 4 choices with the correct one marked, red flags, a one-line lesson, and the official advice source. Build the app from this text and from /workspace/closcam/CloScam-PRD.md.

## Source check for the two headline scams

### 1. Fake payment page or payment-request link posed as a data or service sale

Official Ghana sources confirm this family of tricks, even though I did not find an official page that uses the exact words "payment request link" or "request to pay".

- Cyber Security Authority (CSA), "Online shopping scam, Black Friday deals", 28 November 2025, Ref: CSA/CERT/MPA/2025-11/01, https://csa.gov.gh/cert-gh-alert41.php (live when checked). "The CSA recorded a total of 266 cases of online shopping fraud from January to October 2025, with monetary losses of over GHS 600,000." Fake online shops sell "non-existent goods and services at too-good-to-be-true prices." After "advance payments to mobile money wallets of the scammers, which usually do not bear the names of the supposed shops, victims are blocked and do not receive what they paid for." Phishing also lures people "via email, WhatsApp message, or SMS, to click on links that lead to legitimate looking but fraudulent shopping sites." Advice includes checking official contact details, being cautious of deals that seem too good to be true, and preferring payment after delivery.
- CSA, "Fraudulent Online Business Impersonation Schemes", 30 April 2026, Ref: CSA/CERT/MPA/2026-04/01, https://www.csa.gov.gh/cert-gh-alert44.php (live when checked). "From January 1 to April 26, 2026, the CSA received fifty-four (54) such cases, which have resulted in a total financial loss of GHS 266,195.00." Victims were "instructed to complete online forms requesting their phone number, mobile network, transaction amount, and mobile money PIN." Advice: "Never disclose sensitive information such as mobile money PINs, OTPs, or banking credentials to anyone." "Confirm payment requests directly with verified business representatives using trusted contact details."
- MTN Ghana, "SCAM ALERT: Protect Your Personal Information", 11 May 2026, https://mtn.com.gh/newsabout/scam-alert-protect-your-personal-information/ (live when checked). "Don't Click Hastily: Avoid clicking on links sent via WhatsApp, SMS or email from unknown numbers or sources you don't recognize." "Avoid links promising urgent action, money, or deals that seem too good to be true." "Use official apps or websites directly instead." "MTN Ghana will never ask for your password, PIN, or full credit card details via a text link or social media message."
- Bank of Ghana press release, "Digital Fraud and the Cost of Ignorance", 7 October 2026, https://www.bog.gov.gh/wp-content/uploads/2026/10/PRESS-RELEASE-DIGITAL-FRAUD-AND-THE-COST-OF-IGNORANCE-071026.pdf (live when checked). "No legitimate bank, mobile money operator, payment service provider, or financial institution will request your PIN, password, or OTP via phone calls, text messages, emails, or social media." "Be cautious of unsolicited phone calls, text messages, emails, social media messages, and online links requesting financial or personal information."

Honesty note: a 2 August 2025 Citi News Room article reported a 1 August 2025 CSA warning about fake cheap data bundle deals, including figures of 63 cases and GH¢73,510 lost from January to July 2025 (https://www.citinewsroom.com/2025/08/csa-warns-as-fake-data-bundle-deals-drain-ghanaian-wallets/). I could not open a matching official page on csa.gov.gh for those exact figures, so do not put 63 or GH¢73,510 in the app or on Devpost unless you later find them on an official CSA page. Use the official shopping and impersonation figures above instead. The CloScam drill is still valid: it is a concrete, Ghana-familiar form of the official "fake shop plus advance mobile money payment plus phishing link" pattern.

### 2. WhatsApp account takeover used to beg contacts for money

This pattern is directly confirmed by official sources.

- CSA, "Surge in WhatsApp Account Takeovers", 29 May 2024, https://www.csa.gov.gh/cert-gh-alert27.php (live when checked). People were "falling victim to social engineering and sharing their WhatsApp verification codes with malicious actors, leading to unauthorised access and account takeover. One hundred and eighty-seven (187) reports have been recorded as of April 2024, equalling what was recorded for the entire year of 2023." After the code is shared, "The malicious actors then impersonate the victims and defraud their contacts." Advice: "Never Share Verification Codes: Treat your verification code like a password; share it with no one." Enable two-step verification: WhatsApp > Settings > Account > Two-step verification > Enable. Keep that PIN confidential.
- CSA, earlier alert "WhatsApp Account Takeover", 31 October 2023, https://www.csa.gov.gh/cert-gh-alert21.php (live when checked). Same method, and: "The malicious actors may then go on to impersonate the victims and defraud their contacts resulting in reputational damage as well as monetary losses." "If you receive a message requesting your verification code unexpectedly, verify the sender's identity through a different communication mode/platform before taking any action."
- WhatsApp Help, "Received verification code without requesting it", https://faq.whatsapp.com/479314433984258 (live when checked). "To keep your account safe, you should never share your WhatsApp verification code with others. If someone is trying to take over your account, they need the SMS verification code sent to your phone number to do so. Without this code, any user attempting to verify your number can't complete the verification process and can't use your phone number on WhatsApp."
- WhatsApp Help, "How to recover a compromised account", https://faq.whatsapp.com/1131652977717250 (live when checked). "You should never share your registration code with others, not even friends or family." "If you suspect that your WhatsApp account is compromised and someone else is using it, you should notify family and friends as this person could impersonate you in chats and groups."
- WhatsApp two-step verification help (page live when checked): https://faq.whatsapp.com/506595211487528

## Wider official figures to use in the impact pitch (not as a claim about one scam type)

- Bank of Ghana, Banks, SDIs and PSPs 2025 Fraud Report, https://www.bog.gov.gh/wp-content/uploads/2026/07/FRAUD-REPORT-2025.pdf (live when checked). "In 2025, the number of electronic fraud incidents recorded was 24,124, representing a 54% rise as compared to the 15,673 cases recorded in 2024." "In 2025, the PSP sector recorded a value at risk of GH¢37 million, a significant increase from the GH¢19 million reported in 2024. This represents a 95% year-on-year rise." Quote this as value at risk, not as proven losses. The PSP sector is the group that includes mobile money operators.
- Bank of Ghana 2024 Fraud Report, https://www.bog.gov.gh/wp-content/uploads/2025/04/NOTICE-NO.-BG-GOV-SEC-2025-09-Publication-of-Banks-SDIS-and-PSPS-2024-Fraud-Report-1.pdf (live when checked). Fraudsters are "exploiting the vulnerabilities in these digital payment platforms and channels especially through mobile money and social engineering tactics."
- CSA, "Ways to Avoid Being a Victim of Mobile Money Fraud", https://www.csa.gov.gh/mobile_money_fraud.php (live when checked). Never give your mobile money PIN to anyone, including agents, telecom workers and friends. "Don't ever give your mobile phone to agents to do a transaction on your behalf." "Beware of scam calls asking you to send mobile money to their accounts to receive cash prizes or asking for your account details."
- CSA, "Fraudulent Online Investment Schemes", 6 July 2026, Ref: CSA/CERT/MPA/2026-07/01, https://www.csa.gov.gh/cert-gh-alert45.php (live when checked). "In the first six (6) months of 2026, the CSA recorded 352 of such cases, amounting to a total financial loss of GHS 3,429,447." These schemes "primarily use social media for advertisements and mobile money for transactions."
- Official report lines (for the end of every drill and the Sources screen): CSA call or text 292, WhatsApp 0501603111, email report@csa.gov.gh. Ghana Police Service Cyber Crime Unit: helpline 18555 or 191, https://police.gov.gh/en/index.php/cyber-crime/. MTN published care: 100 or 0244300000 (cite only on the Sources screen, not inside a fake message).

## Fictional names used in the drills (do not replace with real brands)

- PulsePay: fictional mobile money provider
- PulsePay Care: fictional customer care
- SwiftBundle: fictional cheap data seller
- GoldRise Daily: fictional investment scheme
- Kofi: fictional friend in the user's contact list
- Ama: fictional relative

## The 10 drills

Scenarios 1 and 2 are the headline drills. Scenario 3 teaches the method that makes scenario 2 possible. The rest cover the planned official patterns. PIN and OTP requests are split so the correct action stays clear.

---

### Scenario 1. The cheap data payment link (headline)

Difficulty: Medium
Surface: WhatsApp-style chat, then a fake payment web page
Why it is here: This is one of the two drills requested by the project owner. It trains self-awareness around a seller-controlled payment link or fake checkout.

Setup shown to the user: "A seller you do not know has messaged you on chat about cheap data. You have not bought from them before."

Fake WhatsApp-style messages (all under the SIMULATION banner). Sender name: SwiftBundle. Timestamp: today, 14:03.

SwiftBundle: "Hi. We have 20GB for only GHS 15. Official price is much higher. Pay now and it hits your number in 2 minutes."

SwiftBundle: "Tap this PulsePay request and approve. I have already entered the amount. pay-swiftbundle.online/request/15"

The fake page then opens inside the app, still under the SIMULATION banner. Page title: "PulsePay payment request". Merchant line: "SWIFT BUNDLE DEALS". Amount: "GHS 15.00". Button: "Approve and enter PIN". Small print: "Powered by PulsePay" (fictional). The page URL bar shows: pay-swiftbundle.online/request/15 (not an official provider domain).

Choices (one is correct):

A. Approve the request and enter my PIN so the data can load. (Wrong)
B. Close the page, ignore the chat, and buy data only from my network's official menu or official app. (Correct)
C. Ask the seller to cut the price to GHS 10, then approve the new request. (Wrong)
D. Send the link to a friend so they can try the deal first. (Wrong)

Red flags to highlight after the answer:
- The price is far below a normal data price.
- The seller is unknown and messaged you first.
- The link is not your official provider app or official USSD menu.
- The seller set the amount and is asking you to approve a payment request, which sends your money to them.
- The fake page asks you to enter a PIN.

One-line lesson: If a stranger sends a payment link for a cheap deal, you are approving their price, not buying from your network.

Official advice sources: CSA Black Friday shopping alert, 28 November 2025 (fake shops, advance payments to wallets that do not bear the shop name, phishing links to fraudulent sites), https://csa.gov.gh/cert-gh-alert41.php. CSA business impersonation alert, 30 April 2026 (payment requests and forms that ask for a mobile money PIN), https://www.csa.gov.gh/cert-gh-alert44.php. MTN Ghana scam alert, 11 May 2026 (do not click unknown links, use official apps or sites, they will not ask for a PIN via a text link or social message), https://mtn.com.gh/newsabout/scam-alert-protect-your-personal-information/. Bank of Ghana, 7 October 2026 (no legitimate operator will request your PIN, password or OTP by call, text, email or social media).

---

### Scenario 2. The hijacked WhatsApp (headline)

Difficulty: Medium
Surface: WhatsApp-style chat
Why it is here: This is the second drill requested by the project owner. Official CSA alerts say that once a WhatsApp account is taken over, the attackers "impersonate the victims and defraud their contacts."

Setup shown to the user: "A chat arrives from Kofi, a friend already in your contacts. The profile photo looks like him."

Fake WhatsApp-style messages. Sender: Kofi. Timestamp: today, 21:17.

Kofi: "Bro, please I need help. My line is having issues so I am texting from this WhatsApp only."

Kofi: "I need GHS 800 now for an emergency at the hospital. Please send it to this number, 055 111 4488. I will pay you back tomorrow. Don't call, my airtime is finished."

Choices:

A. Send the GHS 800 to 055 111 4488 because the chat is coming from Kofi's WhatsApp. (Wrong)
B. Call or visit Kofi using a number or method I already know, and only send money if I confirm it is really him. (Correct)
C. Reply with my PulsePay PIN so he can pull the money himself and pay me back later. (Wrong)
D. Send GHS 200 first as a test, then send the rest if he says thanks. (Wrong)

Red flags:
- Urgent money request, late at night, with pressure not to call.
- A new number that is not the one you already associate with Kofi.
- "Don't call" is a common way to stop you checking.
- A real friend's account can still be in a scammer's hands after a takeover.
- Official advice is to verify through a different channel, not through the same chat.

One-line lesson: A message from a friend's WhatsApp is not proof it is your friend. Confirm by calling or seeing them another way before you send money.

Official advice sources: CSA, 29 May 2024, 187 reports as of April 2024, attackers "impersonate the victims and defraud their contacts", https://www.csa.gov.gh/cert-gh-alert27.php. CSA, 31 October 2023, verify unexpected requests "through a different communication mode/platform", https://www.csa.gov.gh/cert-gh-alert21.php. WhatsApp Help: if an account is compromised, "notify family and friends as this person could impersonate you in chats and groups", https://faq.whatsapp.com/1131652977717250.

---

### Scenario 3. The verification code trap

Difficulty: Easy
Surface: WhatsApp-style chat, with a simulated SMS preview (the SMS is also marked SIMULATION and is not a real code)
Why it is here: This is how WhatsApp takeovers usually start. It belongs next to scenario 2 so users learn both sides: do not give out your code, and do not trust a hijacked chat.

Setup: "Someone in a group you belong to, who says they are the group admin, has messaged you privately."

Fake chat. Sender: Group Admin (Ama).

Ama: "Hi, we are upgrading the group today. WhatsApp will send you a 6-digit code now. Please send me the code so I can add you to the new group. If you don't, you will be removed tonight."

A simulated SMS then appears in a small preview: "Your WhatsApp code is 382 194. Do not share this code." (This is a fake number for the drill. The app must never display a real code from the user's phone, and the user must never be asked to type one.)

Choices:

A. Send 382 194 to Ama so I am not removed from the group. (Wrong)
B. Ignore the request and never share a WhatsApp code with anyone. Turn on two-step verification. (Correct)
C. Send only the first three digits, to be careful. (Wrong)
D. Ask Ama to send her code first, then I will send mine. (Wrong)

Red flags:
- Nobody who is a real group admin needs your WhatsApp code.
- Urgency and a threat of being removed.
- The official WhatsApp SMS itself says not to share the code.
- Sharing the code can hand your account to someone else, who can then message your family for money (see scenario 2).

One-line lesson: Your WhatsApp code is a key to your account. Never share it, not even with a friend or a group admin.

Official advice sources: CSA, 29 May 2024, "Never Share Verification Codes: Treat your verification code like a password; share it with no one", plus two-step verification steps, https://www.csa.gov.gh/cert-gh-alert27.php. WhatsApp Help: "you should never share your WhatsApp verification code with others", https://faq.whatsapp.com/479314433984258. WhatsApp Help: "You should never share your registration code with others, not even friends or family", https://faq.whatsapp.com/1131652977717250. Two-step verification: https://faq.whatsapp.com/506595211487528.

---

### Scenario 4. The prize call

Difficulty: Easy
Surface: Call script
Setup: "Your phone rings from a number you do not know."

Call script (shown line by line, under the SIMULATION banner). Caller ID: +233 55 200 7781. Caller voice label: "Prize desk".

Caller: "Congratulations! You have won GHS 5,000 and a new phone in our customer promo. To release the prize, send GHS 50 PulsePay to 055 200 7781 as a processing fee, or give me your wallet number and PIN so I can credit you."

Choices:

A. Send GHS 50 so I can receive the prize. (Wrong)
B. Give my wallet number and PIN so they can credit me directly. (Wrong)
C. Hang up. Do not send money or share a PIN. I did not enter any promo. (Correct)
D. Ask them to send the prize first, then I will pay the fee. (Wrong)

Red flags:
- A prize you did not enter.
- A request for a fee, a PIN, or your wallet details by phone.
- Official rule: no legitimate operator will ask for your PIN, password or OTP by phone, text, email or social media.
- CSA warns about scam calls that ask you to send mobile money to receive a cash prize.

One-line lesson: Real prizes do not start with a stranger asking you to send money or share your PIN.

Official advice sources: CSA mobile money fraud advisory, "Beware of scam calls asking you to send mobile money to their accounts to receive cash prizes or asking for your account details", https://www.csa.gov.gh/mobile_money_fraud.php. Bank of Ghana, 7 October 2026, point 2 (no legitimate institution will request your PIN, password or OTP via calls, texts, emails or social media) and point 4 (be cautious of unsolicited calls and messages). MTN Ghana scam alert, 11 May 2026, be sceptical of messages that offer "too good to be true" prizes.

---

### Scenario 5. Fake customer care wants your PIN

Difficulty: Medium
Surface: Call script
Setup: "You get a call. The person says they are from PulsePay Care."

Caller ID: +233 24 009 3310. Caller: "PulsePay Care".

Caller: "Good afternoon. I am from PulsePay Care. We see a failed transfer on your wallet. If you do not confirm now, your wallet will be blocked in 10 minutes. Please tell me your PulsePay PIN, or the code we just sent to your phone, so I can unlock it."

Choices:

A. Tell them the PIN so my wallet is not blocked. (Wrong)
B. Read out the code from my SMS so they can verify me. (Wrong)
C. Hang up. Call or dial only the official care channel I already know. Never give a PIN or code on a call. (Correct)
D. Ask them to SMS me a link, then enter the PIN on that page. (Wrong)

Red flags:
- Fear and a short deadline ("blocked in 10 minutes").
- A request for a PIN or a one-time code by phone.
- Official care will not ask for your PIN or OTP by call, text, email or social media.
- The number may look local. That does not make the caller official.

One-line lesson: Anyone who asks for your PIN or a code, even if they say they are customer care, is not legitimate care.

Official advice sources: Bank of Ghana, 7 October 2026, point 2. CSA mobile money advisory: never give your PIN to anyone, including "workers of any telecommunication network", and those workers "are not to ask you for your PIN", https://www.csa.gov.gh/mobile_money_fraud.php. MTN Ghana: "will never ask for your password, PIN, or full credit card details via a text link or social media message." MTN Help Center, "How Can I Keep My MoMo Wallet Safe?": never disclose your PIN, do not engage unknown calls about your wallet (https://help-center.mtn.com.gh/hc/en-us/articles/36643577740690-How-Can-I-Keep-My-MoMo-Wallet-Safe).

---

### Scenario 6. "Upgrade your wallet limit"

Difficulty: Easy
Surface: Call script, with an optional follow-up SMS
Setup: "A caller says they can raise your wallet limit."

Caller: "This is PulsePay. We can upgrade your daily limit today, but only if you pay a small activation fee and confirm your PIN or OTP now. If you wait, the offer expires at midnight."

Follow-up SMS from a personal-looking number, 055 774 2201: "Pay GHS 20 to complete your limit upgrade. Reply with your PIN if the fee already left your wallet."

Choices:

A. Pay the fee and give the PIN or OTP so the limit goes up. (Wrong)
B. This is a scam. Hang up, delete the SMS, and never share a PIN, OTP or fee for an "upgrade". (Correct)
C. Pay the fee but refuse to give the PIN. (Wrong)
D. Share the OTP only, because an OTP is not a PIN. (Wrong)

Red flags:
- Unsolicited "upgrade" offer.
- A fee plus a request for PIN or OTP.
- Official help text on this exact trick: a real operator will not ask for your PIN, OTP or any fee for this.

One-line lesson: Nobody needs your PIN, OTP or a fee to "upgrade" your wallet.

Official advice sources: MTN Help Center, "Someone called to 'upgrade' my limit. What should I do?", updated 25 November 2026: "No, this is a scam. MoMo will never ask for your PIN, OTP or any fee." https://help-center.mtn.com.gh/hc/en-us/articles/41113765891218-Someone-called-to-upgrade-my-limit-What-should-I-do. Bank of Ghana, 7 October 2026, point 2. Cite these on the Sources screen. In the simulated call, keep using PulsePay, not a real brand.

---

### Scenario 7. The too-good investment (with a job-offer twist)

Difficulty: Medium
Surface: WhatsApp-style chat
Setup: "You saw a short video on social media. Someone has now messaged you privately." (Job and investment are merged because official CSA alerts describe high-return schemes that use social media and mobile money, and job-style "online business tasks" appear in the same official alerts.)

Fake chat. Sender: GoldRise Daily.

GoldRise Daily: "Hi. I saw you liked our post. Invest GHS 300 on PulsePay today and get GHS 900 back in 48 hours. No risk. I can also add you to our WhatsApp job group. First you pay the GHS 300 registration, then you start the online tasks."

GoldRise Daily: "Send the PulsePay to 024 888 0101 now, then send me the screenshot. This slot closes in 20 minutes."

Choices:

A. Send GHS 300 and the screenshot so I can get GHS 900 and the job. (Wrong)
B. Do not send money. High, fast, no-risk returns and a job that starts with a registration fee are warning signs. Check official regulators, not this chat. (Correct)
C. Send GHS 50 first to test whether they really pay. (Wrong)
D. Join the WhatsApp group first, then decide tomorrow. (Wrong. Official advice is to refrain from joining such unsolicited groups.)

Red flags:
- A promise of very high returns in a very short time, with "no risk".
- Pressure to pay in 20 minutes.
- A job or task that starts with you paying them.
- Payment to a personal-looking wallet number, plus a request for a screenshot.
- Official CSA investment alerts describe exactly this pattern: social media ads, mobile money payments, and promised returns that never come.

One-line lesson: If someone promises fast, no-risk money, or a job that starts with a fee, keep your money.

Official advice sources: CSA, 6 July 2026: 352 cases in the first six months of 2026, total financial loss GHS 3,429,447, schemes that "primarily use social media for advertisements and mobile money for transactions", https://www.csa.gov.gh/cert-gh-alert45.php. Bank of Ghana, 7 October 2026, points 5 and 6: verify investments, treat unusually high returns with extreme caution, avoid "double-your-money" and Ponzi-style schemes. CSA, 31 January 2025 earlier investment alert: https://www.csa.gov.gh/cert-gh-alert36.php. CSA alerts list also includes "Job Scams on the Rise", 16 January 2024 (https://csa.gov.gh/cert-gh-alerts). I did not reopen that 2024 job alert in full for extra figures, so do not invent job-scam totals.

---

### Scenario 8. "I sent the money by mistake"

Difficulty: Medium
Surface: SMS, then a follow-up call script
Honesty note: Official BoG and CSA pages strongly support "do not trust suspicious texts", "never share your PIN", and "no legitimate operator will ask you to handle this by sending money yourself". I did not find the exact phrase "I sent money to your number by mistake" on the official PDFs I opened. Teach the official rules. Do not invent an official statistic for this one trick.

Setup: "You receive an SMS, then a call, from a number you do not know."

Fake SMS, sender: 055 642 1099 (a personal-looking number, not an official alphanumeric sender): "PulsePay Alert: You have received GHS 850 from AMA MENSAH. Your new balance is GHS 1,020. If this was a mistake, reverse now."

Then the call. Caller: "Ama, please. I wanted to send the GHS 850 to my sister and I used your number by mistake. It is school fees. Please send it back now to 055 642 1099. If you delay, I will report you."

Choices:

A. Send GHS 850 back to 055 642 1099 straight away, because the SMS shows I received it. (Wrong)
B. Do not send any money. Ignore the SMS as proof. Check my real wallet balance and history in the official menu or official app. If money really arrived, tell the person to use the official reversal process. Never send it to a different number. (Correct)
C. Give them my PIN so they can reverse it themselves. (Wrong)
D. Send GHS 400 now and the rest after I check later. (Wrong)

Red flags:
- The "alert" came from a personal phone number, not a known official channel.
- An SMS is just text. It is not your wallet ledger.
- Pressure, a sad story, and a threat to "report you".
- They want you to send money to a number, instead of using an official reversal.
- Even a real credit should not be sent on by you to a second number.

One-line lesson: Do not send money because of an SMS or a story. Check your official wallet, and let official reversal handle real mistakes.

Official advice sources: CSA mobile money advisory: do not trust texts from suspicious numbers, always verify transaction details, https://www.csa.gov.gh/mobile_money_fraud.php. Bank of Ghana, 7 October 2026, points 2, 4 and 7: no legitimate operator will request your PIN by call or text; be cautious of unsolicited messages; monitor official alerts and statements to detect unauthorised transactions. CSA business impersonation alert: confirm payment requests with verified contacts, never disclose a PIN.

---

### Scenario 9. The agent who wants your phone

Difficulty: Easy
Surface: In-person scene card (short dialogue on screen, not a phone call)
Setup: "You are at a kiosk to deposit money into your PulsePay wallet."

Scene text:

Agent: "The network is slow on my side. Give me your phone and your PIN. I will do the deposit for you quickly. You can wait on the bench."

Choices:

A. Give the agent my phone and PIN so it is faster. (Wrong)
B. Keep my phone. I enter the PIN myself, and I do not leave until I see an official confirmation. (Correct)
C. Give the phone but type the PIN myself while the agent holds it. (Wrong: you have still handed over the phone.)
D. Write my PIN on paper for the agent and keep my phone. (Wrong)

Red flags:
- Anyone asking to hold your phone or to hear your PIN.
- Being asked to step away before you see a confirmation.
- Official advice is explicit: do not give your phone to an agent to do a transaction, and agents are not to ask for your PIN.

One-line lesson: Your phone and your PIN stay in your hands. Wait for the official confirmation before you leave.

Official advice sources: CSA mobile money advisory: "DON'T GIVE YOUR PHONE TO MOBILE MONEY AGENTS." "If you give your phone to an agent to initiate a transaction on your behalf, you expose yourself to being defrauded." "NEVER GIVE YOUR MOBILE MONEY PIN TO ANYONE" including agents. "Whenever you make a deposit at any mobile money merchant shop, make sure you receive a confirmation text before you leave. Make sure the text received is from the said telecom company." https://www.csa.gov.gh/mobile_money_fraud.php.

---

### Scenario 10. The unexpected payment prompt

Difficulty: Medium
Surface: SMS, plus a fake on-screen approval prompt
Setup: "A prompt suddenly appears on your phone while you are not making a payment."

Fake SMS from 024 300 1199: "PulsePay: Approve the prompt on your screen to receive your refund of GHS 200. If you did not request this, still approve, or your wallet will freeze."

Fake prompt (SIMULATION banner still visible): "PulsePay request. Pay GHS 200.00 to 024 300 1199. Enter PIN to approve."

Choices:

A. Enter my PIN, because I do not want my wallet to freeze and I want the refund. (Wrong)
B. Cancel the prompt. I did not start this payment. I will check my official wallet myself. (Correct)
C. Approve it but change the amount to GHS 1 to test. (Wrong)
D. Call the number in the SMS and ask them to confirm. (Wrong: that number belongs to the scammer.)

Red flags:
- A payment prompt you did not start.
- The SMS tells you to approve, and threatens a frozen wallet.
- The prompt is a payment out of your wallet, not a refund in.
- Official operators will not ask you to approve a prompt or share a PIN or OTP through a random SMS.

One-line lesson: If you did not start a payment, cancel the prompt. A "refund" that asks for your PIN is a withdrawal.

Official advice sources: Bank of Ghana, 7 October 2026, points 2, 4 and 7. CSA: never share PINs or OTPs, do not follow instructions in suspicious texts, https://www.csa.gov.gh/mobile_money_fraud.php and https://www.csa.gov.gh/cert-gh-alert44.php. MTN Ghana scam alert: do not click or follow unknown links and messages, and they will not ask for a PIN via a text link or social message.

## Demo recommendation (best 3 for a 3-minute video)

Show these three, in this order. Judging is 25 percent each for Impact, Technical execution, Creativity and Presentation.

1. Scenario 1, the cheap data payment link. Lead with this. It is visually different from a generic email quiz (Creativity and Presentation). The fake checkout page shows Technical execution in the first 30 seconds. Impact is clear: cheap data is a deal almost everyone in Ghana has been offered. It is also one of the two drills the project is built around.
2. Scenario 2, the hijacked WhatsApp. This is the emotional centre of the demo. Official CSA figures (187 reports as of April 2024, equal to all of 2023) support Impact. The "don't call, send money to a new number" script is easy for any judge to follow (Presentation). Together with scenario 1 it shows two different surfaces working (Technical execution).
3. Scenario 6, "Upgrade your wallet limit." It is short, so it fits the last 30 to 40 seconds, and it ends on a crisp official rule: a real operator will not ask for your PIN, OTP or a fee. That gives the video a clean close and a Sources-screen citation, which helps Presentation and Impact.

Do not try to squeeze all 10 drills into the video. After these three, show the score, the reusable checklist, and the official report lines (292, 18555 or 191), then stop.

If you have five extra seconds, mention that scenario 3 (the verification code) is how takeovers start, but do not play it in full.

## Builder notes

- Shuffle choice order in the app, but keep the correct answer in the data file.
- After every drill, show the lesson, the red flags, and a "Report and get help" strip with 292, 18555 or 191, and 0501603111.
- Never collect the user's real name, number, PIN or contacts.
- Optional later: a rule-based red-flag highlighter that only runs on simulated text, or on a paste that is never stored. That is specified in the PRD. It is not required to play these 10 drills.
