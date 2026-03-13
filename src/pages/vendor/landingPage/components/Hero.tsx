//Variant 1 design normal one flex hero section
// import { ArrowRight, CheckCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router";

// // Dashboard image import
// import dashboardPreview from "@/public/auth/HeroVendor.svg";

// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 24 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
// });

// export function Hero() {
//   const navigate = useNavigate();

//   return (
//     <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">

//       {/* ── Background: white + faint dark green grid ── */}
//       <div className="absolute inset-0 -z-10" style={{ backgroundColor: "#ffffff" }} />
//       <div
//         className="absolute inset-0 -z-10"
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(1,77,67,0.045) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(1,77,67,0.045) 1px, transparent 1px)
//           `,
//           backgroundSize: "48px 48px",
//         }}
//       />
//       {/* Side green blobs */}
//       <div className="absolute top-0 left-0 w-[420px] h-[420px] -z-10 pointer-events-none"
//         style={{ background: "radial-gradient(ellipse at top left, rgba(1,77,67,0.07) 0%, transparent 70%)" }} />
//       <div className="absolute top-10 right-0 w-[380px] h-[380px] -z-10 pointer-events-none"
//         style={{ background: "radial-gradient(ellipse at top right, rgba(1,107,92,0.06) 0%, transparent 65%)" }} />
//       <div className="absolute bottom-0 left-0 w-[300px] h-[300px] -z-10 pointer-events-none"
//         style={{ background: "radial-gradient(ellipse at bottom left, rgba(1,77,67,0.05) 0%, transparent 65%)" }} />
//       {/* Fade grid behind copy */}
//       <div className="absolute inset-0 -z-10"
//         style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.95) 0%, transparent 100%)" }} />

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//         <div className="grid lg:grid-cols-2 gap-14 items-center">

//           {/* ── Left: Copy ── */}
//           <div className="space-y-7">

//             <motion.h1
//               {...fadeUp(0.08)}
//               className="text-5xl lg:text-[3.4rem] xl:text-6xl font-bold text-gray-950 leading-[1.1] tracking-tight"
//             >
//               One Dashboard to{" "}
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
//                 className="relative inline-block"
//                 style={{ color: "#014d43" }}
//               >
//                 Manage
//                 <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4" fill="none" preserveAspectRatio="none">
//                   <motion.path
//                     d="M0 2 Q50 0 100 2 Q150 4 200 2"
//                     stroke="#014d43" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"
//                     initial={{ pathLength: 0 }}
//                     animate={{ pathLength: 1 }}
//                     transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
//                   />
//                 </svg>
//               </motion.span>{" "}
//               Your Hotel, Restaurant, or Club
//             </motion.h1>

//             <motion.p
//               {...fadeUp(0.15)}
//               className="text-lg text-gray-500 leading-relaxed max-w-[460px] font-light"
//             >
//               Manage reservations, track payments, control inventory, and monitor
//               business performance — all from one powerful vendor dashboard built
//               for hospitality businesses.
//             </motion.p>

//             <motion.div {...fadeUp(0.22)} className="flex flex-wrap items-center gap-3">
//               <motion.button
//                 className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-3 rounded-xl shadow-md transition-all duration-200"
//                 style={{ backgroundColor: "#014d43" }}
//                 whileHover={{ scale: 1.04, boxShadow: "0 12px 24px -4px rgba(1,77,67,0.35)", y: -1 }}
//                 whileTap={{ scale: 0.96 }}
//                 onClick={() => navigate("/auth/vendor/signup")}
//               >
//                 Start Free Trial
//                 <ArrowRight className="w-4 h-4" />
//               </motion.button>

//               <motion.button
//                 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 px-5 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
//                 whileHover={{ scale: 1.04, y: -1 }}
//                 whileTap={{ scale: 0.96 }}
//                 onClick={() => navigate("/auth/vendor/login")}
//               >
//                 <CheckCircle className="w-4 h-4" style={{ color: "#014d43" }} />
//                 Book a Demo
//               </motion.button>
//             </motion.div>
//           </div>

//           {/* ── Right: single image in glass card ── */}
//           <motion.div
//             initial={{ opacity: 0, x: 30, scale: 0.97 }}
//             animate={{ opacity: 1, x: 0, scale: 1 }}
//             transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
//             className="relative"
//           >
//             {/* Glow */}
//             <div
//               className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
//               style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(1,77,67,0.5) 0%, transparent 65%)" }}
//             />

//             {/* Outer glass frame */}
//             <div
//               className="relative rounded-[22px] p-3"
//               style={{
//                 background: "rgba(255,255,255,0.55)",
//                 backdropFilter: "blur(24px)",
//                 WebkitBackdropFilter: "blur(24px)",
//                 border: "1.5px solid rgba(255,255,255,0.9)",
//                 boxShadow: `
//                   0 0 0 1px rgba(1,77,67,0.08),
//                   0 8px 16px -4px rgba(1,77,67,0.08),
//                   0 24px 48px -8px rgba(1,77,67,0.14),
//                   inset 0 1px 0 rgba(255,255,255,0.8)
//                 `,
//               }}
//             >
//               {/* Inner card */}
//               <motion.div
//                 whileHover={{ y: -3 }}
//                 transition={{ duration: 0.35, ease: "easeOut" }}
//                 className="rounded-[14px] overflow-hidden"
//                 style={{ border: "1px solid rgba(1,77,67,0.09)" }}
//               >
//                 {/* Browser chrome */}
//                 <div
//                   className="px-4 py-2.5 flex items-center gap-2"
//                   style={{
//                     background: "rgba(248,250,252,0.98)",
//                     borderBottom: "1px solid rgba(1,77,67,0.07)",
//                   }}
//                 >
//                   <div className="flex gap-1.5">
//                     <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
//                     <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
//                     <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
//                   </div>
//                   <div className="flex-1 mx-3">
//                     <div
//                       className="rounded-md px-3 py-0.5 text-xs text-gray-400 text-center w-full max-w-[180px] mx-auto"
//                       style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,0,0,0.06)" }}
//                     >
//                       dashboard.rhace.com
//                     </div>
//                   </div>
//                 </div>

//                 {/* Dashboard image — full, no crop */}
//                 <img
//                   src={dashboardPreview}
//                   alt="Rhace vendor dashboard"
//                   className="w-full h-auto block"
//                 />
//               </motion.div>
//             </div>
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   );
// }














//Variant 2 design, more saas inclined 
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router";
import { useRef } from "react";

// Dashboard image import
import dashboardPreview from "@/public/auth/HeroVendor.svg";

export function Hero() {
  const navigate = useNavigate();
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "center center"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const imageScale   = useTransform(smooth, [0, 1], [0.88, 1]);
  const imageY       = useTransform(smooth, [0, 1], [32, 0]);
  const imageOpacity = useTransform(smooth, [0, 0.25], [0, 1]);

  return (
    <section
      className="relative flex flex-col items-center overflow-hidden pb-24"
      style={{ paddingTop: "88px" }}
    >

      {/* ── Base white background ── */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: "#ffffff" }} />

      {/* ── Grid — fainted dark green ── */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(1,77,67,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(1,77,67,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Subtle green gradients on the sides ── */}
      {/* Left blob */}
      <div
        className="absolute top-0 left-0 w-[420px] h-[420px] -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top left, rgba(1,77,67,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Right blob */}
      <div
        className="absolute top-10 right-0 w-[380px] h-[380px] -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top right, rgba(1,107,92,0.06) 0%, transparent 65%)",
        }}
      />
      {/* Bottom-left accent */}
      <div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom left, rgba(1,77,67,0.05) 0%, transparent 65%)",
        }}
      />

      {/* Radial fade — dissolve grid behind copy */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(255,255,255,0.95) 0%, transparent 100%)",
        }}
      />

      {/* ── Copy ── */}
      <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-6 text-center mt-2">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl lg:text-5xl xl:text-[3.2rem] font-bold text-gray-950 leading-[1.1] tracking-tight"
        >
          One Dashboard to{" "}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-block"
            style={{ color: "#014d43" }}
          >
            Manage
            <svg
              className="absolute -bottom-1 left-0 w-full"
              height="4"
              viewBox="0 0 200 4"
              fill="none"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0 2 Q50 0 100 2 Q150 4 200 2"
                stroke="#014d43"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
              />
            </svg>
          </motion.span>{" "}
          Your Hotel, Restaurant, or Club
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-base text-gray-500 leading-relaxed font-light max-w-md mx-auto"
        >
          Manage reservations, track payments, control inventory, and monitor
          business performance — all from one powerful vendor dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 mb-[-25px]"
        >
          <motion.button
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-3 rounded-xl shadow-lg"
            style={{ backgroundColor: "#014d43" }}
            whileHover={{ scale: 1.05, boxShadow: "0 16px 32px -6px rgba(1,77,67,0.4)", y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/auth/vendor/signup")}
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 px-5 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.95)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/auth/vendor/login")}
          >
            <CheckCircle className="w-4 h-4" style={{ color: "#014d43" }} />
            Book a Demo
          </motion.button>
        </motion.div>
      </div>

      {/* ── Dashboard image with thick glass container ── */}
      <motion.div
        ref={imageRef}
        style={{ scale: imageScale, y: imageY, opacity: imageOpacity }}
        className="relative w-full mt-12 px-4 sm:px-6"
      >
        <div className="max-w-3xl mx-auto">

          {/* Glow behind container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.9 }}
            className="absolute -inset-8 rounded-[28px] pointer-events-none blur-2xl"
            style={{
              background: "radial-gradient(ellipse at 50% 60%, rgba(1,77,67,0.1) 0%, transparent 70%)",
            }}
          />

          {/* Outer glass frame */}
          <div
            className="relative rounded-[22px] p-3"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1.5px solid rgba(255,255,255,0.9)",
              boxShadow: `
                0 0 0 1px rgba(1,77,67,0.07),
                0 8px 16px -4px rgba(1,77,67,0.07),
                0 24px 48px -8px rgba(1,77,67,0.1),
                inset 0 1px 0 rgba(255,255,255,0.8)
              `,
            }}
          >
            {/* Inner card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full rounded-[14px] overflow-hidden shadow-lg"
              style={{ border: "1px solid rgba(1,77,67,0.09)" }}
            >
              {/* Browser chrome */}
              <div
                className="px-4 py-2.5 flex items-center gap-2"
                style={{
                  background: "rgba(248,250,252,0.98)",
                  borderBottom: "1px solid rgba(1,77,67,0.07)",
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 mx-3">
                  <div
                    className="rounded-md px-3 py-0.5 text-xs text-gray-400 text-center w-full max-w-[180px] mx-auto"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    dashboard.rhace.com
                  </div>
                </div>
              </div>

              {/* Full dashboard image */}
              <img
                src={dashboardPreview}
                alt="Rhace vendor dashboard"
                className="w-full h-auto block"
              />
            </motion.div>
          </div>

        </div>
      </motion.div>

    </section>
  );
}




//Final variant: Morden more animations saas type
// import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
// import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router";
// import { useRef, useState } from "react";

// // Dashboard image import
// import dashboardPreview from "@/public/auth/HeroVendor.svg";

// const cards = [
//   { label: "Reservations" },
//   { label: "Dashboard" },
//   { label: "Analytics" },
// ];

// // Reusable glass card shell
// function CardShell({ label, isCenter }: { label: string; isCenter: boolean }) {
//   return (
//     <div
//       className="rounded-[18px] p-2.5"
//       style={{
//         background: "rgba(255,255,255,0.6)",
//         backdropFilter: "blur(20px)",
//         WebkitBackdropFilter: "blur(20px)",
//         border: "1.5px solid rgba(255,255,255,0.9)",
//         boxShadow: isCenter
//           ? `0 0 0 1px rgba(1,77,67,0.1), 0 20px 60px -10px rgba(1,77,67,0.2), inset 0 1px 0 rgba(255,255,255,0.9)`
//           : `0 0 0 1px rgba(1,77,67,0.07), 0 10px 32px -8px rgba(1,77,67,0.12), inset 0 1px 0 rgba(255,255,255,0.8)`,
//       }}
//     >
//       <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid rgba(1,77,67,0.08)" }}>
//         {/* Browser chrome */}
//         <div
//           className="px-3 py-2 flex items-center gap-2"
//           style={{ background: "rgba(248,250,252,0.98)", borderBottom: "1px solid rgba(1,77,67,0.06)" }}
//         >
//           <div className="flex gap-1.5">
//             <div className="w-2 h-2 rounded-full bg-red-400/70" />
//             <div className="w-2 h-2 rounded-full bg-amber-400/70" />
//             <div className="w-2 h-2 rounded-full bg-green-400/70" />
//           </div>
//           <div
//             className="flex-1 mx-2 text-center text-[10px] rounded px-2 py-0.5"
//             style={{ color: "#9ca3af", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.05)" }}
//           >
//             {label}
//           </div>
//         </div>
//         <img
//           src={dashboardPreview}
//           alt={`${label} dashboard`}
//           className="w-full h-auto block"
//           style={{ maxHeight: "360px", objectFit: "cover", objectPosition: "top" }}
//         />
//       </div>
//     </div>
//   );
// }

// export function Hero() {
//   const navigate = useNavigate();
//   const cardsRef = useRef<HTMLDivElement>(null);
//   const [active, setActive] = useState(1); // start on center card
//   const [direction, setDirection] = useState(0); // -1 left, 1 right

//   const { scrollYProgress } = useScroll({
//     target: cardsRef,
//     offset: ["start end", "center center"],
//   });

//   const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
//   const leftX     = useTransform(smooth, [0, 1], [-60, 0]);
//   const rightX    = useTransform(smooth, [0, 1], [60,  0]);
//   const centerY   = useTransform(smooth, [0, 1], [40,  0]);
//   const sideScale = useTransform(smooth, [0, 1], [0.88, 1]);
//   const opacity   = useTransform(smooth, [0, 0.25], [0, 1]);

//   const desktopCards = [
//     { rotate: "-6deg", translateX: "-38%", translateY: "12%", zIndex: 1, motionX: leftX,     motionY: centerY, label: "Reservations" },
//     { rotate: "0deg",  translateX: "0%",   translateY: "0%",  zIndex: 3, motionX: undefined,  motionY: centerY, label: "Dashboard" },
//     { rotate: "6deg",  translateX: "38%",  translateY: "12%", zIndex: 1, motionX: rightX,    motionY: centerY, label: "Analytics" },
//   ];

//   function goTo(index: number) {
//     setDirection(index > active ? 1 : -1);
//     setActive(index);
//   }

//   function prev() { goTo(active === 0 ? cards.length - 1 : active - 1); }
//   function next() { goTo(active === cards.length - 1 ? 0 : active + 1); }

//   const swipeVariants = {
//     enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92, rotateY: dir > 0 ? 8 : -8 }),
//     center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
//     exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92, rotateY: dir > 0 ? -8 : 8 }),
//   };

//   return (
//     <section
//       className="relative flex flex-col items-center overflow-hidden pb-32"
//       style={{ paddingTop: "88px" }}
//     >

//       {/* ── Base background ── */}
//       <div className="absolute inset-0 -z-10" style={{ backgroundColor: "#ffffff" }} />
//       <div
//         className="absolute inset-0 -z-10"
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(1,77,67,0.045) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(1,77,67,0.045) 1px, transparent 1px)
//           `,
//           backgroundSize: "48px 48px",
//         }}
//       />
//       <div className="absolute top-0 left-0 w-[420px] h-[420px] -z-10 pointer-events-none"
//         style={{ background: "radial-gradient(ellipse at top left, rgba(1,77,67,0.07) 0%, transparent 70%)" }} />
//       <div className="absolute top-10 right-0 w-[380px] h-[380px] -z-10 pointer-events-none"
//         style={{ background: "radial-gradient(ellipse at top right, rgba(1,107,92,0.06) 0%, transparent 65%)" }} />
//       <div className="absolute bottom-0 left-0 w-[300px] h-[300px] -z-10 pointer-events-none"
//         style={{ background: "radial-gradient(ellipse at bottom left, rgba(1,77,67,0.05) 0%, transparent 65%)" }} />
//       <div className="absolute inset-0 -z-10"
//         style={{ background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(255,255,255,0.95) 0%, transparent 100%)" }} />

//       {/* ── Copy ── */}
//       <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-6 text-center mt-5">
//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
//           className="text-4xl lg:text-5xl xl:text-[3.2rem] font-bold text-gray-950 leading-[1.1] tracking-tight"
//         >
//           One Dashboard to{" "}
//           <motion.span
//             initial={{ opacity: 0, x: -10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
//             className="relative inline-block"
//             style={{ color: "#014d43" }}
//           >
//             Manage
//             <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4" fill="none" preserveAspectRatio="none">
//               <motion.path
//                 d="M0 2 Q50 0 100 2 Q150 4 200 2"
//                 stroke="#014d43" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"
//                 initial={{ pathLength: 0 }}
//                 animate={{ pathLength: 1 }}
//                 transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
//               />
//             </svg>
//           </motion.span>{" "}
//           Your Hotel, Restaurant, or Club
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
//           className="mt-5 text-base text-gray-500 leading-relaxed font-light max-w-md mx-auto"
//         >
//           Manage reservations, track payments, control inventory, and monitor
//           business performance — all from one powerful vendor dashboard.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
//           className="mt-6 flex flex-wrap items-center justify-center gap-3 mb-[-5px]"
//         >
//           <motion.button
//             className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-3 rounded-xl shadow-lg"
//             style={{ backgroundColor: "#014d43" }}
//             whileHover={{ scale: 1.05, boxShadow: "0 16px 32px -6px rgba(1,77,67,0.4)", y: -2 }}
//             whileTap={{ scale: 0.96 }}
//             onClick={() => navigate("/auth/vendor/signup")}
//           >
//             Start Free Trial
//             <ArrowRight className="w-4 h-4" />
//           </motion.button>

//           <motion.button
//             className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 px-5 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm"
//             whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.95)" }}
//             whileTap={{ scale: 0.96 }}
//             onClick={() => navigate("/auth/vendor/login")}
//           >
//             <CheckCircle className="w-4 h-4" style={{ color: "#014d43" }} />
//             Book a Demo
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* ── MOBILE: swipeable carousel ── */}
//       <motion.div
//         className="md:hidden w-full mt-8 px-4"
//         initial={{ opacity: 0, y: 50, scale: 0.95 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
//       >
//         {/* Card window */}
//         <div className="relative overflow-hidden" style={{ perspective: "1000px" }}>
//           <AnimatePresence mode="popLayout" custom={direction}>
//             <motion.div
//               key={active}
//               custom={direction}
//               variants={swipeVariants}
//               initial="enter"
//               animate="center"
//               exit="exit"
//               transition={{
//                 x: { type: "spring", stiffness: 280, damping: 28 },
//                 opacity: { duration: 0.22 },
//                 scale: { duration: 0.35 },
//                 rotateY: { duration: 0.38 },
//               }}
//               drag="x"
//               dragConstraints={{ left: 0, right: 0 }}
//               dragElastic={0.18}
//               onDragEnd={(_, info) => {
//                 if (info.offset.x < -60) next();
//                 else if (info.offset.x > 60) prev();
//               }}
//               className="cursor-grab active:cursor-grabbing"
//               style={{ transformStyle: "preserve-3d" }}
//             >
//               <CardShell label={cards[active].label} isCenter />
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* Controls */}
//         <div className="flex items-center justify-between mt-4 px-1">
//           {/* Prev / Next buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={prev}
//               className="w-9 h-9 rounded-full flex items-center justify-center border transition-all"
//               style={{
//                 borderColor: "rgba(1,77,67,0.15)",
//                 background: "rgba(255,255,255,0.8)",
//                 color: "#014d43",
//               }}
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             <button
//               onClick={next}
//               className="w-9 h-9 rounded-full flex items-center justify-center border transition-all"
//               style={{
//                 borderColor: "rgba(1,77,67,0.15)",
//                 background: "rgba(255,255,255,0.8)",
//                 color: "#014d43",
//               }}
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>

//           {/* Dot indicators */}
//           <div className="flex gap-2 items-center">
//             {cards.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => goTo(i)}
//                 className="rounded-full transition-all duration-300"
//                 style={{
//                   width: i === active ? "20px" : "6px",
//                   height: "6px",
//                   backgroundColor: i === active ? "#014d43" : "rgba(1,77,67,0.2)",
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </motion.div>

//       {/* ── DESKTOP: fan layout ── */}
//       <div
//         ref={cardsRef}
//         className="hidden md:flex relative w-full items-center justify-center"
//         style={{ height: "520px" }}
//       >
//         {desktopCards.map((card, i) => (
//           <motion.div
//             key={i}
//             style={{
//               x: card.motionX,
//               y: card.motionY,
//               scale: sideScale,
//               opacity,
//               position: "absolute",
//               zIndex: card.zIndex,
//               rotate: card.rotate,
//               translateX: card.translateX,
//               translateY: card.translateY,
//               width: "clamp(360px, 48vw, 680px)",
//             }}
//             whileHover={
//               i === 1
//                 ? { y: -10, scale: 1.02, zIndex: 10 }
//                 : { y: -6, scale: 1.01, zIndex: 10, rotate: "0deg" }
//             }
//             transition={{ duration: 0.35, ease: "easeOut" }}
//           >
//             <CardShell label={card.label} isCenter={i === 1} />
//           </motion.div>
//         ))}
//       </div>

//     </section>
//   );
// }