import {
  RestaurantImage1,
  RestaurantImage2,
  RestaurantImage3,
  RestaurantImage4,
  RestaurantImage5,
  JollofRiceImage,
  ClubImage1,
  ClubImage3,
  ClubImage4,
  ClubImage5,
  ClubImage2,
} from "@/assets";

export const RestaurantData = {
  data: [
    {
      _id: "1",
      businessName: "The Gourmet Kitchen",
      address: "123 Culinary St, Foodie City, FC 45678",
      phone: "+1 (555) 123-4567",
      email: "info@gourmetkitchen.com",
      profileImages: [
        {
          url: RestaurantImage1,
        },
        {
          url: RestaurantImage2,
        },
        {
          url: RestaurantImage3,
        },
        {
          url: RestaurantImage4,
        },
        {
          url: RestaurantImage5,
        },
      ],
      rating: 4.8,
      reviews: 256,
      cuisine: "Italian, French, Contemporary",
      openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
      priceRange: "$$$",
      amenities: ["Free Wi-Fi", "Outdoor Seating", "Live Music"],
      menu: [
        {
          name: "Bruschetta",
          description:
            "Grilled bread topped with fresh tomatoes, basil, and olive oil.",
        },
      ],
      openingTime: "11:00 AM",
      closingTime: "10:00 PM",
      cuisines: ["Italian", "French", "Contemporary"],
      businessDescription:
        "A fine dining experience with a focus on seasonal ingredients.",
      availableSlots: ["11:00 AM"],
    },
  ],
};

export const MenusData = [
  {
    category: "Main Course",
    _id: "1",
    dishName: "Jollof Rice",
    itemImage: JollofRiceImage,
    description: "Authentic Jollof filled with love taste in every scoop",
    price: 2000,
    specialRequest: "I need it packaged well!",
  },
];

export const RestaurantBooking = [
  {
    _id: "1",
    reservationType: "restaurant",
    customerEmail: "testmail@mail.com",
    customerName: `${"Wisdom"} ${"Ofogba"}`.trim() || "testmail@mail.com",
    date: new Date(),
    time: "13:00",
    guests: 3,
    seatingPreference: "Outside",
    specialOccasion: "",
    specialRequest: "One guest is allergic to garlic. Please consider this",
    additionalNote: "",
    meals: MenusData.map((item) => ({
      id: item._id,
      name: item.dishName,
      description: item.description,
      price: item.price || 0,
      quantity: item.quantity || 1,
      specialRequest: item.specialRequest || "",
      category: item.category,
    })),
    totalPrice: 2000,
    vendorId: RestaurantData.data[0]._id,
    businessName: RestaurantData.data[0].businessName,
    location: RestaurantData.data[0].address,
    image: RestaurantData.data[0].profileImages?.[0]?.url,
  },
];

// clubs

export const ClubsData = {
  data: [
    {
      _id: "1",
      businessName: "The Gourmet Kitchen",
      address: "123 Culinary St, Foodie City, FC 45678",
      phone: "+1 (555) 123-4567",
      email: "info@gourmetkitchen.com",
      specials: "DJ Tune Live Tonight",
      profileImages: [
        {
          url: ClubImage1,
        },
        {
          url: ClubImage2,
        },
        {
          url: ClubImage3,
        },
        {
          url: ClubImage4,
        },
        {
          url: ClubImage5,
        },
      ],
      rating: 4.8,
      reviews: 256,
      openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
      priceRange: 50000,
      ageLimit: 18,
      menu: [
        {
          name: "Bruschetta",
          description:
            "Grilled bread topped with fresh tomatoes, basil, and olive oil.",
        },
      ],
      openingTime: "11:00 AM",
      closingTime: "10:00 PM",
      dressCode: ["Italian", "French", "Contemporary"],
      businessDescription: "A club with prestige experience",
      slots: 30,
    },
  ],
};

export const Combos = [
  {
    _id: "1",
    image: ClubImage5,
    title: "Big Ballers Set",
    price: 280000,
    offers: ["1x something", "1x something", "3x something", "2x something"],
    specials: "Most Popular",
  },
];

export const Bottles = [
  {
    _id: "1",
    image: ClubImage5,
    category: "Champagne",
    title: "Moet & Chandon",
    description: "Brut Imperial",
    price: 280000,
    specials: "Most Ordered",
  },
];

export const VIP = [
  {
    _id: "1",
    title: "DJ Shoutout",
    description: "Get a personalized shoutout from our DJ",
    price: 20000,
  },
  {
    _id: "2",
    title: "Sparkler Performance",
    description: "Make a grand entrance with sparklers",
    price: 20000,
  },
];

export const HotelData = {
  data: [
    {
      _id: "1",
      businessName: "The Gourmet Kitchen",
      address: "123 Culinary St, Foodie City, FC 45678",
      phone: "+1 (555) 123-4567",
      email: "info@gourmetkitchen.com",
      specials: "DJ Tune Live Tonight",
      profileImages: [
        {
          url: ClubImage1,
        },
        {
          url: ClubImage2,
        },
        {
          url: ClubImage3,
        },
        {
          url: ClubImage4,
        },
        {
          url: ClubImage5,
        },
      ],
      rating: 4.8,
      reviews: 256,
      openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
      priceRange: 50000,
      ageLimit: 18,
      menu: [
        {
          name: "Bruschetta",
          description:
            "Grilled bread topped with fresh tomatoes, basil, and olive oil.",
        },
      ],
      openingTime: "11:00 AM",
      closingTime: "10:00 PM",
      dressCode: ["Italian", "French", "Contemporary"],
      businessDescription: "A club with prestige experience",
      slots: 30,
    },
  ],
};

export const RoomsData = [
    {
      id: 1,
      name: 'Superior Single Room',
      description: 'Super comfortable room with single bed and a top view',
      images: ['/api/placeholder/300/200'],
      amenities: {
        wifi: true,
        adults: 2,
        bedType: '2 Twin Bed',
        breakfast: true,
        parking: true,
        cityView: true
      },
      discount: 10,
      originalPrice: 160000,
      discountedPrice: 150000,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    {
      id: 2,
      name: 'Superior Double Room',
      description: 'Super comfortable room with single bed and a top view',
      images: ['/api/placeholder/300/200'],
      amenities: {
        wifi: true,
        adults: 2,
        bedType: '2 Twin Bed',
        breakfast: true,
        parking: true,
        cityView: true
      },
      discount: 10,
      originalPrice: 160000,
      discountedPrice: 150000,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    {
      id: 3,
      name: 'Superior Twin Bed Room',
      description: 'Super comfortable room with single bed and a top view',
      images: ['/api/placeholder/300/200'],
      amenities: {
        wifi: true,
        adults: 2,
        bedType: '2 Twin Bed',
        breakfast: true,
        parking: true,
        cityView: true
      },
      discount: 10,
      originalPrice: 160000,
      discountedPrice: 150000,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    {
      id: 4,
      name: 'Superior Deluxe Room',
      description: 'Super comfortable room with single bed and a top view',
      images: ['/api/placeholder/300/200'],
      amenities: {
        wifi: true,
        adults: 2,
        bedType: '2 Twin Bed',
        breakfast: true,
        parking: true,
        cityView: true
      },
      discount: 10,
      originalPrice: 160000,
      discountedPrice: 150000,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    {
      id: 5,
      name: 'Superior Executive Room',
      description: 'Super comfortable room with single bed and a top view',
      images: ['/api/placeholder/300/200'],
      amenities: {
        wifi: true,
        adults: 2,
        bedType: '2 Twin Bed',
        breakfast: true,
        parking: true,
        cityView: true
      },
      discount: 10,
      originalPrice: 160000,
      discountedPrice: 150000,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    {
      id: 6,
      name: 'Superior Suite Room',
      description: 'Super comfortable room with single bed and a top view',
      images: ['/api/placeholder/300/200'],
      amenities: {
        wifi: true,
        adults: 2,
        bedType: '2 Twin Bed',
        breakfast: true,
        parking: true,
        cityView: true
      },
      discount: 10,
      originalPrice: 160000,
      discountedPrice: 150000,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    {
      id: 7,
      name: 'Superior Presidential Room',
      description: 'Super comfortable room with single bed and a top view',
      images: ['/api/placeholder/300/200'],
      amenities: {
        wifi: true,
        adults: 2,
        bedType: '2 Twin Bed',
        breakfast: true,
        parking: true,
        cityView: true
      },
      discount: 10,
      originalPrice: 160000,
      discountedPrice: 150000,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    }
  ];