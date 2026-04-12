import LegalLayout from "./LegalLayout";

const toc = [
  "Information We Collect",
  "How We Use Information",
  "Data Sharing",
  "Data Security",
  "Data Retention",
  "Children's Privacy",
  "Changes to This Policy",
];

const sections = [
  {
    heading: "Information We Collect",
    content: [
      "We may collect: full name, email address, phone number, reservation details, vendor business information, and device/browser information.",
      "Payment confirmations are collected for record-keeping. Payment card details are processed securely by third-party providers and are not stored by Rhace.",
    ],
  },
  {
    heading: "How We Use Information",
    content: [
      "To process reservations and facilitate vendor payments.",
      "To communicate confirmations, updates, and support.",
      "To improve platform performance and prevent fraud.",
    ],
  },
  {
    heading: "Data Sharing",
    content: [
      "We may share data with vendors to fulfill reservations, with payment processors, and with legal authorities when required by law.",
      "We do not sell personal data.",
    ],
  },
  {
    heading: "Data Security",
    content: "We implement reasonable security measures to protect user data. However, no system is completely secure and we cannot guarantee absolute security.",
  },
  {
    heading: "Data Retention",
    content: [
      "We retain personal data as long as necessary for account management, legal compliance, and dispute resolution.",
      "Users may request account deletion subject to legal obligations.",
    ],
  },
  {
    heading: "Children's Privacy",
    content: "The Reservation Platform is not intended for individuals under 18 years old. We do not knowingly collect data from minors.",
  },
  {
    heading: "Changes to This Policy",
    content: "We may update this Privacy Policy periodically. Updates will be posted on this page with a revised effective date. Continued use of our platforms after changes constitutes acceptance of the updated policy.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      tag="Legal"
      title="Privacy Policy"
      effective="January 1, 2026"
      sections={sections}
      toc={toc}
    />
  );
}