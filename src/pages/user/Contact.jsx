// import Footer from "@/components/Footer";
// import Header from "@/components/user/Header";
// import { Mail, Phone, MapPin, Clock } from "lucide-react";

// export default function ContactRhace() {
//   return (
//     <div className="min-h-screen bg-white">
//       <Header />
//       <div className="max-w-4xl mx-auto mt-20 py-16 px-6">
//         <h2 className="text-3xl font-bold text-title text-center mb-10">Get in Touch</h2>

//         <div className="grid md:grid-cols-2 gap-12 mb-16">
//           <div>
//             <h3 className="text-2xl font-semibold text-title mb-4">Customer Support</h3>
//             <p className="text-gray-700 leading-relaxed mb-6">
//               Our team is here to help with your bookings, account questions or any other enquiries. We aim to respond within 24 hours.
//             </p>
//             <div className="space-y-6">
//               <div className="flex items-start space-4">
//                 <Mail className="text-primary w-8 h-8 mr-4" />
//                 <div>
//                   <h4 className="text-title font-semibold">Email Us</h4>
//                   <p className="text-gray-700">support@rhace.africa</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-4">
//                 <Phone className="text-primary w-8 h-8 mr-4" />
//                 <div>
//                   <h4 className="text-title font-semibold">Call Us</h4>
//                   <p className="text-gray-700">+234 800 123 4567 (Nigeria) / +254 700 765 432 (Kenya)</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-4">
//                 <MapPin className="text-primary w-8 h-8 mr-4" />
//                 <div>
//                   <h4 className="text-title font-semibold">Office Address</h4>
//                   <p className="text-gray-700">Suite 502, The Hub, Ikeja City Mall, Lagos, Nigeria</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-4">
//                 <Clock className="text-primary w-8 h-8 mr-4" />
//                 <div>
//                   <h4 className="text-title font-semibold">Operating Hours</h4>
//                   <p className="text-gray-700">Mon-Fri: 09:00 AM – 06:00 PM (WAT) • Sat: 10:00 AM – 04:00 PM • Sun: Closed</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-2xl font-semibold text-title mb-4">Send Us a Message</h3>
//             <form className="space-y-6">
//               <div>
//                 <label className="block text-title font-semibold mb-2" htmlFor="name">Name</label>
//                 <input
//                   id="name"
//                   type="text"
//                   className="w-full border border-secondary rounded px-4 py-3 focus:outline-none focus:border-primary"
//                   placeholder="Your full name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-title font-semibold mb-2" htmlFor="email">Email</label>
//                 <input
//                   id="email"
//                   type="email"
//                   className="w-full border border-secondary rounded px-4 py-3 focus:outline-none focus:border-primary"
//                   placeholder="you@example.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-title font-semibold mb-2" htmlFor="message">Message</label>
//                 <textarea
//                   id="message"
//                   rows="5"
//                   className="w-full border border-secondary rounded px-4 py-3 focus:outline-none focus:border-primary"
//                   placeholder="Tell us how we can help"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="bg-primary text-white font-semibold px-6 py-3 rounded hover:bg-teal-700 transition"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>

//         <div className="text-center">
//           <p className="text-gray-500">
//             For press-inquiries or partnerships, please email <a href="mailto:partners@rhace.africa" className="text-primary underline">partners@rhace.africa</a>.
//           </p>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

import { ContactForm } from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactRhace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mt-24 mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-700">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </span>
            </div>
            <h1 className="text-slate-900 mb-6">Let's Start a Conversation</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We're here to help and answer any question you might have. We look
              forward to hearing from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-white mb-2">Contact Information</h2>
                <p className="text-teal-100 mb-8">
                  Fill out the form and our team will get back to you within 24
                  hours.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mt-1">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-teal-100">Email</p>
                      <p className="text-white">contact@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mt-1">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-teal-100">Phone</p>
                      <p className="text-white">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mt-1">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-teal-100">Office</p>
                      <p className="text-white">
                        123 Business Street
                        <br />
                        San Francisco, CA 94102
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mt-1">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-teal-100">Business Hours</p>
                      <p className="text-white">
                        Mon - Fri: 9:00 AM - 6:00 PM
                        <br />
                        Sat - Sun: Closed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/20">
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-slate-100">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
