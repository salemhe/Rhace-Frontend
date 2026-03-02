import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/user/Header";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Globe,
  Lock,
  RefreshCw,
  Shield,
  User,
  XCircle,
} from "lucide-react";

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

export default function PrivacyPolicy() {
  const privacySections = [
    {
      title: "1. INFORMATION WE COLLECT",
      icon: User,
      content: [
        "We may collect:",
        "• Full name",
        "• Email address",
        "• Phone number",
        "• Reservation details",
        "• Vendor business information",
        "• Device/browser information",
        "• Payment confirmations",
        "Payment card details are processed securely by third-party providers and are not stored by Rhace.",
      ],
    },
    {
      title: "2. HOW WE USE INFORMATION",
      icon: Eye,
      content: [
        "We use information to:",
        "• Process reservations",
        "• Facilitate vendor payments",
        "• Communicate confirmations",
        "• Improve platform performance",
        "• Prevent fraud",
      ],
    },
    {
      title: "3. DATA SHARING",
      icon: Globe,
      content: [
        "We may share data with:",
        "• Vendors (to fulfill reservations)",
        "• Payment processors",
        "• Legal authorities when required",
        "We do not sell personal data.",
      ],
    },
    {
      title: "4. DATA SECURITY",
      icon: Lock,
      content: [
        "We implement reasonable security measures to protect user data.",
        "However, no system is completely secure.",
      ],
    },
    {
      title: "5. DATA RETENTION",
      icon: RefreshCw,
      content: [
        "We retain personal data as long as necessary for:",
        "• Account management",
        "• Legal compliance",
        "• Dispute resolution",
        "Users may request account deletion subject to legal obligations.",
      ],
    },
    {
      title: "6. CHILDREN'S PRIVACY",
      icon: Shield,
      content: [
        "The Reservation Platform is not intended for individuals under 18 years old.",
      ],
    },
    {
      title: "7. CHANGES TO THIS POLICY",
      icon: AlertCircle,
      content: [
        "We may update this Privacy Policy periodically.",
        "Updates will be posted on this page.",
      ],
    },
  ];

  const refundSections = [
    {
      title: "1. VENDOR-CONTROLLED POLICIES",
      icon: Shield,
      content: [
        "Each vendor sets their own cancellation and refund terms.",
        "Users must review vendor policies before confirming reservations.",
      ],
    },
    {
      title: "2. REFUND ELIGIBILITY",
      icon: DollarSign,
      content: [
        "Refunds may apply if:",
        "• Cancellation occurs within vendor's allowed timeframe",
        "• Vendor fails to honor confirmed reservation",
        "• A verified technical error occurs",
      ],
    },
    {
      title: "3. NON-REFUNDABLE CASES",
      icon: XCircle,
      content: [
        "Refunds may not apply in cases of:",
        "• No-show",
        "• Late cancellation",
        "• Violation of vendor rules",
      ],
    },
    {
      title: "4. PROCESSING TIMELINE",
      icon: Clock,
      content: [
        "Approved refunds are processed through the original payment method.",
        "Refunds may take 5–10 business days, subject to bank and payment processor timelines.",
      ],
    },
    {
      title: "5. PLATFORM FEES",
      icon: CreditCard,
      content: [
        "Rhace may retain applicable service or processing fees where permitted.",
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
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Legal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-6xl text-gray-900 mb-6"
            >
              Policy &{" "}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Guidelines
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

      {/* Tabs Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="privacy" className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-2xl h-auto">
                <TabsTrigger
                  value="privacy"
                  className="py-3 px-6 rounded-xl text-sm font-semibold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
                >
                  <Shield className="w-4 h-4 mr-2 inline" />
                  Privacy Policy
                </TabsTrigger>
                <TabsTrigger
                  value="refund"
                  className="py-3 px-6 rounded-xl text-sm font-semibold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
                >
                  <RefreshCw className="w-4 h-4 mr-2 inline" />
                  Refund & Cancellation
                </TabsTrigger>
              </TabsList>
            </motion.div>

            {/* Privacy Policy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              {/* Introduction */}
              <motion.div
                {...fadeInUp}
                className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl text-gray-900">
                    Your Privacy Matters
                  </h2>
                </div>

                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Rhace values your privacy. This Privacy Policy explains how
                    we collect, use, and protect your information.
                  </p>
                  <p>
                    We are committed to protecting your personal information and
                    ensuring you have a secure experience using our platform.
                  </p>
                </div>
              </motion.div>

              {/* Privacy Sections */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                className="space-y-6"
              >
                {privacySections.map((section, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    className="bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-5 h-5 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    <div className="space-y-2 text-gray-600 leading-relaxed ml-13">
                      {section.content.map((item, idx) => (
                        <p key={idx}>{item}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Refund & Cancellation Tab */}
            <TabsContent value="refund" className="space-y-6">
              {/* Introduction */}
              <motion.div
                {...fadeInUp}
                className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl text-gray-900">
                    Refund & Cancellation Policy
                  </h2>
                </div>

                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    We understand that plans change. This policy outlines how
                    cancellations and refunds are handled on the Rhace platform.
                  </p>
                  <p>
                    Please note that refund terms may vary depending on the
                    vendor's specific policies.
                  </p>
                </div>
              </motion.div>

              {/* Refund Sections */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                className="space-y-6"
              >
                {refundSections.map((section, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    className="bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-5 h-5 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    <div className="space-y-2 text-gray-600 leading-relaxed ml-13">
                      {section.content.map((item, idx) => (
                        <p key={idx}>{item}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
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
                Questions about our policies?
              </h2>
              <p className="text-xl text-teal-50 leading-relaxed mb-8">
                If you have any questions or concerns, please reach out to us.
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
