// import { Upload, Calendar, CreditCard, BarChart3, Users, Utensils } from 'lucide-react';
// import { motion } from 'framer-motion';

// const features = [
//   {
//     icon: Utensils,
//     title: 'Menu & Drinks Management',
//     description: 'Upload and organize your complete menu, beverages, and specials with photos, prices, and availability tracking.',
//     color: 'bg-teal-100 text-teal-600',
//   },
//   {
//     icon: Calendar,
//     title: 'Table Reservations',
//     description: 'Manage table bookings with an intuitive dashboard. See availability in real-time and handle reservations effortlessly.',
//     color: 'bg-blue-100 text-blue-600',
//   },
//   {
//     icon: CreditCard,
//     title: 'Payment Processing',
//     description: 'Track all transactions in one place. Accept payments, generate invoices, and manage billing with ease.',
//     color: 'bg-purple-100 text-purple-600',
//   },
//   {
//     icon: Users,
//     title: 'Staff Management',
//     description: 'Organize your team with shift scheduling, role assignments, and performance tracking all from your dashboard.',
//     color: 'bg-orange-100 text-orange-600',
//   },
//   {
//     icon: BarChart3,
//     title: 'Analytics & Reports',
//     description: 'Get insights into sales, popular items, peak hours, and staff performance with comprehensive analytics.',
//     color: 'bg-pink-100 text-pink-600',
//   },
//   {
//     icon: Upload,
//     title: 'Easy Uploads',
//     description: 'Bulk upload menu items, drinks, and table configurations. Update prices and availability instantly.',
//     color: 'bg-yellow-100 text-yellow-600',
//   },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.2,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5, ease: "easeOut" },
//   },
// };

// export function Features() {
//   return (
//     <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16 space-y-4"
//         >
//           <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full">
//             Dashboard Features
//           </div>
//           <h2 className="text-4xl lg:text-5xl text-gray-900">
//             Everything in Your{' '}
//             <span className="text-teal-600">Dashboard</span>
//           </h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Manage every aspect of your business from one powerful, intuitive dashboard.
//           </p>
//         </motion.div>
        
//         <motion.div 
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-100px" }}
//           className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               variants={itemVariants}
//               whileHover={{ y: -8, transition: { duration: 0.3 } }}
//               className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow border border-gray-100"
//             >
//               <motion.div 
//                 className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5`}
//                 whileHover={{ rotate: 360, scale: 1.1 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <feature.icon className="w-6 h-6" />
//               </motion.div>
//               <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
//               <p className="text-gray-600 leading-relaxed">{feature.description}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }

import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRef } from "react";

// 👇 Drop your images here when ready
// import reservationsImg from "../../assets/reservations.png";
// import inventoryImg from "../../assets/inventory.png";
// import paymentsImg from "../../assets/payments.png";
// import analyticsImg from "../../assets/analytics.png";
// import policiesImg from "../../assets/policies.png";

const reservationsImg = "";
const inventoryImg    = "";
const paymentsImg     = "";
const analyticsImg    = "";
const policiesImg     = "";

type Feature = {
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  reverse: boolean;
};

const features: Feature[] = [
  {
    tag: "Reservations",
    title: "Real-Time Reservation Tracking",
    description:
      "See every reservation as it happens. Instantly view room bookings, restaurant tables, and club reservations made by users on the platform in real time.",
    bullets: ["Live booking feed", "Multi-property support", "Instant notifications"],
    image: reservationsImg,
    reverse: false,
  },
  {
    tag: "Inventory",
    title: "Manage Your Inventory Effortlessly",
    description:
      "Upload and manage rooms, drinks, tables, or menu items in seconds. Keep your offerings organized and available for users to book anytime.",
    bullets: ["Bulk item uploads", "Real-time availability", "Category management"],
    image: inventoryImg,
    reverse: true,
  },
  {
    tag: "Payments",
    title: "Track Payments and Revenue",
    description:
      "Monitor completed payments, pending payments, and partially paid reservations. Know exactly how much revenue your business is generating and what the platform owes you.",
    bullets: ["Payment status tracking", "Revenue breakdown", "Payout management"],
    image: paymentsImg,
    reverse: false,
  },
  {
    tag: "Analytics",
    title: "Powerful Performance Analytics",
    description:
      "Identify your best-performing rooms, drinks, meals, or tables with real-time analytics designed to help hospitality businesses maximize revenue.",
    bullets: ["Top performer insights", "Trend charts", "Revenue forecasts"],
    image: analyticsImg,
    reverse: true,
  },
  {
    tag: "Settings",
    title: "Flexible Business Policies",
    description:
      "Create custom policies for reservations, cancellations, and payments while managing all business settings from one centralized dashboard.",
    bullets: ["Custom cancellation rules", "Payment terms", "Business hour controls"],
    image: policiesImg,
    reverse: false,
  },
];

function FeatureBlock({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const imageX = useTransform(
    scrollYProgress,
    [0, 1],
    [feature.reverse ? -40 : 40, 0]
  );
  const imageOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const imageScale   = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative">
      {/* Connector line between blocks */}
      {index < features.length - 1 && (
        <div
          className="absolute left-1/2 -bottom-14 w-px h-14 -translate-x-1/2 hidden lg:block"
          style={{ background: "linear-gradient(to bottom, rgba(1,77,67,0.15), transparent)" }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={`flex flex-col ${feature.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}
      >
        {/* ── Text ── */}
        <div className="flex-1 space-y-6">
          {/* Step + tag row */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <span className="text-3xl font-black" style={{ color: "rgba(1,77,67,0.12)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border"
              style={{
                color: "#014d43",
                backgroundColor: "rgba(1,77,67,0.06)",
                borderColor: "rgba(1,77,67,0.15)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {feature.tag}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl lg:text-[2.4rem] font-bold text-gray-950 leading-tight tracking-tight"
          >
            {feature.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-400 leading-relaxed text-base font-light max-w-md"
          >
            {feature.description}
          </motion.p>

          {/* Bullets — staggered */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.28 } },
            }}
            className="space-y-2.5"
          >
            {feature.bullets.map((b) => (
              <motion.li
                key={b}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
                }}
                className="flex items-center gap-3 text-sm text-gray-700 font-medium"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#014d43" }} />
                {b}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* ── Image card ── */}
        <motion.div
          style={{ x: imageX, opacity: imageOpacity, scale: imageScale }}
          className="flex-1 w-full"
        >
          {/* Soft glow behind card */}
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-3xl blur-3xl opacity-30 pointer-events-none"
              style={{
                background: isEven
                  ? "radial-gradient(ellipse at 60% 60%, rgba(1,77,67,0.18) 0%, transparent 70%)"
                  : "radial-gradient(ellipse at 40% 60%, rgba(1,107,92,0.15) 0%, transparent 70%)",
              }}
            />

            {/* Outer glass frame */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative rounded-[22px] p-3 w-full"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1.5px solid rgba(255,255,255,0.95)",
                boxShadow: `
                  0 0 0 1px rgba(1,77,67,0.06),
                  0 4px 12px -2px rgba(0,0,0,0.04),
                  0 20px 48px -8px rgba(1,77,67,0.1),
                  inset 0 1px 0 rgba(255,255,255,0.9)
                `,
              }}
            >
              {/* Inner card */}
              <div
                className="rounded-[14px] overflow-hidden"
                style={{ border: "1px solid rgba(1,77,67,0.07)" }}
              >
                {/* Browser chrome */}
                <div
                  className="px-4 py-2.5 flex items-center gap-2"
                  style={{
                    background: "rgba(248,250,252,0.98)",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div
                      className="rounded-md px-3 py-0.5 text-xs text-gray-400 text-center w-full max-w-[180px] mx-auto"
                      style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,0,0,0.05)" }}
                    >
                      dashboard.rhace.com
                    </div>
                  </div>
                </div>

                {/* Image */}
                {feature.image ? (
                  <img src={feature.image} alt={feature.title} className="w-full h-auto block" />
                ) : (
                  <div
                    className="w-full flex flex-col items-center justify-center gap-2"
                    style={{
                      height: "300px",
                      background: "linear-gradient(135deg, #f8fafa 0%, #f0f7f6 100%)",
                    }}
                  >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(1,77,67,0.08)" }}>
                      <div className="w-4 h-4 rounded" style={{ background: "rgba(1,77,67,0.3)" }} />
                    </div>
                    <p className="text-xs font-medium" style={{ color: "rgba(1,77,67,0.3)" }}>
                      {feature.tag} screenshot
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-28 space-y-5"
        >
          {/* <span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full border"
            style={{
              color: "#014d43",
              backgroundColor: "rgba(1,77,67,0.06)",
              borderColor: "rgba(1,77,67,0.15)",
            }}
          >
            {/* <span className="w-1.5 h-1.5 rounded-full bg-current" /> */}
            {/* Dashboard Features */}
          {/* </span> */} 

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-950 tracking-tight">
            Everything in Your{" "}
            <span className="relative inline-block" style={{ color: "#014d43" }}>
              Dashboard
              <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4" fill="none" preserveAspectRatio="none">
                <path d="M0 2 Q50 0 100 2 Q150 4 200 2"
                  stroke="#014d43" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.3" />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Manage every aspect of your hospitality business from one powerful, intuitive dashboard.
          </p>
        </motion.div>

        {/* Feature blocks */}
        <div className="space-y-28">
          {features.map((feature, index) => (
            <FeatureBlock key={feature.tag} feature={feature} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}