import { BookingsIcon, BranchesIcon, DashBoardIcon, LogoutIcon, MenuIcon, PaymentIcon, SettingIcon } from '@/assets/icons/icons';
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  Users
} from 'lucide-react';

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
    { icon: LogoutIcon, label: 'Logout', path: '/logout' },
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
    { icon: LogoutIcon, label: 'Logout', path: '/logout' },
  ]
};

export const ClubList = {
  topItems: [
    { icon: DashBoardIcon, label: 'Dashboard', path: '/club/dashboard' },
    { icon: BookingsIcon, label: 'Events', path: '/club/events' },
    { icon: MapPin, label: 'Venues', path: '/club/venues' },
    { icon: MenuIcon, label: 'Services', path: '/club/services' },
    { icon: PaymentIcon, label: 'Memberships', path: '/club/memberships' },
    { icon: Users, label: 'Members', path: '/club/members' },
  ],
    bottomItems: [
    { icon: SettingIcon, label: 'Settings', path: '/club/settings' },
    { icon: LogoutIcon, label: 'Logout', path: '/logout' },
  ]
};