import { Club, MenuIcon, PaymentIcon, Restaurant, Hotel } from "@/public/icons/icons";
import { Utensils, Music, Shield, 
  CreditCard, Clock, Image, MapPin, Star, 
  Pizza, Wine, Users 
} from "lucide-react";

export const vendorSettingsConfig = [
  {
    vendorType: "hotel",
    categories: [
      { id: "general", label: "General", icon: Hotel, disabled: false },
      { id: "amenities", label: "Amenities", icon: Star, disabled: true },
      { id: "policies", label: "Policies", icon: Shield, disabled: true },
      { id: "images", label: "Gallery", icon: Image, disabled: true },
      { id: "billing", label: "Billing", icon: PaymentIcon, disabled: true },
    ],
  },
  {
    vendorType: "restaurant",
    categories: [
      { id: "general", label: "General", icon: Restaurant, disabled: false },
      { id: "cuisine", label: "Cuisine", icon: Pizza, disabled: true },
      { id: "menu", label: "Menu", icon: MenuIcon, disabled: true },
      { id: "slots", label: "Slots", icon: Clock, disabled: true },
      { id: "billing", label: "Billing", icon: PaymentIcon, disabled: true },
    ],
  },
  {
    vendorType: "club",
    categories: [
      { id: "general", label: "General", icon: Club, disabled: false },
      { id: "vibe", label: "Vibe & Music", icon: Wine, disabled: true },
      { id: "tables", label: "VIP Tables", icon: Users, disabled: true },
      { id: "hours", label: "Opening Hours", icon: Clock, disabled: true },
      { id: "billing", label: "Billing", icon: PaymentIcon, disabled: true },
    ],
  }
];