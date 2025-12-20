// // =======================FIRST FOOTER (GREEN BG)========================
// // import { Mail, MapPin, Phone } from 'lucide-react';
// // import logo from "../assets/Rhace-11.png";

// // const Footer = () => {
// //   return (
// //     <footer className="bg-[#E9EBF3] border border-[#DDE1ED] text-[#111827]">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
// //           {/* Company Info */}
// //           <div className="space-y-4">
// //             <div className="flex items-center space-x-2 mt-[-20px]">
// //              <img
// //               src={logo}
// //               alt="Rhace Logo"
// //               className="w-20 h-20 object-contain"
// //             />
// //             </div>
// //             <p className="text-[#111827] leading-relaxed font-normal mt-[-15px]">
// //               Making restaurant reservations simple and enjoyable.
// //             </p>
// //           </div>

// //           {/* Quick Links */}
// //           <div>
// //             <h3 className="text-lg font-semibold mb-4">Explore</h3>
// //             <ul className="space-y-2">
// //               <li><a href="#" className="text-[#111827] font-normal leading-normal hover:text-gray-500 transition-colors duration-200">Restaurants</a></li>
// //               <li><a href="#" className="text-[#111827] font-normal leading-normal hover:text-gray-500 transition-colors duration-200">Hotels</a></li>
// //               <li><a href="#" className="text-[#111827] font-normal leading-normal hover:text-gray-500 transition-colors duration-200">Top Restaurant </a></li>
// //             </ul>
// //           </div>

// //           {/* Support */}
// //           <div>
// //             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
// //             <ul className="space-y-2">
// //               <li><a href="/about" className="text-[#111827] hover:text-gray-500 font-normal leading-normal transition-colors duration-200">About Us</a></li>
// //               <li><a href="/contact" className="text-[#111827] hover:text-gray-500 font-normal leading-normal transition-colors duration-200">Contact</a></li>
// //               <li><a href="/faq" className="text-[#111827] hover:text-gray-500 font-normal leading-normal transition-colors duration-200">Faq</a></li>
// //             </ul>
// //           </div>

// //           {/* Contact */}
// //           <div>
// //             <h3 className="text-lg font-semibold mb-4">Contact</h3>
// //             <div className="space-y-3">

// //               <div className="flex items-center space-x-3">
// //                 <Phone className="w-5 h-5 text-[#111827] flex-shrink-0" />
// //                 <span className="text-[#111827] font-normal leading-normal ">+23412345678</span>
// //               </div>
// //               <div className="flex items-center space-x-3">
// //                 <Mail className="w-5 h-5 text-[#111827] flex-shrink-0" />
// //                 <span className="text-[#111827] font-normal leading-normal">Kapadoccia@gmail.com</span>
// //               </div>
// //               <div className="flex items-center space-x-3">
// //                 <MapPin className="w-5 h-5 text-[#111827] flex-shrink-0" />
// //                 <span className="text-[#111827] font-normal leading-normal">16, Idowu Taylor Street, Victoria Island 101241 Nigeria</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="border-t border-gray-800 mt-12 pt-8 sm:flex sm:items-center sm:justify-between">
// //           <p className="text-[#111827]">
// //             © 2024 Bookme. All rights reserved.
// //           </p>
// //           <div className="flex justify-start items-center gap-8">
// //             <div className="justify-start text-gray-900 text-base font-normal font-['Inter'] leading-normal">Privacy Policy</div>
// //             <div className="justify-start text-gray-900 text-base font-normal font-['Inter'] leading-normal">Terms of Service</div>
// //           </div>
// //         </div>
// //       </div>
// //     </footer>
// //   );
// // };

// // export default Footer;
// // =======================FIRST FOOTER (GREEN BG)========================

// // =======================SECOND FOOTER (BLACK BG)========================
// // import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from "lucide-react";
// // import { motion } from "framer-motion";
// // import logo from "../assets/Rhace-09.png";

// // const Footer = () => {
// //   const fadeIn = {
// //     hidden: { opacity: 0, y: 20 },
// //     visible: (i) => ({
// //       opacity: 1,
// //       y: 0,
// //       transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
// //     }),
// //   };

// //   return (
// //     <footer className="relative bg-[#0B0B0B] text-gray-300 border-t border-gray-800 overflow-hidden">
// //       {/* Background gradient glow */}
// //       <div className="absolute inset-0 bg-gradient-to-t from-black via-[#111111]/90 to-transparent opacity-80"></div>

// //       <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16">
// //         <motion.div
// //           className="grid grid-cols-1 md:grid-cols-4 gap-12"
// //           initial="hidden"
// //           whileInView="visible"
// //           viewport={{ once: true }}
// //         >
// //           {/* Company Info */}
// //           <motion.div variants={fadeIn} custom={0}>
// //             <div className="flex items-center space-x-3 mb-4">
// //               <motion.img
// //                 src={logo}
// //                 alt="Rhace Logo"
// //                 className="w-20 h-20 object-contain rounded-xl"
// //                 whileHover={{ scale: 1.05, rotate: 3 }}
// //                 transition={{ type: "spring", stiffness: 200 }}
// //               />
// //             </div>
// //             <p className="text-gray-400 leading-relaxed text-sm">
// //               Making restaurant reservations simple, elegant, and unforgettable.
// //             </p>
// //           </motion.div>

// //           {/* Explore */}
// //           <motion.div variants={fadeIn} custom={1}>
// //             <h3 className="text-lg font-semibold text-white mb-5 tracking-wide">Explore</h3>
// //             <ul className="space-y-3">
// //               {["Restaurants", "Hotels", "Top Spots"].map((item, i) => (
// //                 <motion.li
// //                   key={i}
// //                   whileHover={{ x: 6 }}
// //                   transition={{ type: "spring", stiffness: 300 }}
// //                 >
// //                   <a
// //                     href="#"
// //                     className="text-gray-400 hover:text-white transition-colors duration-300"
// //                   >
// //                     {item}
// //                   </a>
// //                 </motion.li>
// //               ))}
// //             </ul>
// //           </motion.div>

// //           {/* Quick Links */}
// //           <motion.div variants={fadeIn} custom={2}>
// //             <h3 className="text-lg font-semibold text-white mb-5 tracking-wide">Quick Links</h3>
// //             <ul className="space-y-3">
// //               {[
// //                 { name: "About Us", href: "/about" },
// //                 { name: "Contact", href: "/contact" },
// //                 { name: "FAQ", href: "/faq" },
// //               ].map((link, i) => (
// //                 <motion.li
// //                   key={i}
// //                   whileHover={{ x: 6 }}
// //                   transition={{ type: "spring", stiffness: 300 }}
// //                 >
// //                   <a
// //                     href={link.href}
// //                     className="text-gray-400 hover:text-white transition-colors duration-300"
// //                   >
// //                     {link.name}
// //                   </a>
// //                 </motion.li>
// //               ))}
// //             </ul>
// //           </motion.div>

// //           {/* Contact */}
// //           <motion.div variants={fadeIn} custom={3}>
// //             <h3 className="text-lg font-semibold text-white mb-5 tracking-wide">Get in Touch</h3>
// //             <div className="space-y-4">
// //               <motion.div className="flex items-center space-x-3" whileHover={{ x: 6 }}>
// //                 <Phone className="w-5 h-5 text-gray-400" />
// //                 <span className="text-gray-400">+234 123 456 78</span>
// //               </motion.div>
// //               <motion.div className="flex items-center space-x-3" whileHover={{ x: 6 }}>
// //                 <Mail className="w-5 h-5 text-gray-400" />
// //                 <span className="text-gray-400">contact@bookme.com</span>
// //               </motion.div>
// //               <motion.div className="flex items-center space-x-3" whileHover={{ x: 6 }}>
// //                 <MapPin className="w-5 h-5 text-gray-400" />
// //                 <span className="text-gray-400">
// //                   16, Idowu Taylor Street, Victoria Island, Lagos
// //                 </span>
// //               </motion.div>
// //             </div>
// //           </motion.div>
// //         </motion.div>

// //         {/* Divider */}
// //         <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between">
// //           {/* Social icons */}
// //           <motion.div
// //             className="flex items-center space-x-5 mb-6 sm:mb-0"
// //             initial={{ opacity: 0, y: 10 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.6, duration: 0.6 }}
// //           >
// //             {[
// //               { Icon: Facebook, href: "#" },
// //               { Icon: Instagram, href: "#" },
// //               { Icon: Twitter, href: "#" },
// //             ].map(({ Icon, href }, i) => (
// //               <motion.a
// //                 key={i}
// //                 href={href}
// //                 whileHover={{ scale: 1.2 }}
// //                 className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-all duration-300"
// //               >
// //                 <Icon className="w-5 h-5 text-gray-300" />
// //               </motion.a>
// //             ))}
// //           </motion.div>

// //           {/* Copyright + Legal */}
// //           <motion.div
// //             className="text-sm text-gray-500 text-center sm:text-right"
// //             initial={{ opacity: 0, y: 10 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.8, duration: 0.6 }}
// //           >
// //             <p>© 2025 BookMe. All rights reserved.</p>
// //             <div className="flex justify-center sm:justify-end gap-4 mt-2">
// //               {["Privacy Policy", "Terms of Service"].map((text, i) => (
// //                 <motion.a
// //                   key={i}
// //                   href="#"
// //                   whileHover={{ scale: 1.05, color: "#fff" }}
// //                   transition={{ type: "spring", stiffness: 300 }}
// //                   className="text-gray-500 hover:text-white transition-colors"
// //                 >
// //                   {text}
// //                 </motion.a>
// //               ))}
// //             </div>
// //           </motion.div>
// //         </div>
// //       </div>
// //     </footer>
// //   );
// // };

// // export default Footer;
// // =======================SECOND FOOTER (BLACK BG)========================

// import {
//   Mail,
//   MapPin,
//   Phone,
//   Facebook,
//   Instagram,
//   Twitter,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import logo from "../public/Rhace-09.png";

// const Footer = () => {
//   const fadeIn = {
//     hidden: { opacity: 0, y: 10 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }, // faster animation
//     }),
//   };

//   return (
//     <footer className="relative bg-[#050505] text-gray-300 overflow-hidden">
//       {/* Background logo overlay */}
//       <div className="absolute inset-0 flex justify-center items-center opacity-10">
//         <img
//           src={logo}
//           alt="Rhace Logo Background"
//           className="w-[450px] sm:w-[550px] md:w-[650px] object-contain"
//         />
//       </div>

//       {/* Subtle gradient tint */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0B2210]/80 to-transparent mix-blend-multiply"></div>

//       <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-20">
//         <motion.div
//           className="grid  grid-cols-1 md:grid-cols-4 gap-12"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           {/* Brand Section */}
//           <motion.div variants={fadeIn} custom={0}>
//             <div className="fle space-y-4">
//               <motion.img
//                 src={logo}
//                 alt="Rhace Logo"
//                 className=" object-contain rounded-xl drop-shadow-lg"
//                 whileHover={{ scale: 1.08, rotate: 2 }}
//                 transition={{ type: "spring", stiffness: 250 }}
//               />
//               <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
//                 Redefining how people make reservations. Discover, book, and
//                 enjoy moments that matter.
//               </p>
//             </div>
//           </motion.div>

//           {/* Explore */}
//           <motion.div variants={fadeIn} custom={1}>
//             <h3 className="text-lg font-semibold text-white mb-5 tracking-wide uppercase">
//               Explore
//             </h3>
//             <ul className="space-y-3">
//               {["Restaurants", "Hotels", "Experiences"].map((item, i) => (
//                 <motion.li
//                   key={i}
//                   whileHover={{ x: 6 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <a
//                     href="#"
//                     className="text-gray-400 hover:text-green-400 transition-colors duration-300"
//                   >
//                     {item}
//                   </a>
//                 </motion.li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Quick Links */}
//           <motion.div variants={fadeIn} custom={2}>
//             <h3 className="text-lg font-semibold text-white mb-5 tracking-wide uppercase">
//               Quick Links
//             </h3>
//             <ul className="space-y-3">
//               {[
//                 { name: "About Us", href: "/about" },
//                 { name: "Contact", href: "/contact" },
//                 { name: "FAQ", href: "/faq" },
//               ].map((link, i) => (
//                 <motion.li
//                   key={i}
//                   whileHover={{ x: 6 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <a
//                     href={link.href}
//                     className="text-gray-400 hover:text-green-400 transition-colors duration-300"
//                   >
//                     {link.name}
//                   </a>
//                 </motion.li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Contact */}
//           <motion.div variants={fadeIn} custom={3}>
//             <h3 className="text-lg font-semibold text-white mb-5 tracking-wide uppercase">
//               Get in Touch
//             </h3>
//             <div className="space-y-4 text-sm">
//               <motion.div
//                 className="flex items-center space-x-3"
//                 whileHover={{ x: 6 }}
//               >
//                 <Phone className="w-5 h-5 text-green-400" />
//                 <span className="text-gray-400">+234 123 456 78</span>
//               </motion.div>
//               <motion.div
//                 className="flex items-center space-x-3"
//                 whileHover={{ x: 6 }}
//               >
//                 <Mail className="w-5 h-5 text-green-400" />
//                 <span className="text-gray-400">hello@bookme.com</span>
//               </motion.div>
//               <motion.div
//                 className="flex items-center space-x-3"
//                 whileHover={{ x: 6 }}
//               >
//                 <MapPin className="w-5 h-5 text-green-400" />
//                 <span className="text-gray-400 max-w-[200px]">
//                   16, Idowu Taylor Street, Victoria Island, Lagos
//                 </span>
//               </motion.div>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Bottom Bar */}
//         <motion.div
//           className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between"
//           initial={{ opacity: 0, y: 10 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.5 }}
//         >
//           {/* Social Media Icons */}
//           <div className="flex items-center space-x-5 mb-6 sm:mb-0">
//             {[
//               { Icon: Facebook, href: "#" },
//               { Icon: Instagram, href: "#" },
//               { Icon: Twitter, href: "#" },
//             ].map(({ Icon, href }, i) => (
//               <motion.a
//                 key={i}
//                 href={href}
//                 whileHover={{ scale: 1.2 }}
//                 className="bg-white/5 p-2 rounded-full hover:bg-green-500/20 transition-all duration-300"
//               >
//                 <Icon className="w-5 h-5 text-gray-300" />
//               </motion.a>
//             ))}
//           </div>

//           {/* Legal */}
//           <div className="text-sm text-gray-500 text-center sm:text-right">
//             <p>© 2025 Rhace. All rights reserved.</p>
//             <div className="flex justify-center sm:justify-end gap-5 mt-2">
//               {["Privacy Policy", "Terms of Service"].map((text, i) => (
//                 <motion.a
//                   key={i}
//                   href="#"
//                   whileHover={{ scale: 1.05, color: "#22c55e" }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                   className="text-gray-500 hover:text-green-400 transition-colors"
//                 >
//                   {text}
//                 </motion.a>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import { motion } from "framer-motion";
import logoWhite from "@/public/images/Rhace-09.png";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-300 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.05, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-[20vw] sm:text-[18vw] md:text-[16vw] font-bold text-white whitespace-nowrap"
          style={{ letterSpacing: "0.1em" }}
        >
          <div className="flex items-center space-x-2">
            <img
              src={logoWhite}
              alt="Rhace Logo"
              className=" w-auto object-contain transition-all duration-300"
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
                        href={href === "home" ? `/` : href}
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
