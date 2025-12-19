import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const faqs = [
  {
    question: "How do I upload menu items and drinks to the dashboard?",
    answer:
      'You can easily upload items. Simply navigate to the Menu section, click "Add Items," and either enter details manually or upload a spreadsheet with all your menu items, prices, and descriptions.',
  },
  {
    question: "Can I manage multiple locations from one dashboard?",
    answer:
      "Yes! Rhace supports multi-location management. You can switch between different venues, manage separate menus, staff, and reservations for each location, all from a single dashboard.",
  },
  {
    question: "How does the table reservation system work?",
    answer:
      "Our intelligent reservation system shows real-time table availability. You can set table capacities, manage time slots, and accept bookings from customers. The system automatically prevents double-bookings and sends confirmation notifications.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Rhace integrates with major payment processors including Stripe, PayPal, and Square. You can accept credit cards, debit cards, and digital wallets. All transactions are securely processed and tracked in your dashboard.",
  },
  {
    question: "Can I manage staff schedules and permissions?",
    answer:
      "Absolutely! You can create staff profiles, set role-based permissions, manage shifts, and track performance. Assign different access levels to managers, servers, and other team members to ensure data security.",
  },
  {
    question: "Is there a mobile app for the dashboard?",
    answer:
      "Yes, Rhace is fully responsive and works perfectly on mobile devices. You can manage your business on-the-go from any smartphone or tablet with the same features as the desktop version.",
  },
  {
    question: "What kind of analytics and reports are available?",
    answer:
      "Get comprehensive insights including sales reports, popular menu items, peak hours, staff performance, customer trends, and revenue analytics. Export reports in various formats for accounting and business planning.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We take security seriously. All data is encrypted in transit and at rest, we use industry-standard security protocols, perform regular backups, and comply with data protection regulations. Your business and customer information is always safe.",
  },
];

export function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-blue-50"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full">
            FAQ
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900">
            Frequently Asked <span className="text-teal-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Rhace
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
              >
                <span className="text-lg text-gray-900 pr-8">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-teal-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-teal-600" />
                  )}
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <motion.button
            onClick={() => navigate("/contact")}
            className="px-8 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
