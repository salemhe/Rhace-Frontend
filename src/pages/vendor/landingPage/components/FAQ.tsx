// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, Minus } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router";

// const faqs = [
//   {
//     question: "How do I upload menu items and drinks to the dashboard?",
//     answer:
//       'You can easily upload items. Simply navigate to the Menu section, click "Add Items," and either enter details manually or upload a spreadsheet with all your menu items, prices, and descriptions.',
//   },
//   {
//     question: "Can I manage multiple locations from one dashboard?",
//     answer:
//       "Yes! Rhace supports multi-location management. You can switch between different venues, manage separate menus, staff, and reservations for each location, all from a single dashboard.",
//   },
//   {
//     question: "How does the table reservation system work?",
//     answer:
//       "Our intelligent reservation system shows real-time table availability. You can set table capacities, manage time slots, and accept bookings from customers. The system automatically prevents double-bookings and sends confirmation notifications.",
//   },
//   {
//     question: "What payment methods are supported?",
//     answer:
//       "Rhace integrates with major payment processors including Stripe, PayPal, and Square. You can accept credit cards, debit cards, and digital wallets. All transactions are securely processed and tracked in your dashboard.",
//   },
//   {
//     question: "Can I manage staff schedules and permissions?",
//     answer:
//       "Absolutely! You can create staff profiles, set role-based permissions, manage shifts, and track performance. Assign different access levels to managers, servers, and other team members to ensure data security.",
//   },
//   {
//     question: "Is there a mobile app for the dashboard?",
//     answer:
//       "Yes, Rhace is fully responsive and works perfectly on mobile devices. You can manage your business on-the-go from any smartphone or tablet with the same features as the desktop version.",
//   },
//   {
//     question: "What kind of analytics and reports are available?",
//     answer:
//       "Get comprehensive insights including sales reports, popular menu items, peak hours, staff performance, customer trends, and revenue analytics. Export reports in various formats for accounting and business planning.",
//   },
//   {
//     question: "How secure is my data?",
//     answer:
//       "We take security seriously. All data is encrypted in transit and at rest, we use industry-standard security protocols, perform regular backups, and comply with data protection regulations. Your business and customer information is always safe.",
//   },
// ];

// export function FAQ() {
//   const navigate = useNavigate();
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const toggleFAQ = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <section
//       id="faq"
//       className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-blue-50"
//     >
//       <div className="max-w-4xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16 space-y-4"
//         >
//           <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full">
//             FAQ
//           </div>
//           <h2 className="text-4xl lg:text-5xl text-gray-900">
//             Frequently Asked <span className="text-teal-600">Questions</span>
//           </h2>
//           <p className="text-xl text-gray-600">
//             Everything you need to know about Rhace
//           </p>
//         </motion.div>

//         <div className="space-y-4">
//           {faqs.map((faq, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: index * 0.05 }}
//               className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
//             >
//               <motion.button
//                 onClick={() => toggleFAQ(index)}
//                 className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
//                 whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
//               >
//                 <span className="text-lg text-gray-900 pr-8">
//                   {faq.question}
//                 </span>
//                 <motion.div
//                   animate={{ rotate: openIndex === index ? 180 : 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="flex-shrink-0"
//                 >
//                   {openIndex === index ? (
//                     <Minus className="w-5 h-5 text-teal-600" />
//                   ) : (
//                     <Plus className="w-5 h-5 text-teal-600" />
//                   )}
//                 </motion.div>
//               </motion.button>

//               <AnimatePresence>
//                 {openIndex === index && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.3, ease: "easeInOut" }}
//                     className="overflow-hidden"
//                   >
//                     <div className="px-6 pb-5 text-gray-600 leading-relaxed">
//                       {faq.answer}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="mt-12 text-center"
//         >
//           <p className="text-gray-600 mb-4">Still have questions?</p>
//           <motion.button
//             onClick={() => navigate("/contact")}
//             className="px-8 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Contact Support
//           </motion.button>
//         </motion.div>
//       </div>
//     </section>
//   );
// }


import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "item-1",
    question: "How do vendors receive reservations?",
    answer:
      "Reservations made by users automatically appear in your dashboard in real time. The moment a guest books, you see it — no delays, no manual syncing.",
  },
  {
    id: "item-2",
    question: "Can I track my payments?",
    answer:
      "Yes. The dashboard shows completed payments, pending payments, and partially paid reservations — all in one place so you always know exactly where your money stands.",
  },
  {
    id: "item-3",
    question: "Can I manage multiple types of inventory?",
    answer:
      "Yes. You can manage hotel rooms, restaurant menus, club tables, and drinks from one unified dashboard. Everything is organized by category so nothing gets mixed up.",
  },
  {
    id: "item-4",
    question: "Do I need technical knowledge to use the dashboard?",
    answer:
      "No. The dashboard is designed to be simple and intuitive for hospitality businesses. If you can use a smartphone, you can run your business on Rhace.",
  },
];

export function FAQ() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 space-y-3 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-950 tracking-tight">
            Frequently asked <span style={{ color: "#014d43" }}>questions</span>
          </h2>
          <p className="text-base text-gray-400 font-light">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <AccordionItem
                value={faq.id}
                className="border border-gray-200 rounded-lg"
              >
                <AccordionTrigger
                  className={`py-5 px-5 text-left text-base font-semibold tracking-tight ${
                    openItem === faq.id ? "text-[#014d43]" : "text-gray-900"
                  }`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-gray-600 text-sm font-light leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        {/* Footer nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-sm text-gray-400 font-light text-center"
        >
          Still have questions?{" "}
          <a
            href="mailto:support@rhace.com"
            className="font-medium hover:underline text-[#014d43] transition-all"
          >
            Contact support →
          </a>
        </motion.p>

      </div>
    </section>
  );
}