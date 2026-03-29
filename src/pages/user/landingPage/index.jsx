import { SearchAutocomplete } from "@/components/AutoComplete";
import { DateDropdown } from "@/components/DateDropdown";
import Footer from "@/components/Footer";
import { GuestDropdown } from "@/components/GuestDropdown";
import { UserProfileMenu } from "@/components/layout/headers/user-header";
import Header from "@/components/user/Header";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./landing.css"; // Make sure to import the CSS file
// import LocationModal from "@/components/LocationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRestaurantData } from "@/hooks/favorites";
import { logout } from "@/redux/slices/authSlice";
import { formatOfferText } from "@/utils/helper";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Home,
  Search,
  User,
} from "lucide-react";
import { FaSearchLocation } from "react-icons/fa";
import { IoCalendarNumber } from "react-icons/io5";
function UserLandingPage() {
  const [date, setDate] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef(null > null);
  const inputRef = useRef(null > null);
  function useMixedPlaces() {
    const clubs = useRestaurantData("club");
    const hotels = useRestaurantData("hotel");
    const restaurants = useRestaurantData("restaurant");

    const isLoading =
      clubs.isLoading || hotels.isLoading || restaurants.isLoading;

    const mixedFour = [
      clubs.restaurants?.[0],
      hotels.restaurants?.[0],
      restaurants.restaurants?.[0],
      restaurants.restaurants?.[1],
    ].filter(Boolean);

    return { mixedFour, isLoading };
  }
  const { mixedFour, isLoading } = useMixedPlaces();
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const navigate = useNavigate();
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event) => {
      if (
        isExpanded &&
        isMobile &&
        formRef.current &&
        !formRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded, isMobile]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (user.isAuthenticated) {
          setProfile(user.user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    console.log("Attempting to logout");
    dispatch(logout());
    setProfile(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const totalGuests = guests.adults + guests.children + guests.infants;
    const location = localStorage.getItem("userLocation") || "";
    const searchData = {
      query: searchQuery,
      //   tab: activeTab,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      //   time: time || undefined,
      guests: totalGuests.toString(),
      timestamp: new Date().toISOString(),
      location: location ? JSON.parse(location) : undefined,
    };

    // Store in localStorage
    localStorage.setItem("searchData", JSON.stringify(searchData));

    // Call onSearch callback if provided
    // if (onSearch) {
    //   onSearch(searchData);
    // }

    // Navigate to search page
    navigate(`/search`);
  };
  const footer = [
    {
      title: "Home",
      icon: <Home />,
      link: "/",
    },
    {
      title: "Moments",
      icon: <CalendarClock />,
      link: "/bookings",
    },
    {
      title: "Search",
      icon: <Search />,
      link: "/search",
    },
    {
      title: "Profile",
      icon: (
        <div className="relative text-gray-700" ref={dropdownRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center space-x-1`}
          >
            {loading ? (
              <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
            ) : (
              <>
                {profile ? (
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={profile.profilePic}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback className="text-xs">
                      {profile.firstName[0].toUpperCase()}
                      {profile.lastName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="w-6 h-6 text-gray-400 bg-gray-200 rounded-full p-1" />
                )}
              </>
            )}
            {isMenuOpen ? (
              <ChevronUp className={`w-5 h-5 text-gray-700`} />
            ) : (
              <ChevronDown className={`w-5 h-5 text-gray-700`} />
            )}
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
    <div
      className="bg-fire
    \ font-sans antialiased"
    >
      <Header />
      <main>
        {/* Hero Section */}
        <section
          className="
    bg-[linear-gradient(105deg,rgba(12,55,52,0.8),rgba(44,122,120,0.65)),url('https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')]
    bg-cover bg-center
   py-50 sm:h-[80vh]
  "
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Instantly book tables,
                <br />
                stays & nights out.
              </h1>
              <p className="text-lg md:text-xl mb-8 font-light opacity-95">
                Discover top restaurants, luxury hotels, and exclusive clubs.
                Reserve your spot instantly, all in one place, no waiting.
              </p>

              {/* Booking Bar */}
              <div ref={formRef} className="mt-8">
                {/* DESKTOP */}
                {!isMobile && (
                  <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-[60px] p-2 flex gap-2">
                    <div className="bg-white/90 rounded-[50px] text-gray-600 px-4 py-3 flex-1">
                      <SearchAutocomplete
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="search for restaurants, hotels, clubs..."
                      />
                    </div>

                    <div className="bg-white/90 rounded-[50px] px-4 py-3 flex-1">
                      <DateDropdown selectedDate={date} onChange={setDate} />
                    </div>

                    <div className="bg-white/90 rounded-[50px] px-4 py-3 flex-1">
                      <GuestDropdown onChange={setGuests} />
                    </div>

                    <button
                      onClick={handleSearchSubmit}
                      className="bg-[#18534f] hover:bg-[#0e4641] rounded-[50px] px-8 py-3 font-semibold text-white"
                    >
                      search
                    </button>
                  </div>
                )}
                {isMobile && !isExpanded && (
                  <div
                    onClick={() => setIsExpanded(true)}
                    className="bg-white rounded-2xl shadow-lg px-4 py-4 flex items-center cursor-pointer"
                  >
                    <span className="text-gray-400 mr-3">🔍</span>
                    <input
                      ref={inputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search restaurants, hotels, clubs..."
                      className="w-full bg-transparent text-gray-600 focus:outline-none"
                      readOnly
                    />
                  </div>
                )}
                {isMobile && isExpanded && (
                  <div className="bg-white rounded-2xl shadow-xl p-4 animate-in slide-in-from-bottom-5">
                    {/* <div className="flex justify-end mb-3">
                      <button onClick={() => setIsExpanded(false)}>✕</button>
                    </div> */}

                    <div className="flex flex-col text-gray-600 gap-4">
                      <SearchAutocomplete
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search restaurants, hotels, clubs..."
                        autoFocus
                      />

                      <DateDropdown selectedDate={date} onChange={setDate} />

                      <GuestDropdown onChange={setGuests} />

                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsExpanded(false)}
                          className="flex-1 border text-gray-600 rounded-xl py-3"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={(e) => {
                            handleSearchSubmit(e);
                            setIsExpanded(false);
                          }}
                          className="flex-1 bg-[#18534f] text-white rounded-xl py-3"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* {!isExpanded && ( */}
              <p className="mt-6 text-sm opacity-90">
                ✨ restaurants, hotels, clubs — find your vibe
              </p>
              {/* )} */}
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🍽️",
                title: "restaurants",
                desc: "Discover finest tables, from hidden gems to rooftop dining.",
                link: "book a table →",
                type: "restaurants",
              },
              {
                icon: "🏨",
                title: "hotels",
                desc: "Curated stays — boutique, luxury, or quick getaway.",
                link: "find a room →",
                type: "hotels",
              },
              {
                icon: "🎧",
                title: "clubs & lounges",
                desc: "Guestlist, VIP tables & entry to the hottest nightspots.",
                link: "reserve night →",
                type: "clubs",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-white border border-[#b2d8d5] rounded-3xl p-8 hover:bg-[#e0f2f1] hover:border-[#2c7a78] transition"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-[#18534f] mb-2">
                  {service.title}
                </h3>
                <p className="text-[#2d5551] mb-6">{service.desc}</p>
                <div
                  onClick={() => {
                    mounted && localStorage.setItem("activeTab", service.type);
                    navigate("/book-reservation");
                  }}
                  className="text-[#2c7a78] cursor-pointer font-semibold underline pb-0.5  transition"
                >
                  {service.link}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Places */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <span className="text-[#2c7a78] font-medium uppercase tracking-wider text-sm">
              curated picks
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0c3734] mt-2">
              popular places this week
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))
              : mixedFour.map((place, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      navigate(`/${place.vendorType}s/${place._id}`)
                    }
                    className="bg-white border border-[#b2d8d5] cursor-pointer rounded-3xl overflow-hidden hover:-translate-y-1 transition"
                  >
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${place.profileImages[0]}')`,
                      }}
                    ></div>

                    <div className="p-5">
                      <span className="bg-[#e0f2f1] text-[#18534f] w-fit gap-2 flex justify-between items-center px-3 py-1 rounded-full text-xs font-semibold mb-3">
                        <span>
                          {place.vendorType === "restaurant"
                            ? "🍽️"
                            : place.vendorType === "hotel"
                              ? "🏨"
                              : "🎶"}
                        </span>
                        <span>{place.vendorType}</span>
                      </span>

                      <h4 className="text-xl text-[#0c3734] font-semibold">
                        {place.businessName}
                      </h4>

                      <p className="text-[#7ab3b0] font-medium text-sm mt-1">
                        {place.vendorType === "restaurant"
                          ? place.cuisines.slice(0, 2).join(", ")
                          : place.vendorType === "hotel"
                            ? formatOfferText(place.offer)
                            : place.vendorType === "club"
                              ? place.categories.slice(0, 2).join(", ")
                              : " "}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
        {/* How it works */}
        <section className="how mt-[4rem]">
          <div className="section-wrap sm:max-w-7xl  sm:px-6 lg:px-8 py-16">
            <span className="section-tag">Simple Process</span>
            <h2 style={{ color: "white" }}>Book in Under 2 Minutes</h2>
            <p className="section-sub">
              From discovery to confirmation — effortless every time.
            </p>
            <div className="steps">
              {steps.map((step, index) => (
                <div key={step.id} className="step">
                  <div className="step-num">{step.number}</div>
                  <div className="step-type rounded-full">
                    <div className="step-icon">{step.icon}</div>
                    <h3>{step.title}</h3>
                  </div>
                  <p>{step.description}</p>
                  {index !== steps.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Owner CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-[#18534f] to-[#2c7a78] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-xl font-light block mb-2">
                are you a venue owner?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                claim your <br />
                restaurant, hotel or club
              </h2>
            </div>
            <a
              href="partner"
              className="border-2 border-white rounded-[60px] px-10 py-4 font-semibold text-lg hover:bg-white/10 transition whitespace-nowrap"
            >
              get started →
            </a>
          </div>
        </div>

        {/* Reservation Management */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#e0f2f1] border border-[#b2d8d5] rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <span className="text-[#2c7a78] font-medium uppercase tracking-wider text-sm">
                waitlist & reservations
              </span>
              <h2 className="text-3xl md:text-4xl text-[#0c3734] font-semibold leading-tight mt-3 mb-4">
                receive & manage bookings seamlessly
              </h2>
              <p className="text-[#18534f] text-lg mb-8">
                One dashboard for tables, rooms & guestlist. No stress.
              </p>
              <a
                href="partner"
                className="bg-[#18534f] text-white px-8 py-4 rounded-[40px] font-semibold inline-block hover:bg-[#0c3734] transition"
              >
                learn more
              </a>
            </div>
            <div className="bg-white border border-[#b2d8d5] rounded-3xl p-8">
              <p className="font-semibold text-[#0c3734] mb-4">
                ✔ real‑time availability
              </p>
              <p className="font-semibold text-[#0c3734] mb-4">
                ✔ multi‑venue (resto/hotel/club)
              </p>
              <p className="font-semibold text-[#0c3734] mb-4">
                ✔ guest insights
              </p>
              <p className="text-[#2c7a78] italic mt-4">
                — no shadow, just smooth flow
              </p>
            </div>
          </div>
        </div>

        {/* Blog Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <span className="text-[#2c7a78] font-medium uppercase tracking-wider text-sm">
              latest stories
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0c3734] mt-2">
              insider guides & inspiration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                date: "feb 20, 2026",
                title: "5 new rooftop bars in Lagos",
                desc: "Perfect for sunset drinks and club after-parties.",
              },
              {
                date: "feb 18, 2026",
                title: "hotel & club combos",
                desc: "Stay and play — best packages this weekend.",
              },
              {
                date: "feb 15, 2026",
                title: "booking etiquette: tables vs. guestlist",
                desc: "Everything you need to know.",
              },
            ].map((post, idx) => (
              <article
                key={idx}
                className="bg-white border border-[#b2d8d5] rounded-3xl p-8 hover:bg-[#e0f2f1] transition"
              >
                <time className="text-[#7ab3b0] text-xs font-medium uppercase">
                  {post.date}
                </time>
                <h3 className="text-2xl text-[#0c3734] font-semibold my-3">
                  {post.title}
                </h3>
                <p className="text-[#18534f]">{post.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </main>

     {profile && <div className="fixed bottom-0 left-0 w-full bg-white py-2 flex items-center justify-center gap-12 border-t md:hidden z-50">
        {footer.map((item, i) => (
          <button
            onClick={() => item.link && navigate(item.link)}
            key={i}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <div className="flex items-center gap-1 flex-col ">
              <div>{item.icon}</div>
              <span className="text-xs">{item.title}</span>
            </div>
          </button>
        ))}
      </div>}
      {/* Footer */}
      <div className={`${profile && "hidden"} md:block`}>
        <Footer />
      </div>
    </div>
  );
}

export default UserLandingPage;

const steps = [
  {
    id: 1,
    number: "01",
    icon: (
      <>
        <svg width="0" height="0">
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8f9093" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </svg>

        <FaSearchLocation
          style={{ fill: "url(#iconGradient)" }}
          className="w-6 h-6"
        />
      </>
    ),
    title: "Search",
    description:
      "Find restaurants, hotels, or clubs by cuisine, location, date, or vibe.",
  },
  {
    id: 2,
    number: "02",
    title: "Choose",
    icon: (
      <>
        <svg width="0" height="0">
          <linearGradient
            id="iconGradient2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#81d6c0" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </svg>

        <IoCalendarNumber
          style={{ fill: "url(#iconGradient2)" }}
          className="w-6 h-6"
        />
      </>
    ),
    description:
      "Browse real-time availability. Read reviews. Pick your perfect spot.",
  },
  {
    id: 3,
    number: "03",
    icon: "✅",
    title: "Confirm",
    description:
      "Book instantly with no phone calls. Get a confirmation in seconds.",
  },
  {
    id: 4,
    number: "04",
    icon: "🎉",
    title: "Enjoy",
    description:
      "Show up, relax, and enjoy your experience. We'll handle the rest.",
  },
];
const SkeletonCard = () => {
  return (
    <div className="bg-white border border-[#b2d8d5] rounded-3xl overflow-hidden animate-pulse">
      <div className="h-48 bg-[#d9ecea]" />

      <div className="p-5">
        <div className="h-6 w-24 bg-[#d9ecea] rounded-full mb-3" />

        <div className="h-6 w-3/4 bg-[#d9ecea] rounded mb-2" />

        <div className="h-4 w-1/2 bg-[#d9ecea] rounded" />
      </div>
    </div>
  );
};
