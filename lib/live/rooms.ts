export type Speaker = "them" | "you" | "note";

export type HistoryLine = {
  from: "them" | "you";
  text: string;
  when: string;
};

export type Incoming =
  | { kind: "chat"; from: Speaker; text: string; log?: string }
  | { kind: "sms"; sender: string; text: string; reveal?: string; log?: string };

export type Follow =
  | { kind: "chat"; from: Speaker; text: string; log?: string }
  | { kind: "sms"; sender: string; text: string; reveal?: string; log?: string }
  | { kind: "balance"; delta: number; label: string }
  | { kind: "site"; url: string; title: string; body: string };

export type RoomOption = {
  id: string;
  label: string;
  correct: boolean;
  follow: Follow[];
};

export type Reveal = {
  original: string;
  english: string;
  why: string;
};

export type Room = {
  id: string;
  surface: "chat" | "sms" | "call" | "scene";
  contact: string;
  detail: string;
  brief: string;
  objective: string;
  pressure: string;
  history?: HistoryLine[];
  incoming: Incoming[];
  options: RoomOption[];
  reveal?: Reveal;
  related?: { href: string; label: string }[];
};

export const TRAINING_BALANCE = 1200;

const CHINESE_OTP = "【WhatsApp】你的验证码是 382-194，请勿告诉他人。";

const OTP_REVEAL: Reveal = {
  original: CHINESE_OTP,
  english: "[WhatsApp] Your verification code is 382-194. Do not tell anyone else.",
  why: "The scammer starts a WhatsApp registration for your number on a phone set to Chinese. WhatsApp sends the registration SMS in the language of that phone. The warning not to share is in the text. You cannot read it.",
};

export const ROOMS: Room[] = [
  {
    id: "s01-data-payment-link",
    surface: "chat",
    contact: "SwiftBundle",
    detail: "Not in your contacts",
    brief:
      "A status offers 20GB for GHS 15. The seller will not send a payment link first. They want the money sent to their number. The redeem page comes after.",
    objective: "Do not send money. Buy data from your network's own menu.",
    pressure: "They want the transfer now",
    incoming: [
      {
        kind: "chat",
        from: "note",
        text: "Status from SwiftBundle: 20GB for GHS 15. Today only.",
      },
      {
        kind: "chat",
        from: "them",
        text: "Hi. 20GB for only GHS 15. Official price is much higher. Send the GHS 15 to 055 441 9088 first. When it lands I will send the redeem link.",
        log: "Price is far below a normal data bundle, and they want a transfer before delivery.",
      },
      {
        kind: "chat",
        from: "them",
        text: "Do it now. I do not take a payment link. The money has to hit my number before I release the bundle.",
      },
    ],
    options: [
      {
        id: "send",
        label: "Send GHS 15 to 055 441 9088",
        correct: false,
        follow: [
          { kind: "chat", from: "you", text: "Sent. GHS 15 to 055 441 9088." },
          { kind: "balance", delta: -15, label: "Transfer to 055 441 9088" },
          {
            kind: "chat",
            from: "them",
            text: "Received. Redeem the bundle here: redeem-swiftbundle.online/bundle. Enter your PulsePay number and PIN to activate.",
            log: "The link arrives only after the money has left.",
          },
          {
            kind: "site",
            url: "redeem-swiftbundle.online/bundle",
            title: "Activate bundle",
            body: "Enter your PulsePay number and PIN to release 20GB. Powered by PulsePay.",
          },
          {
            kind: "chat",
            from: "note",
            text: "SwiftBundle has blocked you. The bundle never arrived. GHS 15 is gone.",
          },
        ],
      },
      {
        id: "official",
        label: "Do not send. Buy data from the official menu.",
        correct: true,
        follow: [
          {
            kind: "chat",
            from: "you",
            text: "No. I buy data from my network's own menu.",
          },
          {
            kind: "chat",
            from: "them",
            text: "Your loss. This price ends tonight.",
          },
          {
            kind: "chat",
            from: "note",
            text: "You left the chat. Training balance is unchanged.",
          },
        ],
      },
      {
        id: "haggle",
        label: "Ask for GHS 10, then send that",
        correct: false,
        follow: [
          { kind: "chat", from: "you", text: "Make it GHS 10 and I will send." },
          {
            kind: "chat",
            from: "them",
            text: "Fine. GHS 10 to the same number, 055 441 9088. Then I send the link.",
          },
          { kind: "balance", delta: -10, label: "Transfer to 055 441 9088" },
          {
            kind: "site",
            url: "redeem-swiftbundle.online/bundle",
            title: "Activate bundle",
            body: "Enter your PulsePay number and PIN to release the bundle.",
          },
          {
            kind: "chat",
            from: "note",
            text: "Same ending. The money left first. The bundle did not come.",
          },
        ],
      },
      {
        id: "friend",
        label: "Forward the number so a friend can try it",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "you",
            text: "I sent the number to a friend.",
          },
          {
            kind: "chat",
            from: "note",
            text: "Your friend now has the same pitch: pay first, link later.",
          },
        ],
      },
    ],
  },
  {
    id: "s02-hijacked-whatsapp",
    surface: "chat",
    contact: "Kofi",
    detail: "Saved line 024 318 2201",
    brief:
      "This is Kofi's existing chat: his name, his photo, and yesterday's messages. He is not writing from a new number. The wallet he names is not the line you save for him.",
    objective: "Call the saved line before you send anything.",
    pressure: "He says not to call",
    history: [
      { from: "them", text: "The trotro was full. I will come tomorrow.", when: "Yesterday" },
      { from: "you", text: "Okay. Call when you get home.", when: "Yesterday" },
    ],
    incoming: [
      {
        kind: "chat",
        from: "them",
        text: "Bro I am stuck. My PulsePay wallet is empty and this line has a problem.",
        log: "Urgent help, inside a chat you already trust.",
      },
      {
        kind: "chat",
        from: "them",
        text: "Please send GHS 800 to this other number, 055 111 4488. I will pay you back tomorrow. Do not call, the line is not going through.",
        log: "055 is not the saved line 024 318 2201. He says not to call.",
      },
    ],
    options: [
      {
        id: "send",
        label: "Send GHS 800 to 055 111 4488",
        correct: false,
        follow: [
          { kind: "chat", from: "you", text: "Sent to 055 111 4488." },
          { kind: "balance", delta: -800, label: "Transfer to 055 111 4488" },
          {
            kind: "chat",
            from: "them",
            text: "Please add GHS 200. The first one did not cover it. Same number.",
          },
        ],
      },
      {
        id: "call",
        label: "Call 024 318 2201, the line I already save for Kofi",
        correct: true,
        follow: [
          {
            kind: "chat",
            from: "note",
            text: "You called 024 318 2201. Kofi is at work. He did not send those messages. Someone else has his chat.",
          },
        ],
      },
      {
        id: "pin",
        label: "Send my PulsePay PIN so he can pull it",
        correct: false,
        follow: [
          { kind: "chat", from: "you", text: "I sent my PIN." },
          {
            kind: "chat",
            from: "note",
            text: "A PIN in a chat is enough to empty the wallet. Training balance is no longer yours.",
          },
          { kind: "balance", delta: -1200, label: "Wallet emptied" },
        ],
      },
      {
        id: "test",
        label: "Send GHS 200 first as a test",
        correct: false,
        follow: [
          { kind: "balance", delta: -200, label: "Test transfer to 055 111 4488" },
          {
            kind: "chat",
            from: "them",
            text: "It came. Send the rest to the same number.",
          },
        ],
      },
    ],
    related: [
      { href: "/drills/s03-verification-code", label: "How the chat was taken: the code" },
      { href: "/call", label: "The other door: a security call" },
    ],
  },
  {
    id: "s03-verification-code",
    surface: "chat",
    contact: "Ama",
    detail: "Saved contact",
    brief:
      "Ama is already in your chats. The ask is to vote, or to return a code she says she sent to your number. The text that arrives is a WhatsApp registration SMS, in Chinese, because the registration was started on a phone set to Chinese.",
    objective: "Do not forward a code you cannot read.",
    pressure: "She is waiting for the code",
    history: [
      { from: "them", text: "Send my greetings to your mother.", when: "Last week" },
      { from: "you", text: "I will.", when: "Last week" },
    ],
    incoming: [
      {
        kind: "chat",
        from: "them",
        text: "Hi. Please help me vote on my link. I sent a code to your number by mistake. Send it to me. Thanks.",
        log: "A saved contact wants a code. Voting does not need your registration code.",
      },
      {
        kind: "sms",
        sender: "Text message",
        text: CHINESE_OTP,
        reveal: OTP_REVEAL.english,
        log: "The text is not in a language you read.",
      },
    ],
    reveal: OTP_REVEAL,
    options: [
      {
        id: "send",
        label: "Send the code to Ama",
        correct: false,
        follow: [
          { kind: "chat", from: "you", text: "I forwarded the code." },
          {
            kind: "chat",
            from: "note",
            text: "That code finished a WhatsApp registration. The account is no longer only yours.",
          },
          {
            kind: "chat",
            from: "them",
            text: "New message, sent as you, to Mum: Please send GHS 500 to 055 902 4410. My wallet is blocked.",
            log: "Your contacts are now the next targets.",
          },
        ],
      },
      {
        id: "keep",
        label: "Do not send it. Turn on two-step verification.",
        correct: true,
        follow: [
          {
            kind: "chat",
            from: "note",
            text: "You did not forward the code. The registration cannot finish. Two-step verification asks for a PIN that stays with you, so a code alone is not enough next time.",
          },
        ],
      },
      {
        id: "partial",
        label: "Send only the first three digits",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "them",
            text: "Send all of it. Three digits cannot verify.",
          },
          {
            kind: "chat",
            from: "note",
            text: "A partial code is still the registration code. Do not send any of it.",
          },
        ],
      },
      {
        id: "swap",
        label: "Ask Ama to send her code first",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "them",
            text: "Mine already went through. I only need yours.",
          },
          {
            kind: "chat",
            from: "note",
            text: "Trading codes still gives yours away.",
          },
        ],
      },
    ],
    related: [
      { href: "/call", label: "The other door: PulseLink security call" },
      { href: "/protect", label: "Protection: two-step and recovery" },
      { href: "/drills/s02-hijacked-whatsapp", label: "What your contacts see next" },
    ],
  },
  {
    id: "s04-prize-call",
    surface: "call",
    contact: "Prize desk",
    detail: "+233 55 200 7781",
    brief: "A number you do not know is calling about a prize you did not enter.",
    objective: "Hang up. Do not send a fee or a PIN.",
    pressure: "They want a fee or a PIN on this call",
    incoming: [
      {
        kind: "chat",
        from: "them",
        text: "Congratulations. You have won GHS 5,000 and a phone. Send GHS 50 PulsePay to 055 200 7781, or give me your wallet number and PIN so I can credit you.",
        log: "A prize you did not enter, plus a fee or a PIN.",
      },
    ],
    options: [
      {
        id: "fee",
        label: "Send GHS 50 so I can receive the prize",
        correct: false,
        follow: [
          { kind: "balance", delta: -50, label: "Fee to 055 200 7781" },
          { kind: "chat", from: "them", text: "Good. Now the PIN, so I can release the rest." },
        ],
      },
      {
        id: "pin",
        label: "Give my wallet number and PIN",
        correct: false,
        follow: [
          { kind: "balance", delta: -1200, label: "Wallet emptied after the PIN" },
          { kind: "chat", from: "note", text: "The prize was never coming. The PIN was the point." },
        ],
      },
      {
        id: "hangup",
        label: "Hang up. I did not enter any promo.",
        correct: true,
        follow: [
          { kind: "chat", from: "note", text: "Call ended. You did not send money and you did not share a PIN." },
        ],
      },
      {
        id: "later",
        label: "Ask them to send the prize first, then I will pay the fee",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "them",
            text: "That is not how the desk works. The fee has to come first or the prize moves on.",
          },
        ],
      },
    ],
  },
  {
    id: "s05-fake-care-pin",
    surface: "call",
    contact: "PulsePay Care",
    detail: "+233 24 009 3310",
    brief: "The caller says they are PulsePay Care and that the wallet will be blocked.",
    objective: "Hang up. Use only the care channel you already know.",
    pressure: "Blocked in 10 minutes",
    incoming: [
      {
        kind: "chat",
        from: "them",
        text: "Good afternoon. PulsePay Care. A transfer failed. If you do not confirm now, the wallet will be blocked in 10 minutes. Tell me your PIN, or the code we just sent.",
        log: "A deadline, and a request for a PIN or a code.",
      },
    ],
    options: [
      {
        id: "pin",
        label: "Tell them the PIN so the wallet is not blocked",
        correct: false,
        follow: [{ kind: "balance", delta: -1200, label: "Wallet emptied" }],
      },
      {
        id: "code",
        label: "Read out the code from my text messages",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "note",
            text: "A code read aloud on a call is enough for them to finish whatever they started.",
          },
        ],
      },
      {
        id: "hangup",
        label: "Hang up. Use only the official care channel I already know.",
        correct: true,
        follow: [
          { kind: "chat", from: "note", text: "Call ended. You opened nothing they sent." },
        ],
      },
      {
        id: "link",
        label: "Ask them to text a link, then enter the PIN there",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "them",
            text: "Open the link I am sending and enter the PIN there.",
          },
        ],
      },
    ],
  },
  {
    id: "s06-upgrade-limit",
    surface: "call",
    contact: "PulsePay",
    detail: "Unknown number",
    brief: "A caller offers to raise your wallet limit if you pay a fee and confirm a PIN or OTP.",
    objective: "Hang up. There is no fee and no code for a limit upgrade.",
    pressure: "Offer ends at midnight",
    incoming: [
      {
        kind: "chat",
        from: "them",
        text: "This is PulsePay. We can upgrade your daily limit today if you pay a small fee and confirm your PIN or OTP now. If you wait, the offer expires at midnight.",
        log: "An upgrade you did not ask for, tied to a fee and a code.",
      },
      {
        kind: "sms",
        sender: "055 774 2201",
        text: "Pay GHS 20 to complete your limit upgrade. Reply with your PIN if the fee already left your wallet.",
        log: "The follow-up is from a personal-looking number.",
      },
    ],
    options: [
      {
        id: "pay",
        label: "Pay the fee and give the PIN or OTP",
        correct: false,
        follow: [{ kind: "balance", delta: -20, label: "Upgrade fee" }],
      },
      {
        id: "hangup",
        label: "This is a scam. Hang up and delete the text.",
        correct: true,
        follow: [
          { kind: "chat", from: "note", text: "Call ended. The text is deleted. No fee, no code." },
        ],
      },
      {
        id: "fee-only",
        label: "Pay the fee but refuse the PIN",
        correct: false,
        follow: [{ kind: "balance", delta: -20, label: "Fee with no upgrade" }],
      },
      {
        id: "otp",
        label: "Share the OTP only, because an OTP is not a PIN",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "note",
            text: "An OTP is still a key. You do not read it to a caller.",
          },
        ],
      },
    ],
  },
  {
    id: "s07-too-good-investment",
    surface: "chat",
    contact: "GoldRise Daily",
    detail: "Not in your contacts",
    brief: "Someone who saw you watch a short video is offering GHS 900 back on GHS 300, plus a paid job group.",
    objective: "Do not send money and do not join the group.",
    pressure: "The slot closes in 20 minutes",
    incoming: [
      {
        kind: "chat",
        from: "them",
        text: "Hi. Invest GHS 300 on PulsePay today and get GHS 900 back in 48 hours. No risk. I can add you to our job group. First you pay the GHS 300 registration.",
        log: "Fast return, no risk, and a job that starts with a fee.",
      },
      {
        kind: "chat",
        from: "them",
        text: "Send the PulsePay to 024 888 0101 now, then send me the screenshot. This slot closes in 20 minutes.",
      },
    ],
    options: [
      {
        id: "send",
        label: "Send GHS 300 and the screenshot",
        correct: false,
        follow: [
          { kind: "balance", delta: -300, label: "Transfer to 024 888 0101" },
          { kind: "chat", from: "them", text: "Screenshot received. The group link is next. Do not tell anyone yet." },
        ],
      },
      {
        id: "stop",
        label: "Do not send money. This is a warning sign.",
        correct: true,
        follow: [
          { kind: "chat", from: "note", text: "You did not pay and you did not join the group." },
        ],
      },
      {
        id: "test",
        label: "Send GHS 50 first to test them",
        correct: false,
        follow: [{ kind: "balance", delta: -50, label: "Test transfer" }],
      },
      {
        id: "join",
        label: "Join the group first, then decide tomorrow",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "them",
            text: "You are in. Registration is still GHS 300 before tasks start.",
          },
        ],
      },
    ],
  },
  {
    id: "s08-sent-by-mistake",
    surface: "sms",
    contact: "055 642 1099",
    detail: "Not a saved contact",
    brief:
      "A text says GHS 850 arrived and your balance is now GHS 1,020. Your training wallet is still GHS 1,200.00. The figures do not match because a text is not the wallet.",
    objective: "Do not send money. Check the official wallet.",
    pressure: "They will report you if you delay",
    incoming: [
      {
        kind: "sms",
        sender: "055 642 1099",
        text: "PulsePay Alert: You have received GHS 850 from AMA MENSAH. Your new balance is GHS 1,020. If this was a mistake, reverse now.",
        log: "The text names a balance. The training wallet did not move.",
      },
      {
        kind: "chat",
        from: "them",
        text: "Please. I sent the GHS 850 to you by mistake. It is school fees. Send it back now to 055 642 1099. If you delay I will report you.",
      },
    ],
    options: [
      {
        id: "send",
        label: "Send GHS 850 back because the text shows I received it",
        correct: false,
        follow: [
          { kind: "balance", delta: -850, label: "Sent to 055 642 1099" },
          {
            kind: "chat",
            from: "note",
            text: "Nothing had arrived. You sent your own money.",
          },
        ],
      },
      {
        id: "check",
        label: "Do not send. Check the official wallet. Use official reversal if money really arrived.",
        correct: true,
        follow: [
          {
            kind: "chat",
            from: "note",
            text: "Official wallet still shows GHS 1,200.00. No GHS 850 arrived. You send nothing.",
          },
        ],
      },
      {
        id: "pin",
        label: "Give them my PIN so they can reverse it",
        correct: false,
        follow: [{ kind: "balance", delta: -1200, label: "PIN handed over" }],
      },
      {
        id: "half",
        label: "Send GHS 400 now and the rest later",
        correct: false,
        follow: [{ kind: "balance", delta: -400, label: "Partial send" }],
      },
    ],
  },
  {
    id: "s09-agent-phone",
    surface: "scene",
    contact: "Agent",
    detail: "PulsePay stall",
    brief: "You are at a stall to deposit into your PulsePay wallet. The agent wants the phone and the PIN.",
    objective: "Keep the phone. Enter the PIN yourself. Wait for the official confirmation.",
    pressure: "He says the network is slow",
    incoming: [
      {
        kind: "chat",
        from: "them",
        text: "The network is slow on my side. Give me your phone and your PIN. I will do the deposit. You can wait on the bench.",
        log: "He wants the phone and the PIN, and he wants you to step away.",
      },
    ],
    options: [
      {
        id: "give",
        label: "Give him the phone and the PIN",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "note",
            text: "You are on the bench. The agent has the phone. You cannot see what he approves.",
          },
        ],
      },
      {
        id: "keep",
        label: "Keep the phone. I enter the PIN. I wait for the confirmation.",
        correct: true,
        follow: [
          {
            kind: "chat",
            from: "note",
            text: "You held the phone, entered the PIN yourself, and waited until the official confirmation arrived.",
          },
        ],
      },
      {
        id: "hold",
        label: "Give him the phone but type the PIN while he holds it",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "note",
            text: "He still has the phone. You cannot see the screen he is on.",
          },
        ],
      },
      {
        id: "paper",
        label: "Write the PIN on paper and keep the phone",
        correct: false,
        follow: [
          { kind: "chat", from: "note", text: "The PIN is now on paper in his hand." },
        ],
      },
    ],
  },
  {
    id: "s10-unexpected-prompt",
    surface: "sms",
    contact: "024 300 1199",
    detail: "You did not start a payment",
    brief: "A text tells you to approve a prompt to receive a refund. The prompt is a payment out.",
    objective: "Cancel it. Check the official wallet yourself.",
    pressure: "They say the wallet will freeze",
    incoming: [
      {
        kind: "sms",
        sender: "024 300 1199",
        text: "PulsePay: Approve the prompt on your screen to receive your refund of GHS 200. If you did not request this, still approve, or your wallet will freeze.",
        log: "A refund that tells you to approve a payment.",
      },
      {
        kind: "chat",
        from: "note",
        text: "Prompt: Pay GHS 200.00 to 024 300 1199. Enter PIN to approve.",
      },
    ],
    options: [
      {
        id: "pin",
        label: "Enter my PIN so the wallet does not freeze",
        correct: false,
        follow: [
          { kind: "balance", delta: -200, label: "Paid 024 300 1199" },
          {
            kind: "chat",
            from: "note",
            text: "That was a payment out, not a refund in.",
          },
        ],
      },
      {
        id: "cancel",
        label: "Cancel the prompt. I did not start this payment.",
        correct: true,
        follow: [
          { kind: "chat", from: "note", text: "Prompt cancelled. Training balance unchanged." },
        ],
      },
      {
        id: "test",
        label: "Approve it but change the amount to GHS 1",
        correct: false,
        follow: [{ kind: "balance", delta: -1, label: "Test payment still left the wallet" }],
      },
      {
        id: "call",
        label: "Call the number in the text and ask them to confirm",
        correct: false,
        follow: [
          {
            kind: "chat",
            from: "them",
            text: "Yes, approve it. If you cancel, the refund dies.",
          },
        ],
      },
    ],
  },
];

export function getRoom(id: string): Room | undefined {
  return ROOMS.find((room) => room.id === id);
}
