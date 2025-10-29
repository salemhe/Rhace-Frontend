import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactRhace() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto mt-20 py-16 px-6">
        <h2 className="text-3xl font-bold text-title text-center mb-10">Get in Touch</h2>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-title mb-4">Customer Support</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our team is here to help with your bookings, account questions or any other enquiries. We aim to respond within 24 hours.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-4">
                <Mail className="text-primary w-8 h-8 mr-4" />
                <div>
                  <h4 className="text-title font-semibold">Email Us</h4>
                  <p className="text-gray-700">support@rhace.africa</p>
                </div>
              </div>
              <div className="flex items-start space-4">
                <Phone className="text-primary w-8 h-8 mr-4" />
                <div>
                  <h4 className="text-title font-semibold">Call Us</h4>
                  <p className="text-gray-700">+234 800 123 4567 (Nigeria) / +254 700 765 432 (Kenya)</p>
                </div>
              </div>
              <div className="flex items-start space-4">
                <MapPin className="text-primary w-8 h-8 mr-4" />
                <div>
                  <h4 className="text-title font-semibold">Office Address</h4>
                  <p className="text-gray-700">Suite 502, The Hub, Ikeja City Mall, Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex items-start space-4">
                <Clock className="text-primary w-8 h-8 mr-4" />
                <div>
                  <h4 className="text-title font-semibold">Operating Hours</h4>
                  <p className="text-gray-700">Mon-Fri: 09:00 AM – 06:00 PM (WAT) • Sat: 10:00 AM – 04:00 PM • Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-title mb-4">Send Us a Message</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-title font-semibold mb-2" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full border border-secondary rounded px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-title font-semibold mb-2" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-secondary rounded px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-title font-semibold mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full border border-secondary rounded px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Tell us how we can help"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white font-semibold px-6 py-3 rounded hover:bg-teal-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500">
            For press-inquiries or partnerships, please email <a href="mailto:partners@rhace.africa" className="text-primary underline">partners@rhace.africa</a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
