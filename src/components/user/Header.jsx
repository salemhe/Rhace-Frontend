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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { SearchSectionTwo } from "./SearchSection";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { SearchSectionTwo } from "../SearchSection";

// logo imports — 
import logoBlack from '@/assets/Rhace-11.png';

const Header = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(pathname === '/');
  const [isSearchPage, setIsSearchPage] = useState(pathname.startsWith('/search'));
  const [isLoginSlug, setIsLoginSlug] = useState(pathname.startsWith('-login'));
  const [ishotelPaymentPage, setIsHotelPaymentPage] = useState(pathname.startsWith('/hotels/:id/payment'));
  const [onboarding, setOnboarding] = useState(pathname === '/onboarding');
  const [isverifyStaffPage, setIsVerifyStaffPage] = useState(pathname.startsWith('/verify-staff'));
  const user = useSelector((state) => state.auth);


  // Check if the current path is a login slug
  useEffect(() => {

    setIsLoginSlug(pathname?.endsWith('-login'));
    setIsHotelPaymentPage(pathname?.startsWith('/hotels/') && pathname.endsWith('/payment'));
    setOnboarding(pathname === '/onboarding');
    setIsVerifyStaffPage(pathname?.startsWith('/verify-staff'));
  }, [pathname]);

  useEffect(() => {
    setIsHomePage(pathname === '/');
    setIsSearchPage(pathname?.startsWith('/search'));
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        if (user.isAuthenticated) {
          setProfile(user.user);
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    console.log("Attempting to logout")
    dispatch(logout());
    setProfile(null);
  };

  const hideNavigation = !isLoginSlug && !ishotelPaymentPage && !onboarding && !isverifyStaffPage;

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
                <AvatarFallback>
                  {profile.firstName[0].toUpperCase()}
                  {profile.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown size={18} className="text-gray-600" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72 bg-gray-50 rounded-2xl">
            {/* Header */}
            <div className="flex items-center px-4 py-4">
              <Avatar className="w-10 h-10 mr-3">
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
              <a href="/messages">Messages</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="  px-4 py-2">
              <a href="/bookings">Bookings/Reservation</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="  px-4 py-2" >
              <a href="/wishlist">Wishlist</a>
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
              <a href="/help">Help Center</a>
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
        <Button className="cursor-pointer rounded-full" variant={scrolled || !isHomePage ? "ghost" : "default"} asChild>
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

  // const renderMobileMenu = () => {
  //   return (
  //     <div className="pt-4 pb-3 border-t border-gray-200 z-20 flex flex-col">
  //       {profile ? (
  //         <>
  //           <div className="flex items-center px-4">
  //             <Avatar>
  //               <AvatarFallback>
  //                 {profile.firstName.charAt(0).toUpperCase()}
  //                 {profile.lastName.charAt(0).toUpperCase()}
  //               </AvatarFallback>
  //             </Avatar>
  //             <div className="ml-3">
  //               <div className="text-sm font-medium text-gray-800">
  //                 {profile.firstName}
  //               </div>
  //               <div className="text-xs font-medium text-gray-500">
  //                 {profile.email}
  //               </div>
  //             </div>
  //           </div>
  //           <div className="mt-3 space-y-1 w-full">
  //             <SheetClose
  //               className="w-full text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm"
  //               asChild
  //             >
  //               <Link
  //                 href="/userDashboard/search"
  //                 className="w-full text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm"
  //               >
  //                 Dashboard
  //               </Link>
  //             </SheetClose>
  //             <SheetClose
  //               className="w-full text-left hover:bg-accent hover:text-red-600 px-4 py-2 text-sm text-red-600 flex items-center"
  //               onClick={handleLogout}
  //             >
  //               <LogOut className="h-4 w-4 mr-2" />
  //               Logout
  //             </SheetClose>
  //           </div>
  //         </>
  //       ) : (
  //         <div className="mt-3 space-y-2 flex flex-col w-full">
  //           <Button
  //             className="cursor-pointer rounded-full"
  //             variant="outline"
  //             asChild
  //           >
  //             <Link href="/user-login">Login</Link>
  //           </Button>
  //           <Button
  //             className="cursor-pointer rounded-full bg-teal-700 hover:bg-teal-700/90"
  //             asChild
  //           >
  //             <Link href="user-signup">Create Account</Link>
  //           </Button>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  const handleSearch = (searchData) => {
    if (!searchData.query.trim()) return;
    localStorage.setItem('searchData', JSON.stringify(searchData));
    if (typeof window !== 'undefined') {
      window.location.href = `/search`;
    }
  };

  return (
    hideNavigation ? (
      <nav className={`fixed top-0 z-90 w-full transition-all duration-300 ${scrolled || !isHomePage ? 'bg-[#F9FAFB] ' : 'bg-transparent'}`}>
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
            {
              !isSearchPage ? (
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
                        className={`${scrolled || !isHomePage ? 'text-gray-700' : 'text-[#F9FAFB]'} 
                          text-[1rem] hover:text-teal-500 font-bold px-3 py-2 transition-colors
                          relative group`}
                      >
                        {item.name}
                        <span
                          className={`absolute h-0.5 w-0 bg-teal-500 left-1/2 -translate-x-1/2 bottom-0 rounded-full
                          ${isActive ? 'w-[24px] h-2' : 'group-hover:w-[24px] h-2'} transition-all duration-300`}
                        />
                      </a>
                    )
                  })}
                </div>
              ) : (
                <div className="sm:flex hidden">
                  <SearchSectionTwo onSearch={handleSearch} />
                </div>
              )
            }
            <div className="hidden md:ml-6 md:flex items-center space-x-4">
              {renderAuthButtons()}
            </div>
            {/* <div className="md:hidden flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={`${scrolled || isSearchPage ? 'text-gray-700' : 'text-white'}`}>
                    <span className="sr-only">Open main menu</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="pt-4 pb-3 space-y-1">
                    {navItems.map((item) => (
                      <SheetClose
                        key={item.name}
                        asChild
                        onClick={() => router.push(item.href)}
                      >
                        <Link
                          href={item.href}
                          className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 py-2 border-l-4 text-base font-medium w-full text-start"
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  {renderMobileMenu()}
                </SheetContent>
              </Sheet>
            </div> */}
          </div>
        </div>
      </nav>
    ) : null
  );
};

export default Header;
