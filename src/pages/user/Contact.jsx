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
import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function ContactRhace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100">
      <Header />

      <div className="container mx-auto px-4 py-28">
        <div className="max-w-5xl mx-auto">
          {/* Hospitality Header */}
          <div className="text-center mb-24">
            <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 tracking-wide text-sm mb-5 shadow-sm">
              <Mail className="w-4 h-4 mr-2" />
              Concierge & Reservations
            </span>

            <h1 className="text-4xl font-semibold text-slate-900 tracking-tight mb-4">
              We're Here to Assist You
            </h1>

            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Whether you’re making a reservation, booking an event, or seeking
              general assistance, our team is ready to offer a world-class
              experience.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-14 relative overflow-hidden">
            {/* Decorative Hospitality Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Contact Information
            </h2>
            <p className="text-slate-500 mb-14">
              Our concierge desk is available to support your needs around the
              clock.
            </p>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 gap-12">
              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-slate-900 font-medium text-lg">
                    reservations@rhace.com
                  </p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-slate-900 font-medium text-lg leading-snug">
                    16 Idowu Taylor Street
                    <br />
                    Victoria Island, Lagos
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-slate-900 font-medium text-lg">
                    +234 (0) 809 555 0192
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">
                    Concierge Service
                  </p>
                  <p className="text-slate-900 font-medium text-lg leading-snug">
                    24 / 7 Availability
                    <br />
                    Priority bookings & support
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-14 border-t border-slate-200" />

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                {
                  name: "Facebook",
                  path: "M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.764v2.314h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.667V1.333C24 .597 23.403 0 22.675 0z",
                },
                {
                  name: "Twitter",
                  path: "M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.608 1.794-1.574 2.163-2.724-.951.564-2.005.974-3.127 1.195-.897-.959-2.178-1.559-3.594-1.559-2.723 0-4.928 2.206-4.928 4.928 0 .386.045.762.127 1.124-4.094-.205-7.72-2.165-10.148-5.144-.424.729-.666 1.574-.666 2.476 0 1.708.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.828-.413.112-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.6 3.417-1.68 1.318-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.402 4.768 2.217 7.557 2.217 9.054 0 14.004-7.496 14.004-13.986 0-.21-.006-.42-.017-.63 1.012-.732 1.8-1.64 2.46-2.677z",
                },
                {
                  name: "LinkedIn",
                  path: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5S0 4.881 0 3.5 1.11 1 2.48 1 4.98 2.119 4.98 3.5zM.22 24V7.98h4.52V24H.22zM7.98 7.98h4.33v2.18h.06c.603-1.143 2.078-2.35 4.277-2.35 4.57 0 5.41 3.005 5.41 6.91V24h-4.52v-8.12c0-1.935-.035-4.42-2.69-4.42-2.69 0-3.1 2.104-3.1 4.27V24H7.98V7.98z",
                },
              ].map((icon, index) => (
                <div
                  key={index}
                  className="w-12 h-12 cursor-pointer rounded-2xl bg-slate-100 hover:bg-teal-50 flex items-center justify-center text-slate-700 hover:text-teal-700 transition shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={icon.path} />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
