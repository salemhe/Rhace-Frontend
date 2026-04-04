import logoWhite from "@/public/images/Rhace-09.png";
import { logoutAsync } from "@/redux/slices/authSlice";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { CalendarClock, ChevronDown, ChevronUp, Home, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileMenu } from "./layout/headers/user-header";

export default function Footer() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const navigates = useNavigate();
  const dropdownRef = useRef(null);

  const navigate = (path) => navigates(path);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (user.isAuthenticated) setProfile(user.user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    dispatch(logoutAsync());
    setProfile(null);
  };

  const mobileNav = [
    { title: "Home", icon: <Home />, link: "/" },
    { title: "Moments", icon: <CalendarClock />, link: "/bookings" },
    { title: "Search", icon: <Search />, link: "/search" },
    {
      title: "Profile",
      icon: (
        <div className="relative text-gray-700" ref={dropdownRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-1">
            {loading ? (
              <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
            ) : profile ? (
              <Avatar className="w-6 h-6">
                <AvatarImage src={profile.profilePic} alt={`${profile.firstName} ${profile.lastName}`} />
                <AvatarFallback className="text-xs">
                  {profile.firstName[0].toUpperCase()}{profile.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User className="w-6 h-6 text-gray-400 bg-gray-200 rounded-full p-1" />
            )}
            {isMenuOpen ? <ChevronUp className="w-5 h-5 text-gray-700" /> : <ChevronDown className="w-5 h-5 text-gray-700" />}
          </button>
          {isMenuOpen && (
            <div className="absolute bottom-full right-0 mt-2 w-72 z-50">
              <UserProfileMenu
                onClose={() => setIsMenuOpen(false)}
                navigate={navigate}
                isAuthenticated={user.isAuthenticated}
                handleLogout={handleLogout}
                user={profile}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={`${profile ? "hidden" : ""} md:block`}>
        <footer className="relative bg-[#0e0e0e] overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

          {/* Watermark logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <motion.img
              src={logoWhite}
              alt=""
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 0.04, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="w-[90vw] max-w-5xl object-contain"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-10">

            {/* Hero tagline */}
            <div className="pt-20 pb-14 border-b border-[#1e1e1e]">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xs tracking-[0.28em] uppercase text-[#4a4a4a] mb-6"
              >
                Africa's Reservation Platform
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl font-light text-white leading-[1.08] tracking-[-0.5px]"
              >
                Every reservation<br />
                <em className="not-italic" style={{ color: "#00a896" }}>is a moment.</em>
              </motion.h2>
            </div>

            {/* 3-col links */}
            <div className="py-14 grid md:grid-cols-3 gap-16 border-b border-[#1e1e1e]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img src={logoWhite} alt="Rhace" className="h-5 w-auto object-contain mb-5 opacity-70" />
                <p className="text-[13px] text-[#555] leading-relaxed font-light max-w-[200px]">
                  Discover, book, and enjoy moments that matter, accros Africa's best restaurants, hotels, and clubs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="grid grid-cols-2 gap-8"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#3a3a3a] mb-5">Explore</p>
                  <ul className="space-y-3.5">
                    {[{ label: "Home", href: "/" }, { label: "Search", href: "/search" }, { label: "Moments", href: "/bookings" }].map(({ label, href }) => (
                      <li key={label}>
                        <a href={href} className="text-[13px] text-[#666] hover:text-white transition-colors duration-200 font-light">{label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#3a3a3a] mb-5">Company</p>
                  <ul className="space-y-3.5">
                    {[{ label: "About", href: "/about" }, { label: "Partner", href: "/partner" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
                      <li key={label}>
                        <a href={href} className="text-[13px] text-[#666] hover:text-white transition-colors duration-200 font-light">{label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#3a3a3a] mb-5">Partner With Us</p>
                <p className="text-[13px] text-[#555] leading-relaxed font-light mb-6">
                  Hundreds of venues trust Rhace to fill their tables and manage their reservations.
                </p>
                <a
                  href="/partner"
                  className="inline-flex items-center gap-2 text-[12px] px-5 py-2.5 rounded-lg border border-[#2a2a2a] text-[#aaa] hover:border-[#00a896] hover:text-[#00a896] transition-all duration-200"
                >
                  Get Started →
                </a>
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="py-5 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-[12px] text-[#3a3a3a]">© 2026 Rhace, Inc.</p>
              <div className="flex items-center gap-6">
                {[{ label: "Privacy", href: "/privacy-policy" }, { label: "Terms", href: "/terms" }, { label: "Cookies", href: "/cookies" }].map(({ label, href }) => (
                  <a key={label} href={href} className="text-[12px] text-[#3a3a3a] hover:text-white transition-colors duration-200">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {profile && (
        <>
          <div className="h-16 md:h-0" />
          <div className="fixed bottom-0 left-0 w-full bg-white py-2 flex items-center justify-center gap-12 border-t md:hidden z-50">
            {mobileNav.map((item, i) => (
              <button onClick={() => item.link && navigate(item.link)} key={i} className="text-sm font-medium text-gray-700 hover:text-gray-900">
                <div className="flex items-center gap-1 flex-col">
                  <div>{item.icon}</div>
                  <span className="text-xs">{item.title}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}