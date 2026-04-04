import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { Clock, Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const TEAL = "#0A6C6D";

export default function ContactRhace() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Header />

      <main className="w-full mt-24 max-w-6xl mx-auto px-6 py-16">
        <div className="mb-14 border-b border-gray-100 pb-10">
          <p className="text-[11px] tracking-[0.22em] uppercase mb-3 font-medium" style={{ color: TEAL }}>
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-400 text-base max-w-md leading-relaxed font-light">
            We'd love to hear from you. Reach out through any of the channels below
            and our team will respond within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: Details + Socials */}
          <div className="flex flex-col w-full flex-1 gap-10">
            <div className="flex w-full flex-col gap-7">
              {[
                { icon: <Phone size={15} />, label: "Phone", value: "+234 800 000 0000", href: "tel:+2348000000000" },
                { icon: <Mail size={15} />, label: "Email", value: "hello@rhace.com", href: "mailto:hello@rhace.com" },
                { icon: <MapPin size={15} />, label: "Address", value: "Victoria Island, Lagos\nNigeria", href: null },
                { icon: <Clock size={15} />, label: "Hours", value: "Mon - Fri: 9 AM - 6 PM\nSat: 10 AM - 3 PM", href: null },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="mt-0.5 p-2 rounded-md flex-shrink-0" style={{ backgroundColor: `${TEAL}12`, color: TEAL }}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-gray-700 text-sm font-medium whitespace-pre-line hover:opacity-60 transition-opacity">
                        {value}
                      </a>
                    ) : (
                      <p className="text-gray-700 text-sm font-medium whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100" />

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">Follow Us</p>
              <div className="flex gap-2">
                {[
                  { icon: <Instagram size={15} />, href: "#", label: "Instagram" },
                  { icon: <Twitter size={15} />, href: "#", label: "Twitter" },
                  { icon: <Facebook size={15} />, href: "#", label: "Facebook" },
                  { icon: <Linkedin size={15} />, href: "#", label: "LinkedIn" },
                ].map(({ icon, href, label }) => (
                  <a
                    key={label} href={href} aria-label={label}
                    className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-200"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = TEAL; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = TEAL; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <iframe
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7!2d3.4219!3d6.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53aec4dd647%3A0x4f09b7722d04c4!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1614270659490!5m2!1sen!2sng"
              width="100%" height="100%"
              style={{ border: 0, filter: "saturate(0.7) contrast(1.05)" }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}