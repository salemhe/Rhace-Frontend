// import { motion } from "framer-motion";

// // logo imports —
// import logoBlack from "@/public/images/Rhace-11.png";
// import { useNavigate } from "react-router";
// export function Header() {
//   const navigate = useNavigate();
//   return (
//     <motion.header
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <motion.div
//             className="flex items-center gap-2"
//             whileHover={{ scale: 1.05 }}
//             transition={{ duration: 0.2 }}
//           >
//             <div className="flex items-center space-x-2">
//               <img
//                 src={logoBlack}
//                 alt="Rhace Logo"
//                 className="h-6 w-auto object-contain transition-all duration-300"
//               />
//             </div>
//           </motion.div>

//           <nav className="hidden md:flex items-center gap-8">
//             {["Features", "How it Works", "FAQ"].map((item, index) => (
//               <motion.a
//                 key={item}
//                 href={`₦${item.toLowerCase().replace(/\s+/g, "-")}`}
//                 className="text-gray-600 hover:text-teal-600 transition-colors"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
//                 whileHover={{ y: -2 }}
//               >
//                 {item}
//               </motion.a>
//             ))}
//           </nav>

//           <motion.div
//             className="flex items-center gap-3"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6, duration: 0.5 }}
//           >
//             <motion.button
//               onClick={() => navigate("/auth/vendor/login")}
//               className="px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Login
//             </motion.button>
//             <motion.button
//               onClick={() => navigate("/auth/vendor/signup")}
//               className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/30"
//               whileHover={{
//                 scale: 1.05,
//                 boxShadow: "0 20px 25px -5px rgba(20, 184, 166, 0.3)",
//               }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Sign Up
//             </motion.button>
//           </motion.div>
//         </div>
//       </div>
//     </motion.header>
//   );
// }

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import logoBlack from "@/public/images/Rhace-11.png";

const links = ["Features", "How it Works", "FAQ"];

export function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        // Exact same base color as hero — blends seamlessly
        backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "rgba(1,77,67,0.09)" : "rgba(1,77,67,0.045)"}`,
        boxShadow: scrolled ? "0 1px 20px 0 rgba(1,77,67,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
          <img
            src={logoBlack}
            alt="Rhace Logo"
            className="h-6 w-auto object-contain transition-all duration-300"
          />
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link, index) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-150"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              whileHover={{ y: -1, backgroundColor: "rgba(1,77,67,0.06)" }}
            >
              {link}
            </motion.a>
          ))}
        </nav>

        {/* Actions */}
        <motion.div
          className="hidden md:flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate("/auth/vendor/login")}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-lg"
            whileHover={{ scale: 1.04, backgroundColor: "rgba(1,77,67,0.06)" }}
            whileTap={{ scale: 0.96 }}
          >
            Login
          </motion.button>
          <motion.button
            onClick={() => navigate("/auth/vendor/signup")}
            className="px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-150"
            style={{ backgroundColor: "#014d43" }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 12px 24px -4px rgba(1,77,67,0.35)",
            }}
            whileTap={{ scale: 0.96 }}
          >
            Sign Up
          </motion.button>
        </motion.div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{
              backgroundColor: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              borderColor: "rgba(1,77,67,0.08)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg transition-colors hover:bg-[rgba(1,77,67,0.06)]"
                >
                  {link}
                </a>
              ))}
              <div
                className="pt-3 mt-2 flex flex-col gap-2 border-t"
                style={{ borderColor: "rgba(1,77,67,0.08)" }}
              >
                <button
                  onClick={() => { navigate("/auth/vendor/login"); setMobileOpen(false); }}
                  className="text-sm font-medium text-gray-600 text-center py-2 hover:text-gray-900 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/auth/vendor/signup"); setMobileOpen(false); }}
                  className="text-sm font-semibold text-white text-center py-2.5 rounded-lg transition-all"
                  style={{ backgroundColor: "#014d43" }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}