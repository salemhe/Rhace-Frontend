import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import {
  Eye,
  Heart,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  transition: { staggerChildren: 0.15 },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function AboutRhace() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="relative pt-52 pb-30 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

        <div className="max-w-5xl mx-auto relative z-10">
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
              className="inline-block px-5 py-2 bg-teal-100 text-teal-700 rounded-full mb-6"
            >
              ✨ Africa's Premier Lifestyle Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-6xl text-gray-900 mb-6"
            >
              About{" "}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Rhace
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
            >
              Africa's premier lifestyle booking platform where you can
              effortlessly{" "}
              <strong className="text-teal-600">book a hotel stay</strong>,{" "}
              <strong className="text-teal-600">
                reserve a restaurant table
              </strong>
              , or{" "}
              <strong className="text-teal-600">secure a club booking</strong>,
              all from one place.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp}>
            <div className="bg-white rounded-3xl p-10 lg:p-14 ">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl text-gray-900">Our Story</h2>
              </div>

              <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
                <p>
                  Rhace was born out of a desire to elevate the African travel
                  and leisure experience. With a strong belief that discovering
                  new places, dining in style, and experiencing nightlife should
                  be as seamless as possible, our founders set out in 2025 to
                  build a platform tailored to the vibrant, diverse rhythms of
                  Africa.
                </p>
                <p>
                  From Lagos to Nairobi, Johannesburg to Accra, we partner with
                  the best hotels, restaurants and clubs to bring you curated,
                  trusted experiences — whether you're planning a business
                  retreat, a romantic dinner, or a weekend of nightlife.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-gray-900 mb-4">
              Mission, Vision & <span className="text-teal-600">Values</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-4">Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To make premium booking experiences accessible across Africa —
                enabling users to effortlessly reserve hotels, restaurants and
                clubs, backed by local insights and global standards.
              </p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-4">Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be Africa's leading lifestyle booking destination — trusted
                by millions of users and thousands of venues for outstanding
                experiences.
              </p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-4">Values</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>
                    <strong className="text-gray-900">Convenience</strong> –
                    Streamline bookings
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>
                    <strong className="text-gray-900">Trust</strong> – Verified
                    venues only
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>
                    <strong className="text-gray-900">Local insight</strong> –
                    Born in Africa
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>
                    <strong className="text-gray-900">Excellence</strong> –
                    Top-tier experiences
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-gray-900 mb-4">
              Who We <span className="text-teal-600">Serve</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 rounded-3xl shadow-xl text-white"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4">The Traveller</h3>
              <p className="text-teal-50 leading-relaxed">
                Whether you're visiting for business, leisure or exploring new
                cities, Rhace helps you find great hotels, make reservations,
                and manage your stay seamlessly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-3xl shadow-xl text-white"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4">The Local Leisure-Seeker</h3>
              <p className="text-blue-50 leading-relaxed">
                Living in your city and looking to discover something new?
                Reserve a table at a high-end restaurant or join your favourite
                club — Rhace makes it easy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-gray-900 mb-4">
              Why Choose <span className="text-teal-600">Rhace</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              {
                icon: Star,
                text: "Curated venue selection – we partner only with venues that meet strict standards of quality, safety and service.",
              },
              {
                icon: Sparkles,
                text: "One-stop platform – hotels, restaurants and clubs all in one place.",
              },
              {
                icon: MapPin,
                text: "African focus – we understand local culture and needs, while delivering global standards.",
              },
              {
                icon: Shield,
                text: "Secure & transparent – your bookings are confirmed, your payments are safe, and your experience matters.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-2">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl mb-6">Our Journey So Far</h2>
              <p className="text-xl text-teal-50 leading-relaxed mb-8">
                Launched in 2025, Rhace is already operating in Nigeria, Kenya
                and Ghana, working with hundreds of hotels and restaurants and
                hosting thousands of bookings each month.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30"
              >
                <p className="text-white">
                  Expanding to <strong>15+ countries by 2027</strong>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
