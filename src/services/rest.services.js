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
