import LegalLayout from "./LegalLayout";

const toc = [
  "Eligibility",
  "Description of Services",
  "Payments & Commissions",
  "Vendor Responsibilities",
  "User Responsibilities",
  "Cancellations",
  "Disputes",
  "Limitation of Liability",
  "Termination",
  "Governing Law",
];

const sections = [
  {
    heading: "Eligibility",
    content: [
      "You must be at least 18 years old to use the Reservation Platform.",
      "Vendors using the SaaS or Reservation platform must be legally operating businesses.",
      "By using Rhace, you confirm that all information provided is accurate and complete.",
    ],
  },
  {
    heading: "Description of Services",
    content: [
      "Restaurant Back Office (SaaS): Provides restaurants with digital tools including QR code menus, digital ordering, bill splitting, inventory tracking, performance tracking, and financial tracking — offered on a monthly subscription basis.",
      "Rhace does not take commission on SaaS subscription revenue and is responsible for technical functionality only.",
      "Rhace is not responsible for food quality, staff conduct, business operations, or customer experience inside any restaurant.",
      "Reservation Marketplace: Allows users to search venues, select dates, view menus or room listings, make full or partial payments, and reserve tables, rooms, or event spaces.",
      "Rhace acts solely as a technology intermediary between users and vendors. Rhace does not own, manage, or control any listed venue.",
    ],
  },
  {
    heading: "Payments & Commissions",
    content: [
      "SaaS vendors agree to pay a recurring monthly subscription fee. Failure to pay may result in suspension or termination.",
      "Reservation Platform users may pay full amounts, partial amounts, or reservation deposits.",
      "Payments are processed through third-party providers (e.g., Paystack). Rhace deducts an agreed commission percentage per reservation.",
      "Vendors are paid daily, subject to payment processor settlement timelines. Rhace is not responsible for delays caused by payment processors or banks.",
    ],
  },
  {
    heading: "Vendor Responsibilities",
    content: [
      "Vendors are solely responsible for the accuracy of listings, menu and pricing updates, reservation fulfillment, customer service, and setting cancellation policies.",
      "Vendors must honor confirmed reservations unless exceptional circumstances apply.",
    ],
  },
  {
    heading: "User Responsibilities",
    content: [
      "Users agree to provide accurate booking details, honor confirmed reservations, follow venue policies, and avoid fraudulent activity.",
      "No-shows may result in forfeited deposits, depending on vendor policy.",
    ],
  },
  {
    heading: "Cancellations",
    content: [
      "Cancellation policies are set by each vendor. Users are responsible for reviewing vendor cancellation rules before confirming bookings.",
      "Rhace does not control individual vendor cancellation timelines.",
    ],
  },
  {
    heading: "Disputes",
    content: [
      "Rhace may assist in facilitating communication between users and vendors.",
      "Service quality disputes remain the responsibility of the vendor. Rhace does not guarantee refunds.",
      "Rhace reserves the right to suspend or remove vendors or users who violate policies.",
    ],
  },
  {
    heading: "Limitation of Liability",
    content: [
      "Rhace is not liable for service quality at venues, personal injury at venues, loss of business revenue, or indirect or consequential damages.",
      "Rhace's liability shall not exceed the commission earned from the specific transaction in dispute.",
    ],
  },
  {
    heading: "Termination",
    content: [
      "Rhace may suspend or terminate accounts for fraud, abuse of platform, or violation of these Terms.",
    ],
  },
  {
    heading: "Governing Law",
    content: "These Terms are governed by the laws of the Federal Republic of Nigeria.",
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      tag="Legal"
      title="Terms & Conditions"
      effective="January 1, 2026"
      sections={sections}
      toc={toc}
    />
  );
}