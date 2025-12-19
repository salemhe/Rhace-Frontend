import  { UsersIcon,
  DashBoardIcon,
  BranchesIcon,
  BookingsIcon,
  PaymentIcon,
  Amenities,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  PeopleIcon,
} from "../../../public/icons/icons";

export const AdminList = {
  topItems: [
    {
      label: "Dashboard",
      path: "/dashboard/admin",
      icon: DashBoardIcon,
    },
    {
      label: "Vendors",
      path: "/dashboard/admin/vendors",
      icon: BranchesIcon,
    },
    {
      label: "Users",
      path: "/dashboard/admin/users",
      icon: UsersIcon,
    },
    {
      label: "Reservations",
      path: "/dashboard/admin/reservations",
      icon: BookingsIcon,
    },
    {
      label: "Payments",
      path: "/dashboard/admin/payments",
      icon: PaymentIcon,
    },
    {
      label: "Reports",
      path: "/dashboard/admin/reports",
      icon: Amenities,
    },
  ],
  bottomItems: [
    {
      label: "Settings",
      path: "/dashboard/admin/settings",
      icon: SettingsIcon,
    },
  ],
};

export const ClubList = {
  topItems: [
    {
      label: "Dashboard",
      path: "/dashboard/club",
      icon: DashBoardIcon,
    },
    {
      label: "Reservations",
      path: "/dashboard/club/reservations",
      icon: BookingsIcon,
    },
        {
      label: "Drink Menu",
      path: "/dashboard/club/drinks",
      icon: MenuIcon,
    },
    {
      label: "Payments",
      path: "/dashboard/club/payments",
      icon: PaymentIcon,
    },
      { icon: PeopleIcon, label: 'Staffs', path: '/dashboard/club/Staffs' },
  ],
  bottomItems: [
    {
      label: "Settings",
      path: "/dashboard/club/settings",
      icon: SettingsIcon,
    },
    {
      label: "Logout",
      path: "#logout",
      icon: LogoutIcon,
    },
  ],
};

export const HotelList = {
  topItems: [
    {
      label: "Dashboard",
      path: "/dashboard/hotel",
      icon: DashBoardIcon,
    },
    {
      label: "Bookings",
      path: "/dashboard/hotel/bookings",
      icon: BookingsIcon,
    },
    {
      label: "Rooms Management",
      path: "/dashboard/hotel/rooms",
      icon: BranchesIcon,
    },
    {
      label: "Payments",
      path: "/dashboard/hotel/payments",
      icon: PaymentIcon,
    },
    
     { icon: PeopleIcon, label: 'Staffs', path: '/dashboard/hotel/staffs' },
  ],
  bottomItems: [
    {
      label: "Settings",
      path: "/dashboard/hotel/settings",
      icon: SettingsIcon,
    },
    {
      label: "Logout",
      path: "#logout",
      icon: LogoutIcon,
    },
  ],
};

export const RestaurantList = {
  topItems: [
    {
      label: "Dashboard",
      path: "/dashboard/restaurant",
      icon: DashBoardIcon,
    },
    {
      label: "Reservations",
      path: "/dashboard/restaurant/reservation",
      icon: BookingsIcon,
    },
    {
      label: "Menu Management",
      path: "/dashboard/restaurant/menu",
      icon: MenuIcon,
    },
    
    { icon: PeopleIcon, label: 'Staffs', path: '/dashboard/restaurant/staffs' },
    {
      label: "Payments",
      path: "/dashboard/restaurant/payments",
      icon: PaymentIcon,
    },
  ],
  bottomItems: [
    {
      label: "Settings",
      path: "/dashboard/restaurant/settings",
      icon: SettingsIcon,
    },
    {
      label: "Logout",
      path: "#logout",
      icon: LogoutIcon,
    },
  ],
};
