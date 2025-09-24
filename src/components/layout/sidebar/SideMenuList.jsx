import { 
  LayoutDashboard,
  Calendar,
  MapPin,
  Menu as MenuIcon,
  CreditCard,
  Users,
  Settings,
  LogOut,
  X
} from 'lucide-react';

// Menu configurations
export const RestaurantList = {
  topItems: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/restaurant/dashboard' },
    { icon: Calendar, label: 'Reservations', path: '/restaurant/reservations' },
    { icon: MapPin, label: 'Branches', path: '/restaurant/branches' },
    { icon: MenuIcon, label: 'Menu Management', path: '/restaurant/menu' },
    { icon: CreditCard, label: 'Payments', path: '/restaurant/payments' },
    { icon: Users, label: 'Staff', path: '/restaurant/staff' },
  ],
  bottomItems: [
    { icon: Settings, label: 'Settings', path: '/restaurant/settings' },
    { icon: LogOut, label: 'Logout', path: '/logout' },
  ]
};

export const HotelList = {
  topItems: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/hotel/dashboard' },
    { icon: Calendar, label: 'Bookings', path: '/hotel/bookings' },
    { icon: MapPin, label: 'Locations', path: '/hotel/locations' },
    { icon: MenuIcon, label: 'Room Management', path: '/hotel/rooms' },
    { icon: CreditCard, label: 'Payments', path: '/hotel/payments' },
    { icon: Users, label: 'Staff', path: '/hotel/staff' },
  ],
  bottomItems: [
    { icon: Settings, label: 'Settings', path: '/hotel/settings' },
    { icon: LogOut, label: 'Logout', path: '/logout' },
  ]
};

export const ClubList = {
  topItems: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/club/dashboard' },
    { icon: Calendar, label: 'Events', path: '/club/events' },
    { icon: MapPin, label: 'Venues', path: '/club/venues' },
    { icon: MenuIcon, label: 'Services', path: '/club/services' },
    { icon: CreditCard, label: 'Memberships', path: '/club/memberships' },
    { icon: Users, label: 'Members', path: '/club/members' },
  ],
  bottomItems: [
    { icon: Settings, label: 'Settings', path: '/club/settings' },
    { icon: LogOut, label: 'Logout', path: '/logout' },
  ]
};