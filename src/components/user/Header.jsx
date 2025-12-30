import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
// import AccountTypeModal from "./AccountTypeModal";
// import { AuthService } from "@/app/lib/api/services/userAuth.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { SearchSectionTwo } from "./SearchSection";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { SearchSectionTwo } from "../SearchSection";

// logo imports —
import logoBlack from "@/public/images/Rhace-11.png";

const Header = ({ onClick = () => {}, activeTab = null }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(pathname === "/");
  const [isSearchPage, setIsSearchPage] = useState(
    pathname.startsWith("/search")
  );
  const [isLoginSlug, setIsLoginSlug] = useState(pathname.startsWith("-login"));
  const [ishotelPaymentPage, setIsHotelPaymentPage] = useState(
    pathname.startsWith("/hotels/:id/payment")
  );
  const [onboarding, setOnboarding] = useState(pathname === "/onboarding");
  const [isverifyStaffPage, setIsVerifyStaffPage] = useState(
    pathname.startsWith("/verify-staff")
  );
  const user = useSelector((state) => state.auth);

  // Check if the current path is a login slug
  useEffect(() => {
    setIsLoginSlug(pathname?.endsWith("-login"));
    setIsHotelPaymentPage(
      pathname?.startsWith("/hotels/") && pathname.endsWith("/payment")
    );
    setOnboarding(pathname === "/onboarding");
    setIsVerifyStaffPage(pathname?.startsWith("/verify-staff"));
  }, [pathname]);

  useEffect(() => {
    setIsHomePage(pathname === "/");
    setIsSearchPage(pathname?.startsWith("/search"));
  }, [pathname]);

  // Auth state management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { name: "Home", href: "/" },
    // { name: "Restaurants", href: "/userDashboard/search" },
    { name: "Bookings / Reservations", href: "/bookings" },
    { name: "Favorites", href: "/favorites" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, []);

  const handleLogout = async () => {
    console.log("Attempting to logout");
    dispatch(logout());
    setProfile(null);
  };

  const hideNavigation =
    !isLoginSlug && !ishotelPaymentPage && !onboarding && !isverifyStaffPage;

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="size-10 bg-gray-300 mr-[50px] animate-pulse rounded-full" />
      );
    }
    if (profile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="flex items-center bg-transparent w-24 h-14 p-2 rounded-[36px]
                         outline-1 outline-offset-[-1px] outline-gray-200 gap-2 cursor-pointer"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={profile.profilePic}
                  alt={`${profile.firstName} ${profile.lastName}`}
                />
                <AvatarFallback>
                  {profile.firstName[0].toUpperCase()}
                  {profile.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown size={18} className="text-gray-600" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-72 bg-gray-50 rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center px-4 py-4">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarImage
                  src={profile.profilePic}
                  alt={`${profile.firstName} ${profile.lastName}`}
                />
                <AvatarFallback>
                  {profile.firstName[0].toUpperCase()}
                  {profile.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Hi, {profile.firstName} {profile.lastName}
                </p>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Primary links */}
            <DropdownMenuItem asChild className="  px-4 py-2">
              <a href="/bookings">Bookings/Reservation</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="  px-4 py-2">
              <a href="/favorites">Wishlist</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="  px-4 py-2">
              <a href="/payments">Payments/Transaction</a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Secondary links */}
            <DropdownMenuItem asChild className="  px-4 py-2">
              <a href="/account">Account</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="  px-4 py-2">
              <a href="/contact">Help Center</a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Sign out */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <Button
          className="cursor-pointer rounded-full"
          variant={scrolled || !isHomePage ? "ghost" : "default"}
          asChild
        >
          <a href="/auth/user/login">Login</a>
        </Button>
        <Button
          className="cursor-pointer rounded-full bg-teal-700 hover:bg-teal-700/90"
          asChild
        >
          <a href="/auth/user/signup">Create Account</a>
        </Button>
      </>
    );
  };

  const SvgIcon = ({ isActive }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill={isActive ? "#2b9a57" : "#868484"}
        fillRule="evenodd"
        d="M5.5 1.333A.833.833 0 0 1 6.333.5h3.334a.833.833 0 0 1 0 1.667h-.834v.862c4.534.409 7.509 5.11 5.775 9.447a.83.83 0 0 1-.775.524H2.167a.83.83 0 0 1-.774-.524c-1.735-4.337 1.24-9.038 5.774-9.447v-.862h-.834a.833.833 0 0 1-.833-.834m2.308 3.334c-3.521 0-5.986 3.377-5.047 6.666h10.478c.94-3.289-1.526-6.666-5.047-6.666zm-7.308 10a.833.833 0 0 1 .833-.834h13.334a.833.833 0 0 1 0 1.667H1.333a.833.833 0 0 1-.833-.833"
        clipRule="evenodd"
      />
    </svg>
  );

  const SvgIcon2 = ({ isActive }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
    >
      <path
        fill={isActive ? "#2b9a57" : "#868484"}
        fillRule="evenodd"
        d="M7.96.83a1.67 1.67 0 0 0-1.384.153l-3.433 2.06a1.67 1.67 0 0 0-.81 1.429v11.195H1.5a.833.833 0 0 0 0 1.666h15a.833.833 0 1 0 0-1.666h-.833V4.6a1.67 1.67 0 0 0-1.14-1.58zM14 15.668V4.6L8.167 2.657v13.01zM6.5 2.972 4 4.472v11.195h2.5z"
        clipRule="evenodd"
      />
    </svg>
  );

  const SvgIcon3 = ({ isActive }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
    >
      <path
        fill={isActive ? "#2b9a57" : "#868484"}
        fillRule="evenodd"
        d="M11.1666 0.666992C11.8296 0.666992 12.4655 0.930384 12.9344 1.39923C13.4032 1.86807 13.6666 2.50395 13.6666 3.16699V14.8337C13.6666 15.4967 13.4032 16.1326 12.9344 16.6014C12.4655 17.0703 11.8296 17.3337 11.1666 17.3337H2.83325C2.17021 17.3337 1.53433 17.0703 1.06549 16.6014C0.596644 16.1326 0.333252 15.4967 0.333252 14.8337V3.16699C0.333252 2.50395 0.596644 1.86807 1.06549 1.39923C1.53433 0.930384 2.17021 0.666992 2.83325 0.666992H11.1666ZM11.1666 2.33366H2.83325C2.61224 2.33366 2.40028 2.42146 2.244 2.57774C2.08772 2.73402 1.99992 2.94598 1.99992 3.16699V14.8337C1.99992 15.0547 2.08772 15.2666 2.244 15.4229C2.40028 15.5792 2.61224 15.667 2.83325 15.667H11.1666C11.3876 15.667 11.5996 15.5792 11.7558 15.4229C11.9121 15.2666 11.9999 15.0547 11.9999 14.8337V3.16699C11.9999 2.94598 11.9121 2.73402 11.7558 2.57774C11.5996 2.42146 11.3876 2.33366 11.1666 2.33366ZM6.99992 7.33366C7.88397 7.33366 8.73182 7.68485 9.35694 8.30997C9.98206 8.93509 10.3333 9.78294 10.3333 10.667C10.3333 11.551 9.98206 12.3989 9.35694 13.024C8.73182 13.6491 7.88397 14.0003 6.99992 14.0003C6.11586 14.0003 5.26802 13.6491 4.6429 13.024C4.01777 12.3989 3.66659 11.551 3.66659 10.667C3.66659 9.78294 4.01777 8.93509 4.6429 8.30997C5.26802 7.68485 6.11586 7.33366 6.99992 7.33366ZM6.99992 9.00033C6.55789 9.00033 6.13397 9.17592 5.82141 9.48848C5.50885 9.80104 5.33325 10.225 5.33325 10.667C5.33325 11.109 5.50885 11.5329 5.82141 11.8455C6.13397 12.1581 6.55789 12.3337 6.99992 12.3337C7.44195 12.3337 7.86587 12.1581 8.17843 11.8455C8.49099 11.5329 8.66658 11.109 8.66658 10.667C8.66658 10.225 8.49099 9.80104 8.17843 9.48848C7.86587 9.17592 7.44195 9.00033 6.99992 9.00033ZM6.99992 4.00033C7.33144 4.00033 7.64938 4.13202 7.8838 4.36644C8.11822 4.60086 8.24992 4.9188 8.24992 5.25033C8.24992 5.58185 8.11822 5.89979 7.8838 6.13421C7.64938 6.36863 7.33144 6.50033 6.99992 6.50033C6.6684 6.50033 6.35046 6.36863 6.11603 6.13421C5.88161 5.89979 5.74992 5.58185 5.74992 5.25033C5.74992 4.9188 5.88161 4.60086 6.11603 4.36644C6.35046 4.13202 6.6684 4.00033 6.99992 4.00033Z"
        clipRule="evenodd"
      />
    </svg>
  );

  const tabs = [
    {
      name: "Restaurants",
      value: "restaurants",
      icon: SvgIcon,
    },
    {
      name: "Hotels",
      value: "hotels",
      icon: SvgIcon2,
    },
    {
      name: "Clubs",
      value: "clubs",
      icon: SvgIcon3,
    },
  ];

  console.log(activeTab);

  return hideNavigation ? (
    <nav
      className={`fixed top-0 z-90 w-full transition-all duration-300 ${
        scrolled || !isHomePage ? "bg-[#F9FAFB] " : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <img
                  src={logoBlack}
                  alt="Rhace Logo"
                  className="h-6 w-auto object-contain transition-all duration-300"
                />
              </a>
            </div>
          </div>
          {!isSearchPage ? (
            <div className="hidden md:ml-6 md:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      scrolled || !isHomePage
                        ? "text-gray-700"
                        : "text-[#F9FAFB]"
                    } 
                          text-[1rem] hover:text-teal-500 font-bold px-3 py-2 transition-colors
                          relative group`}
                  >
                    {item.name}
                    <span
                      className={`absolute h-0.5 w-0 bg-teal-500 left-1/2 -translate-x-1/2 bottom-0 rounded-full
                          ${
                            isActive
                              ? "w-[24px] h-2"
                              : "group-hover:w-[24px] h-2"
                          } transition-all duration-300`}
                    />
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="sm:flex hidden">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onClick(tab.value)}
                      className={`
                        whitespace-nowrap py-2 px-1 font-medium text-sm capitalize
                        flex items-center gap-2
                        ${
                          activeTab === tab.value
                            ? "border-teal-600 border-b-2 text-teal-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }
                      `}
                    >
                      <figure className="w-4 h-4 sm:w-5 sm:h-5 flex items-center">
                        <Icon isActive={activeTab === tab.value} />
                      </figure>
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
          <div className="md:ml-6 flex items-center space-x-4">
            {renderAuthButtons()}
          </div>
        </div>
      </div>
    </nav>
  ) : null;
};

export default Header;
