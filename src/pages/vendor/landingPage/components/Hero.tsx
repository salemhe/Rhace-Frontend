import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-2 bg-teal-50 text-teal-700 rounded-full"
            >
              ✨ Complete Dashboard Solution
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl text-gray-900 leading-tight"
            >
              Your Hospitality{" "}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Dashboard
              </span>
              <br />
              All in One Place
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Powerful dashboard to manage menus, drinks, tables, reservations,
              payments, and staff. Everything your hotel, restaurant, or club
              needs to thrive.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3"
            >
              {[
                "Upload & manage menu items and drinks",
                "Track tables & reservations in real-time",
                "Process payments & manage staff",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(20, 184, 166, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth/vendor/signup")}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 rounded-3xl"
              animate={{ rotate: [3, -3, 3] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756504473770-2fab6e0df54d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY2MDY4MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Luxury hotel and restaurant"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
