export const restaurantService = {
  async search({ query, location, cuisine }) {
    // Simulated API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data
    const mockData = [
      { id: 1, name: "Lagos Bistro", location: "Lekki, Lagos", image: "/rest1.jpg", rating: 4.7 },
      { id: 2, name: "ChopLife Grill", location: "Ikeja, Lagos", image: "/rest2.jpg", rating: 4.5 },
      { id: 3, name: "Spice Route", location: "Victoria Island", image: "/rest3.jpg", rating: 4.8 },
    ];

    const filtered = mockData.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );

    return { data: filtered };
  },
};


// Dummy data for drinks table
export const dummyDrinks = [
  {
    id: 1,
    name: "Hennessy VS",
    category: "Cognac",
    volume: "750ml",
    price: 45000,
    quantity: 24,
    status: "Active",
    image_url: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Moët & Chandon",
    category: "Champagne",
    volume: "750ml",
    price: 65000,
    quantity: 18,
    status: "Active",
    image_url: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-14T14:20:00Z"
  },
  {
    id: 3,
    name: "Jack Daniel's",
    category: "Whiskey",
    volume: "1L",
    price: 28000,
    quantity: 32,
    status: "Active",
    image_url: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-13T09:15:00Z"
  },
  {
    id: 4,
    name: "Grey Goose Vodka",
    category: "Vodka",
    volume: "750ml",
    price: 38000,
    quantity: 15,
    status: "Active",
    image_url: "https://images.pexels.com/photos/5946072/pexels-photo-5946072.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-12T16:45:00Z"
  },
  {
    id: 5,
    name: "Baileys Irish Cream",
    category: "Liqueur",
    volume: "700ml",
    price: 18500,
    quantity: 28,
    status: "Active",
    image_url: "https://images.pexels.com/photos/2647933/pexels-photo-2647933.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-11T11:30:00Z"
  },
  {
    id: 6,
    name: "Johnnie Walker Black Label",
    category: "Whiskey",
    volume: "750ml",
    price: 32000,
    quantity: 8,
    status: "Low Stock",
    image_url: "https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-10T13:20:00Z"
  },
  {
    id: 7,
    name: "Bacardi Rum",
    category: "Rum",
    volume: "1L",
    price: 15000,
    quantity: 45,
    status: "Active",
    image_url: "https://images.pexels.com/photos/6937817/pexels-photo-6937817.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-09T08:10:00Z"
  },
  {
    id: 8,
    name: "Chivas Regal 12",
    category: "Whiskey",
    volume: "750ml",
    price: 42000,
    quantity: 20,
    status: "Active",
    image_url: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-08T15:40:00Z"
  },
  {
    id: 9,
    name: "Bombay Sapphire Gin",
    category: "Gin",
    volume: "750ml",
    price: 25000,
    quantity: 22,
    status: "Active",
    image_url: "https://images.pexels.com/photos/5947015/pexels-photo-5947015.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-07T12:25:00Z"
  },
  {
    id: 10,
    name: "Don Julio Tequila",
    category: "Tequila",
    volume: "750ml",
    price: 55000,
    quantity: 12,
    status: "Active",
    image_url: "https://images.pexels.com/photos/5946924/pexels-photo-5946924.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-06T10:50:00Z"
  },
  {
    id: 11,
    name: "Martell VSOP",
    category: "Cognac",
    volume: "750ml",
    price: 48000,
    quantity: 16,
    status: "Active",
    image_url: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-05T14:15:00Z"
  },
  {
    id: 12,
    name: "Absolut Vodka",
    category: "Vodka",
    volume: "1L",
    price: 22000,
    quantity: 35,
    status: "Active",
    image_url: "https://images.pexels.com/photos/5946072/pexels-photo-5946072.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-04T09:30:00Z"
  },
  {
    id: 13,
    name: "Rémy Martin VSOP",
    category: "Cognac",
    volume: "750ml",
    price: 52000,
    quantity: 10,
    status: "Active",
    image_url: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-03T11:45:00Z"
  },
  {
    id: 14,
    name: "Captain Morgan Spiced Rum",
    category: "Rum",
    volume: "750ml",
    price: 18000,
    quantity: 30,
    status: "Active",
    image_url: "https://images.pexels.com/photos/6937817/pexels-photo-6937817.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-02T16:20:00Z"
  },
  {
    id: 15,
    name: "Glenfiddich 12",
    category: "Whiskey",
    volume: "750ml",
    price: 38000,
    quantity: 14,
    status: "Active",
    image_url: "https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-10-01T13:10:00Z"
  },
  {
    id: 16,
    name: "Tanqueray Gin",
    category: "Gin",
    volume: "750ml",
    price: 23000,
    quantity: 0,
    status: "Out of Stock",
    image_url: "https://images.pexels.com/photos/5947015/pexels-photo-5947015.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-09-30T10:35:00Z"
  },
  {
    id: 17,
    name: "Patrón Silver Tequila",
    category: "Tequila",
    volume: "750ml",
    price: 62000,
    quantity: 9,
    status: "Active",
    image_url: "https://images.pexels.com/photos/5946924/pexels-photo-5946924.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-09-29T15:50:00Z"
  },
  {
    id: 18,
    name: "Amarula Cream",
    category: "Liqueur",
    volume: "750ml",
    price: 16500,
    quantity: 25,
    status: "Active",
    image_url: "https://images.pexels.com/photos/2647933/pexels-photo-2647933.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-09-28T12:40:00Z"
  },
  {
    id: 19,
    name: "Jameson Irish Whiskey",
    category: "Whiskey",
    volume: "1L",
    price: 26000,
    quantity: 38,
    status: "Active",
    image_url: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-09-27T09:25:00Z"
  },
  {
    id: 20,
    name: "Veuve Clicquot",
    category: "Champagne",
    volume: "750ml",
    price: 72000,
    quantity: 11,
    status: "Active",
    image_url: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-09-26T14:55:00Z"
  }
];

export default dummyDrinks;