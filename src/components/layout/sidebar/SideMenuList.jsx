import { BookingsIcon, BranchesIcon, DashBoardIcon, LogoutIcon, MenuIcon, PaymentIcon, SettingIcon } from '@/assets/icons/icons';

// Menu configurations
export const RestaurantList = {
  topItems: [
    { icon: DashBoardIcon, label: 'Dashboard', path: '/dashboard' },
    { icon: BookingsIcon, label: 'Reservations', path: '/dashboard/restaurant/reservation' },
    // { icon: MapPin, label: 'Branches', path: '/restaurant/branches' },
    { icon: MenuIcon, label: 'Menu Management', path: '/dashboard/restaurant/menu' },
    { icon: PaymentIcon, label: 'Payments', path: '/dashboard/restaurant/payments' },
    // { icon: Users, label: 'Staff', path: '/restaurant/staff' },
  ],
  bottomItems: [
    { icon: SettingIcon, label: 'Settings', path: '/dashboard/restaurant/settings' },
    { icon: LogoutIcon, label: 'Logout', path: '/auth/vendor/login' },
  ]
};

export const HotelList = {
  topItems: [
    { icon: DashBoardIcon, label: 'Dashboard', path: '/hotel/dashboard' },
    { icon: BookingsIcon, label: 'Bookings', path: '/hotel/bookings' },
    { icon: BranchesIcon, label: 'Room Management', path: '/hotel/rooms' },
    { icon: PaymentIcon, label: 'Payments', path: '/hotel/payments' },
    //  { icon: Users, label: 'Staff', path: '/hotel/staff' },
  ],
    bottomItems: [
    { icon: SettingIcon, label: 'Settings', path: '/hotel/settings' },
    { icon: LogoutIcon, label: 'Logout', path: '/auth/vendor/login' },
  ]
};

export const ClubList = {
  topItems: [
    { icon: DashBoardIcon, label: 'Dashboard', path: '/club/dashboard' },
    { icon: BookingsIcon, label: 'Reservations', path: '/club/reservations' },
    // { icon: MapPin, label: 'Venues', path: '/club/venues' },
    { icon: MenuIcon, label: 'Drink Menu', path: '/club/drinks' },
    { icon: PaymentIcon, label: 'Payments', path: '/club/payments' },
    // { icon: Users, label: 'Members', path: '/club/members' },
  ],
    bottomItems: [
    { icon: SettingIcon, label: 'Settings', path: '/club/settings' },
    { icon: LogoutIcon, label: 'Logout', path: '/auth/vendor/login' },
  ]
};