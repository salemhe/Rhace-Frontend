import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Shield } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Terms() {
  const sections = [
    {
      title: "ELIGIBILITY",
      content: [
        "You must be at least 18 years old to use the Reservation Platform.",
        "Vendors using the SaaS or Reservation platform must be legally operating businesses.",
        "By using Rhace, you confirm that all information provided is accurate and complete.",
      ],
    },
    {
      title: "2. DESCRIPTION OF SERVICES",
      subtitle: "2.1 Restaurant Back Office (SaaS Platform)",
      content: [
        "The SaaS Platform provides restaurants with digital tools including:",
        "• QR code menu access",
        "• Digital ordering",
        "• Bill splitting",
        "• Inventory tracking",
        "• Performance tracking",
        "• Financial tracking",
        "This service is offered on a monthly subscription basis.",
        "Rhace does not take commission on SaaS subscription revenue.",
        "Rhace is responsible for the technical functionality of the software only.",
        "Rhace is not responsible for: Food quality, Staff conduct, Business operations, Customer experience inside the restaurant.",
      ],
    },
    {
      title: "2.2 Reservation Marketplace Platform",
      content: [
        "The Reservation Platform allows users to:",
        "• Search for venues",
        "• Select date and number of guests",
        "• View menus or room listings",
        "• Make full or partial payments",
        "• Reserve tables, rooms, or event spaces",
        "Rhace acts solely as a technology intermediary between users and vendors.",
        "Rhace does not own, manage, or control any listed venue.",
      ],
    },
    {
      title: "3. PAYMENTS & COMMISSIONS",
      subtitle: "3.1 SaaS Platform",
      content: [
        "Vendors agree to pay a recurring monthly subscription fee.",
        "Failure to pay may result in suspension or termination.",
      ],
    },
    {
      title: "3.2 Reservation Platform",
      content: [
        "Users may:",
        "• Pay full amount",
        "• Pay partial amount",
        "• Pay reservation deposits",
        "Payments are processed through third-party payment providers (e.g., Paystack).",
        "Rhace deducts an agreed commission percentage per reservation.",
        "Vendors are paid daily, subject to payment processor settlement timelines.",
        "(Example: Friday payments may settle on Monday due to banking processes.)",
        "Rhace is not responsible for delays caused by payment processors or banks.",
      ],
    },
    {
      title: "4. VENDOR RESPONSIBILITIES",
      content: [
        "Vendors are solely responsible for:",
        "• Accuracy of listings",
        "• Menu and pricing updates",
        "• Reservation fulfillment",
        "• Customer service",
        "• Setting cancellation policies",
        "Vendors must honor confirmed reservations unless exceptional circumstances apply.",
      ],
    },
    {
      title: "5. USER RESPONSIBILITIES",
      content: [
        "Users agree to:",
        "• Provide accurate booking details",
        "• Honor confirmed reservations",
        "• Follow venue policies",
        "• Avoid fraudulent activity",
        "No-shows may result in forfeited deposits, depending on vendor policy.",
      ],
    },
    {
      title: "6. CANCELLATIONS",
      content: [
        "Cancellation policies are set by each vendor.",
        "Users are responsible for reviewing vendor cancellation rules before confirming bookings.",
        "Rhace does not control individual vendor cancellation timelines.",
      ],
    },
    {
      title: "7. DISPUTES",
      content: [
        "Rhace may assist in facilitating communication between users and vendors.",
        "However:",
        "• Service quality disputes remain the responsibility of the vendor.",
        "• Rhace does not guarantee refunds.",
        "• Rhace reserves the right to suspend or remove vendors or users who violate policies.",
      ],
    },
    {
      title: "8. LIMITATION OF LIABILITY",
      content: [
        "Rhace is not liable for:",
        "• Service quality at venues",
        "• Personal injury at venues",
        "• Loss of business revenue",
        "• Indirect or consequential damages",
        "Rhace's liability shall not exceed the commission earned from the specific transaction in dispute.",
      ],
    },
    {
      title: "9. TERMINATION",
      content: [
        "Rhace may suspend or terminate accounts for:",
        "• Fraud",
        "• Abuse of platform",
        "• Violation of these Terms",
      ],
    },
    {
      title: "10. GOVERNING LAW",
      content: [
        "These Terms are governed by the laws of the Federal Republic of Nigeria.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-52 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-white opacity-60"></div>
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-teal-400 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-teal-100 text-teal-700 rounded-full mb-6"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Legal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-6xl text-gray-900 mb-6"
            >
              Terms &{" "}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Conditions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
            >
              Effective Date: January 1, 2025
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl text-gray-900">Welcome to Rhace</h2>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                These Terms & Conditions ("Terms") govern access to and use of
                the platforms operated under the brand name Rhace ("Rhace",
                "we", "our", or "us").
              </p>
              <p>Rhace operates two services:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-gray-900">
                      Restaurant Back Office Platform
                    </strong>{" "}
                    – a subscription-based SaaS solution for restaurant
                    management.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-gray-900">
                      Rhace Reservation Platform
                    </strong>{" "}
                    – a marketplace application connecting users with
                    restaurants, lounges, clubs, and hotels.
                  </span>
                </li>
              </ul>
              <p>
                By accessing or using any Rhace platform, you agree to these
                Terms.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="space-y-6"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {section.title}
                </h3>
                {section.subtitle && (
                  <p className="text-teal-600 font-medium mb-4">
                    {section.subtitle}
                  </p>
                )}
                <div className="space-y-2 text-gray-600 leading-relaxed">
                  {section.content.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-10 lg:p-14 shadow-2xl text-center text-white relative overflow-hidden"
          >
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl mb-4">
                Questions about these Terms?
              </h2>
              <p className="text-xl text-teal-50 leading-relaxed mb-8">
                If you have any questions or concerns about these Terms, please
                contact us.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-full hover:bg-teal-50 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
