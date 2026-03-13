// import { ImageWithFallback } from "./figma/ImageWithFallback";
// import { motion } from "framer-motion";

// const steps = [
//   {
//     number: "01",
//     title: "Sign Up & Setup",
//     description:
//       "Create your account and set up your dashboard in minutes. Choose your business type and customize your workspace.",
//   },
//   {
//     number: "02",
//     title: "Upload Your Data",
//     description:
//       "Add menu items, drinks, table layouts, and staff information. Bulk upload or add items individually.",
//   },
//   {
//     number: "03",
//     title: "Manage Everything",
//     description:
//       "Start accepting reservations, processing payments, and managing your entire operation from one dashboard.",
//   },
// ];

// export function HowItWorks() {
//   return (
//     <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true, margin: "-100px" }}
//             transition={{ duration: 0.8 }}
//             className="order-2 lg:order-1"
//           >
//             <div className="rounded-3xl overflow-hidden shadow-2xl">
//               <ImageWithFallback
//                 src="https://images.unsplash.com/photo-1728044849280-10a1a75cff83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3NjYxNDg3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
//                 alt="Restaurant management"
//                 className="w-full h-auto"
//               />
//             </div>
//           </motion.div>

//           <div className="order-1 lg:order-2 space-y-12">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6 }}
//               className="space-y-4"
//             >
//               <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full">
//                 How It Works
//               </div>
//               <h2 className="text-4xl lg:text-5xl text-gray-900">
//                 Get Started in{" "}
//                 <span className="text-teal-600">3 Simple Steps</span>
//               </h2>
//             </motion.div>

//             <div className="space-y-8">
//               {steps.map((step, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: 50 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.2, duration: 0.6 }}
//                   whileHover={{ x: 10 }}
//                   className="flex gap-6"
//                 >
//                   <div className="flex-shrink-0">
//                     <motion.div
//                       className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg"
//                       whileHover={{ scale: 1.1, rotate: 5 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {step.number}
//                     </motion.div>
//                   </div>
//                   <div className="pt-1">
//                     <h3 className="text-2xl text-gray-900 mb-2">
//                       {step.title}
//                     </h3>
//                     <p className="text-gray-600 leading-relaxed">
//                       {step.description}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    tag: "Account",
    title: "Create Your Vendor Account",
    description:
      "Sign up and gain access to your vendor dashboard in minutes. No technical setup, no lengthy onboarding.",
    detail: "Quick verification · Instant dashboard access · Works for hotels, restaurants & clubs",
  },
  {
    number: "02",
    tag: "Inventory",
    title: "Upload Your Inventory",
    description:
      "Add your rooms, drinks, tables, or menu items so users can discover and reserve them anytime.",
    detail: "Rooms · Tables · Menu items · Set pricing & availability",
  },
  {
    number: "03",
    tag: "Go Live",
    title: "Start Receiving Reservations",
    description:
      "Users book directly through the platform. Every reservation lands in your dashboard the moment it's made.",
    detail: "Live feed · Instant notifications · Full booking control",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: isEven ? 60 : -60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col"
      style={{ marginTop: isEven ? "0px" : "80px" }}
    >
      {/* Giant number — floats behind */}
      <div
        className="absolute -top-10 -left-4 text-[9rem] font-black leading-none select-none pointer-events-none z-0"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(1,77,67,0.1)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {step.number}
      </div>

      {/* Card */}
      <div
        className="relative z-10 rounded-[20px] p-7 flex flex-col gap-4 mt-14 group"
        style={{
          background: index === 1
            ? "linear-gradient(135deg, #014d43 0%, #02695c 100%)"
            : "rgba(255,255,255,0.95)",
          border: index === 1
            ? "1.5px solid rgba(255,255,255,0.12)"
            : "1.5px solid rgba(1,77,67,0.08)",
          boxShadow: index === 1
            ? "0 24px 64px -12px rgba(1,77,67,0.45), 0 0 0 1px rgba(1,77,67,0.3)"
            : "0 4px 12px -2px rgba(0,0,0,0.04), 0 20px 48px -8px rgba(1,77,67,0.08), 0 0 0 1px rgba(1,77,67,0.05)",
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border"
            style={index === 1 ? {
              color: "rgba(255,255,255,0.7)",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.15)",
            } : {
              color: "#014d43",
              backgroundColor: "rgba(1,77,67,0.06)",
              borderColor: "rgba(1,77,67,0.15)",
            }}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            {step.tag}
          </span>

          {/* Step dot */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={index === 1 ? {
              background: "rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.9)",
            } : {
              background: "rgba(1,77,67,0.08)",
              color: "#014d43",
            }}
          >
            {step.number}
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold tracking-tight leading-snug"
          style={{ color: index === 1 ? "rgba(255,255,255,0.95)" : "#0a0a0a" }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm font-light leading-relaxed"
          style={{ color: index === 1 ? "rgba(255,255,255,0.55)" : "#9ca3af" }}
        >
          {step.description}
        </p>

        {/* Divider */}
        <div
          className="w-full h-px"
          style={{ background: index === 1 ? "rgba(255,255,255,0.1)" : "rgba(1,77,67,0.07)" }}
        />

        {/* Detail chips */}
        <div className="flex flex-wrap gap-2">
          {step.detail.split(" · ").map((d) => (
            <span
              key={d}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={index === 1 ? {
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.65)",
              } : {
                background: "rgba(1,77,67,0.06)",
                color: "#014d43",
              }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Hover shimmer on dark card */}
        {index === 1 && (
          <div
            className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)",
            }}
          />
        )}
      </div>

      {/* Connector dot on timeline */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.3, ease: "backOut" }}
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ top: isEven ? "calc(100% + 24px)" : "-40px" }}
      >
        <div
          className="w-4 h-4 rounded-full border-2"
          style={{
            background: index === 1 ? "#014d43" : "white",
            borderColor: "#014d43",
            boxShadow: index === 1 ? "0 0 0 4px rgba(1,77,67,0.15)" : "none",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start center", "end center"],
  });
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: "#f7faf9" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 space-y-4"
        >
          {/* Asymmetric — left aligned for contrast */}
          <p className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "rgba(1,77,67,0.5)" }}>
            How it works
          </p>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-950 tracking-tight leading-none max-w-xl">
            Three steps to{" "}
            <span
              className="italic font-light"
              style={{ color: "#014d43" }}
            >
              going live.
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-md font-light leading-relaxed">
            No technical setup. No lengthy onboarding.<br />
            List your business and start earning.
          </p>
        </motion.div>

        {/* Timeline container */}
        <div ref={lineRef} className="relative">

          {/* Horizontal progress line — desktop only */}
          <div className="hidden lg:block absolute top-[calc(50%-1px)] left-0 right-0 h-px"
            style={{ background: "rgba(1,77,67,0.1)", top: "280px" }}>
            <motion.div
              className="h-full origin-left"
              style={{
                scaleX: lineScaleX,
                background: "linear-gradient(to right, rgba(1,77,67,0.5), rgba(1,77,67,0.2))",
              }}
            />
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Bottom CTA nudge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 flex items-center gap-4"
        >
          <div className="h-px flex-1 max-w-[80px]"
            style={{ background: "rgba(1,77,67,0.15)" }} />
          <p className="text-sm text-gray-400 font-light">
            Ready to get started?{" "}
            <span 
              className="font-medium cursor-pointer" 
              style={{ color: "#014d43" }}
              onClick={() => window.location.href = "/auth/vendor/signup"}
            >
              Create your account →
            </span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}