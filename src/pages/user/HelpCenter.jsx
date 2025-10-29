import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { HelpCircle, CalendarCheck, CreditCard, ShieldCheck, CircleQuestionMark } from "lucide-react";

export default function HelpCenterRhace() {
  const categories = [
    {
      icon: <CircleQuestionMark className="text-primary w-10 h-10" />,
      title: "General Questions",
      faqs: [
        {
          q: "What is Rhace and what services do you provide?",
          a: "Rhace is Africa’s all-in-one lifestyle booking platform. We partner with hotels, restaurants and clubs so that users can browse, reserve and book accommodations, dining tables or club entry — all from one place."
        },
        {
          q: "Which countries do you operate in?",
          a: "We currently operate in Nigeria, Kenya and Ghana. We are expanding rapidly and expect to launch in 10+ African countries by the end of 2026."
        },
      ]
    },
    {
      icon: <CalendarCheck className="text-primary w-10 h-10" />,
      title: "Bookings & Reservations",
      faqs: [
        {
          q: "How do I make a booking?",
          a: "Search for your desired hotel, restaurant or club in your city, select your date/time, pick your preferred option and click ‘Book’. Follow the steps to confirm your booking and pay (if required). A confirmation email or SMS will be sent."
        },
        {
          q: "Can I modify or cancel my booking?",
          a: "Yes — depending on the venue’s policy. Many restaurants allow free modifications up to 24 hours before, and hotels often permit cancellations 48 hours prior. Please check each listing for details."
        },
      ]
    },
    {
      icon: <CreditCard className="text-primary w-10 h-10" />,
      title: "Payments & Billing",
      faqs: [
        {
          q: "What payment methods do you accept?",
          a: "We accept major credit/debit cards and secure mobile payments where available. For many African markets, mobile money or local payment methods may also be supported."
        },
        {
          q: "When am I charged?",
          a: "It depends on the venue. Some bookings require upfront payment, others require payment on arrival or after service. The payment policy is clearly stated during booking."
        },
      ]
    },
    {
      icon: <ShieldCheck className="text-primary w-10 h-10" />,
      title: "Safety & Policies",
      faqs: [
        {
          q: "How do you verify partner venues?",
          a: "Our team personally reviews each venue before listing — verifying licence, hygiene, reviews and service quality. We also monitor ongoing feedback to ensure standards."
        },
        {
          q: "What’s your cancellation & refund policy?",
          a: "Each venue sets its own policy which is displayed during booking. If you need help, contact our support team and we’ll assist you in liaising with the venue."
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto mt-20 py-16 px-6">
        <div className="text-center mb-10">
          <HelpCircle className="mx-auto text-primary w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold text-title">Help Center & FAQ</h2>
          <p className="text-gray-700 leading-relaxed mt-2">
            Everything you need to know about booking, payment, safety and using Rhace.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((cat, idx) => (
            <section key={idx}>
              <div className="flex items-center gap-4 mb-4">
                {cat.icon}
                <h3 className="text-2xl font-semibold text-title">{cat.title}</h3>
              </div>
              <div className="space-y-6">
                {cat.faqs.map((item,i) => (
                  <div key={i} className="border border-secondary rounded-lg p-6 hover:shadow transition">
                    <h4 className="text-title font-semibold mb-2">{item.q}</h4>
                    <p className="text-gray-700">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Didn’t find the answer you were looking for? Reach out to us at <a href="mailto:support@rhace.africa" className="text-primary underline">support@rhace.africa</a> and we’ll respond within 24 hours.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
