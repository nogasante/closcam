export type SourceGroup = {
  title: string;
  items: { name: string; url?: string; note?: string }[];
};

export const REPORT_LINES: { label: string; value: string }[] = [
  { label: "CSA call or text", value: "292" },
  { label: "CSA WhatsApp", value: "0501603111" },
  { label: "CSA email", value: "report@csa.gov.gh" },
  { label: "Ghana Police Service Cyber Crime Unit", value: "18555 or 191" },
];

export const SOURCE_GROUPS: SourceGroup[] = [
  {
    title: "Report lines",
    items: [
      {
        name: "Cyber Security Authority: call or text 292, WhatsApp 0501603111, email report@csa.gov.gh",
      },
      {
        name: "Ghana Police Service Cyber Crime Unit: 18555 or 191",
        url: "https://police.gov.gh/en/index.php/cyber-crime/",
      },
      {
        name: "MTN published care, cited here only: 100 or 0244300000",
      },
    ],
  },
  {
    title: "Why this training exists",
    items: [
      {
        name: "Bank of Ghana, Banks, SDIs and PSPs 2025 Fraud Report",
        url: "https://www.bog.gov.gh/wp-content/uploads/2026/07/FRAUD-REPORT-2025.pdf",
        note: "In 2025, the number of electronic fraud incidents recorded was 24,124, representing a 54% rise as compared to the 15,673 cases recorded in 2024. In 2025, the PSP sector recorded a value at risk of GH¢37 million, a significant increase from the GH¢19 million reported in 2024. This represents a 95% year-on-year rise. Quote the second figure as value at risk, not as proven losses.",
      },
      {
        name: "Bank of Ghana 2024 Fraud Report",
        url: "https://www.bog.gov.gh/wp-content/uploads/2025/04/NOTICE-NO.-BG-GOV-SEC-2025-09-Publication-of-Banks-SDIS-and-PSPS-2024-Fraud-Report-1.pdf",
        note: "Fraudsters are \"exploiting the vulnerabilities in these digital payment platforms and channels especially through mobile money and social engineering tactics.\"",
      },
      {
        name: "Bank of Ghana, Digital Fraud and the Cost of Ignorance, 7 October 2026",
        url: "https://www.bog.gov.gh/wp-content/uploads/2026/10/PRESS-RELEASE-DIGITAL-FRAUD-AND-THE-COST-OF-IGNORANCE-071026.pdf",
        note: "No legitimate bank, mobile money operator, payment service provider, or financial institution will request your PIN, password, or OTP via phone calls, text messages, emails, or social media.",
      },
    ],
  },
  {
    title: "Alerts used in the drills",
    items: [
      {
        name: "CSA, Ways to Avoid Being a Victim of Mobile Money Fraud",
        url: "https://www.csa.gov.gh/mobile_money_fraud.php",
      },
      {
        name: "CSA, Online shopping scam, Black Friday deals, 28 November 2025",
        url: "https://csa.gov.gh/cert-gh-alert41.php",
        note: "The CSA recorded a total of 266 cases of online shopping fraud from January to October 2025, with monetary losses of over GHS 600,000.",
      },
      {
        name: "CSA, Fraudulent Online Business Impersonation Schemes, 30 April 2026",
        url: "https://www.csa.gov.gh/cert-gh-alert44.php",
        note: "From January 1 to April 26, 2026, the CSA received fifty-four (54) such cases, which have resulted in a total financial loss of GHS 266,195.00.",
      },
      {
        name: "CSA, Surge in WhatsApp Account Takeovers, 29 May 2024",
        url: "https://www.csa.gov.gh/cert-gh-alert27.php",
        note: "One hundred and eighty-seven (187) reports have been recorded as of April 2024, equalling what was recorded for the entire year of 2023. After codes are shared, attackers impersonate the victims and defraud their contacts.",
      },
      {
        name: "CSA, WhatsApp Account Takeover, 31 October 2023",
        url: "https://www.csa.gov.gh/cert-gh-alert21.php",
      },
      {
        name: "CSA, Fraudulent Online Investment Schemes, 6 July 2026",
        url: "https://www.csa.gov.gh/cert-gh-alert45.php",
        note: "In the first six (6) months of 2026, the CSA recorded 352 of such cases, amounting to a total financial loss of GHS 3,429,447.",
      },
      {
        name: "CSA, investment alert, 31 January 2025",
        url: "https://www.csa.gov.gh/cert-gh-alert36.php",
      },
      {
        name: "CSA alerts list",
        url: "https://csa.gov.gh/cert-gh-alerts",
      },
      {
        name: "MTN Ghana, SCAM ALERT: Protect Your Personal Information, 11 May 2026",
        url: "https://mtn.com.gh/newsabout/scam-alert-protect-your-personal-information/",
      },
      {
        name: "MTN Help Center, Someone called to upgrade my limit. What should I do?",
        url: "https://help-center.mtn.com.gh/hc/en-us/articles/41113765891218-Someone-called-to-upgrade-my-limit-What-should-I-do",
      },
      {
        name: "MTN Help Center, How Can I Keep My MoMo Wallet Safe?",
        url: "https://help-center.mtn.com.gh/hc/en-us/articles/36643577740690-How-Can-I-Keep-My-MoMo-Wallet-Safe",
      },
      {
        name: "WhatsApp Help, Received verification code without requesting it",
        url: "https://faq.whatsapp.com/479314433984258",
      },
      {
        name: "WhatsApp Help, How to recover a compromised account",
        url: "https://faq.whatsapp.com/1131652977717250",
      },
      {
        name: "WhatsApp Help, Two-step verification",
        url: "https://faq.whatsapp.com/506595211487528",
      },
    ],
  },
];
