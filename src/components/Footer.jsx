import { motion } from "framer-motion";
import logoWhite from "@/public/images/Rhace-09.png";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-300 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.06, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="
          text-[20vw]
          sm:text-[18vw]
          md:text-[16vw]
          font-bold
          text-white
          whitespace-nowrap
          rotate-45
          lg:rotate-0
        "
          style={{ letterSpacing: "0.1em" }}
        >
          <div className="flex items-center w-[40rem] sm:w-full justify-center">
            <img
              src={logoWhite}
              alt="Rhace Logo"
              className="w-auto  object-contain"
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2">
                <img
                  src={logoWhite}
                  alt="Rhace Logo"
                  className="h-6 w-auto object-contain transition-all duration-300"
                />
              </div>
            </motion.div>
            <p className="text-gray-400">
              {" "}
              Redefining how people make reservations. Discover, book, and enjoy
              moments that matter.
            </p>
          </motion.div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Security", "Updates"],
            },
            {
              title: "Company",
              links: ["Home", "About", "Partner", "Contact"],
            },
            {
              title: "Support",
              links: ["Help Center", "Documentation", "API", "Status"],
            },
          ].map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              <h4 className="text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => {
                  const href = link.toLowerCase().replace(" ", "-");
                  return (
                    <motion.li
                      key={linkIndex}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href={href === "home" ? `/` : `/${href}`}
                        className="hover:text-teal-400 transition-colors"
                      >
                        {link}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-400">© 2025 Rhace. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item, index) => (
              <motion.a
                key={index}
                href="#"
                className="hover:text-teal-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
