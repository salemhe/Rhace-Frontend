import UsersIcon, {
  DashBoardIcon,
  BranchesIcon,
  BookingsIcon,
  PaymentIcon,
  Amenities,
  SettingsIcon,
} from "../../../assets/icons/icons";

export const AdminList = {
  topItems: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: DashBoardIcon,
    },
    {
      label: "Vendors",
      path: "/admin/vendors",
      icon: BranchesIcon,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: UsersIcon,
    },
    {
      label: "Reservations",
      path: "/admin/reservations",
      icon: BookingsIcon,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: PaymentIcon,
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: Amenities,
    },
  ],
  bottomItems: [
    {
      label: "Settings",
      path: "/admin/settings",
      icon: SettingsIcon,
    },
  ],
};

export const ClubList = {
  topItems: [],
  bottomItems: [],
};

export const HotelList = {
  topItems: [],
  bottomItems: [],
};

export const RestaurantList = {
  topItems: [],
  bottomItems: [],
};