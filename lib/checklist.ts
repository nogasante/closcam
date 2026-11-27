export type ChecklistItem = {
  title: string;
  detail: string;
  sourceName: string;
  sourceUrl: string;
};

export const CHECKLIST: ChecklistItem[] = [
  {
    title: "Never share a PIN, OTP, or WhatsApp code.",
    detail:
      "Treat a code like a key. A friend, a group admin, an agent, or someone who says they are customer care does not need it.",
    sourceName: "CSA mobile money advisory",
    sourceUrl: "https://www.csa.gov.gh/mobile_money_fraud.php",
  },
  {
    title: "Official operators will not ask for a PIN or OTP by call, text, or social media.",
    detail:
      "No legitimate bank, mobile money operator, payment service provider, or financial institution will request your PIN, password, or OTP via phone calls, text messages, emails, or social media.",
    sourceName: "Bank of Ghana, 7 October 2026",
    sourceUrl:
      "https://www.bog.gov.gh/wp-content/uploads/2026/10/PRESS-RELEASE-DIGITAL-FRAUD-AND-THE-COST-OF-IGNORANCE-071026.pdf",
  },
  {
    title: "Check the official wallet menu, not an SMS.",
    detail:
      "An SMS is just text. Open the official menu or official app you already use before you trust a balance, a credit, or a prompt.",
    sourceName: "CSA mobile money advisory",
    sourceUrl: "https://www.csa.gov.gh/mobile_money_fraud.php",
  },
  {
    title: "Confirm a friend's money request another way.",
    detail:
      "A chat from a saved contact can still be someone else. Call or visit using a number or method you already know.",
    sourceName: "CSA WhatsApp takeover alert, 29 May 2024",
    sourceUrl: "https://www.csa.gov.gh/cert-gh-alert27.php",
  },
  {
    title: "Buy data from official channels.",
    detail:
      "A stranger's payment link is their price, not your network's menu. Close the page.",
    sourceName: "CSA online shopping scam alert, 28 November 2025",
    sourceUrl: "https://csa.gov.gh/cert-gh-alert41.php",
  },
  {
    title: "Report it.",
    detail:
      "In real life, report to 292, or 18555 or 191. CSA WhatsApp is 0501603111.",
    sourceName: "Ghana Police Service Cyber Crime Unit",
    sourceUrl: "https://police.gov.gh/en/index.php/cyber-crime/",
  },
];
