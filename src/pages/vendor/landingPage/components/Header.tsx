import { motion } from "framer-motion";

// logo imports —
import logoBlack from "@/assets/Rhace-11.png";
import { useNavigate } from "react-router";
export function Header() {
  const navigate = useNavigate();
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <img
                src={logoBlack}
                alt="Rhace Logo"
                className="h-6 w-auto object-contain transition-all duration-300"
              />
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "FAQ"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-gray-600 hover:text-teal-600 transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              onClick={() => navigate("/auth/vendor/login")}
              className="px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => navigate("/auth/vendor/signup")}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/30"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(20, 184, 166, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
