import LegalLayout from "./LegalLayout";

const toc = [
  "What Are Cookies",
  "How We Use Cookies",
  "Types of Cookies We Use",
  "Third-Party Cookies",
  "Managing Cookies",
  "Changes to This Policy",
];

const sections = [
  {
    heading: "What Are Cookies",
    content:
      "Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and improve your experience across sessions.",
  },
  {
    heading: "How We Use Cookies",
    content: [
      "To keep you logged in and remember your session preferences.",
      "To understand how users navigate and interact with our platforms.",
      "To improve performance, reliability, and personalization of our services.",
      "To support fraud prevention and security measures.",
    ],
  },
  {
    heading: "Types of Cookies We Use",
    content: [
      "Essential Cookies — required for core platform functionality such as authentication and booking sessions. These cannot be disabled.",
      "Analytics Cookies — help us understand traffic patterns and usage behavior so we can improve our platforms.",
      "Preference Cookies — remember your settings and preferences for a better experience on return visits.",
      "Marketing Cookies — used occasionally to understand the effectiveness of our outreach. We do not sell this data.",
    ],
  },
  {
    heading: "Third-Party Cookies",
    content:
      "Some features on our platforms (such as payment processing and analytics) may set cookies from third-party providers. These are governed by the privacy policies of those providers.",
  },
  {
    heading: "Managing Cookies",
    content: [
      "You can control or disable cookies through your browser settings at any time.",
      "Disabling essential cookies may impact your ability to use certain features of the platform.",
      "Most browsers allow you to view, block, or delete cookies via their settings or preferences menu.",
    ],
  },
  {
    heading: "Changes to This Policy",
    content:
      "We may update this Cookies Policy from time to time. The latest version will always be available on this page with a revised effective date.",
  },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      tag="Legal"
      title="Cookies Policy"
      effective="January 1, 2026"
      sections={sections}
      toc={toc}
    />
  );
}