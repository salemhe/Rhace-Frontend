
import Header from "@/components/user/Header";
import { Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
// Dummy Data
const restaurantsData = [
  {
    _id: 'r1',
    businessName: 'The Golden Spoon',
    profileImages: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
    rating: 4.8,
    reviewCount: '245 reviews',
    services: ['Fine Dining', 'Italian Cuisine', 'Wine Bar'],
    address: '123 Main Street, Downtown',
    isFavorite: true
  },
  {
    _id: 'r2',
    businessName: 'Sushi Paradise',
    profileImages: ['https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800'],
    rating: 4.6,
    reviewCount: '189 reviews',
    services: ['Japanese', 'Sushi Bar', 'Asian Fusion'],
    address: '456 Ocean Ave, Waterfront',
    isFavorite: true
  },
  {
    _id: 'r3',
    businessName: 'Burger Haven',
    profileImages: ['https://images.unsplash.com/photo-1550547660-d9450f859349?w=800'],
    rating: 4.5,
    reviewCount: '312 reviews',
    services: ['American', 'Burgers', 'Casual Dining'],
    address: '789 Park Lane, Central District',
    isFavorite: true
  },
  {
    _id: 'r4',
    businessName: 'Spice Route',
    profileImages: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800'],
    rating: 4.7,
    reviewCount: '198 reviews',
    services: ['Indian', 'Vegetarian Options', 'Takeaway'],
    address: '321 Curry Street, Little India',
    isFavorite: true
  },
  {
    _id: 'r5',
    businessName: 'La Petite Bistro',
    profileImages: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'],
    rating: 4.9,
    reviewCount: '267 reviews',
    services: ['French Cuisine', 'Brunch', 'Romantic Setting'],
    address: '555 Boulevard St, Arts Quarter',
    isFavorite: true
  },
  {
    _id: 'r6',
    businessName: 'Taco Fiesta',
    profileImages: ['https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800'],
    rating: 4.4,
    reviewCount: '421 reviews',
    services: ['Mexican', 'Tacos', 'Margaritas'],
    address: '888 Fiesta Road, South Side',
    isFavorite: true
  }
];

const clubsData = [
  {
    _id: 'c1',
    businessName: 'Velvet Lounge',
    profileImages: ['https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800'],
    rating: 4.5,
    reviewCount: '178 reviews',
    services: ['Nightclub', 'Live DJ', 'VIP Tables'],
    address: '100 Night Street, Entertainment District',
    isFavorite: true
  },
  {
    _id: 'c2',
    businessName: 'Pulse Nightclub',
    profileImages: ['https://images.unsplash.com/photo-1571266028243-d220c98a7313?w=800'],
    rating: 4.6,
    reviewCount: '294 reviews',
    services: ['EDM Music', 'Late Night', 'Dance Floor'],
    address: '234 Beat Avenue, Party Zone',
    isFavorite: true
  },
  {
    _id: 'c3',
    businessName: 'Jazz & teals Bar',
    profileImages: ['https://images.unsplash.com/photo-1598387846786-a41de1034d39?w=800'],
    rating: 4.8,
    reviewCount: '156 reviews',
    services: ['Live Music', 'Cocktail Bar', 'Intimate Setting'],
    address: '567 Melody Lane, Old Town',
    isFavorite: true
  },
  {
    _id: 'c4',
    businessName: 'Skyline Rooftop',
    profileImages: ['https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800'],
    rating: 4.7,
    reviewCount: '312 reviews',
    services: ['Rooftop Bar', 'Cocktails', 'City Views'],
    address: '999 High Street, 25th Floor',
    isFavorite: true
  },
  {
    _id: 'c5',
    businessName: 'Underground Club',
    profileImages: ['https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800'],
    rating: 4.4,
    reviewCount: '223 reviews',
    services: ['Techno', 'House Music', 'Late Hours'],
    address: '777 Bass Road, Warehouse District',
    isFavorite: true
  },
  {
    _id: 'c6',
    businessName: 'The Social Club',
    profileImages: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'],
    rating: 4.6,
    reviewCount: '189 reviews',
    services: ['Members Club', 'Networking', 'Premium Bar'],
    address: '444 Elite Boulevard, Business District',
    isFavorite: true
  }
];

const hotelsData = [
  {
    _id: 'h1',
    businessName: 'Grand Palace Hotel',
    profileImages: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    rating: 4.9,
    reviewCount: '542 reviews',
    services: ['5-Star', 'Spa', 'Fine Dining', 'Pool'],
    address: '1 Royal Drive, City Center',
    isFavorite: true
  },
  {
    _id: 'h2',
    businessName: 'Seaside Resort',
    profileImages: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
    rating: 4.7,
    reviewCount: '389 reviews',
    services: ['Beach Access', 'Water Sports', 'All-Inclusive'],
    address: '50 Ocean View Road, Coastal Area',
    isFavorite: true
  },
  {
    _id: 'h3',
    businessName: 'Mountain Lodge',
    profileImages: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    rating: 4.8,
    reviewCount: '267 reviews',
    services: ['Ski Resort', 'Fireplace Rooms', 'Mountain Views'],
    address: '2000 Alpine Way, Mountain Range',
    isFavorite: true
  },
  {
    _id: 'h4',
    businessName: 'Urban Boutique Inn',
    profileImages: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    rating: 4.6,
    reviewCount: '198 reviews',
    services: ['Boutique', 'Modern Design', 'City Center'],
    address: '300 Metro Street, Downtown',
    isFavorite: true
  },
  {
    _id: 'h5',
    businessName: 'Garden Suites Hotel',
    profileImages: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    rating: 4.5,
    reviewCount: '421 reviews',
    services: ['Garden Views', 'Family Friendly', 'Restaurant'],
    address: '150 Green Park Avenue, Suburbs',
    isFavorite: true
  },
  {
    _id: 'h6',
    businessName: 'Luxury Towers',
    profileImages: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    rating: 4.9,
    reviewCount: '678 reviews',
    services: ['Penthouse Suites', 'Concierge', 'Business Center'],
    address: '888 Executive Plaza, Financial District',
    isFavorite: true
  }
];

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const navigate = useNavigate();

  const getCurrentData = () => {
    switch(activeTab) {
      case 'restaurants':
        return restaurantsData;
      case 'clubs':
        return clubsData;
      case 'hotels':
        return hotelsData;
      default:
        return restaurantsData;
    }
  };

  const venues = getCurrentData();
  const handleClick = (venueId: string) => {
  const basePath =
    activeTab === "restaurants"
      ? "/restaurants"
      : activeTab === "clubs"
      ? "/clubs"
      : "/hotels";

  navigate(`${basePath}/${venueId}`);
};
   return(
 <div className="min-h-screen ">

         <Header />

         
          <div className=" mt-24 mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'restaurants'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Restaurants
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                  {restaurantsData.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('clubs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'clubs'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Clubs
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                  {clubsData.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'hotels'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hotels
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                  {hotelsData.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

{venues.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <img
      src="https://illustrations.popsy.co/white/hobby.svg"
      alt="No favorites illustration"
      className="w-48 h-48 opacity-80"
    />
    <h2 className="text-xl font-semibold text-gray-700 mt-6">
      No favorites yet
    </h2>
    <p className="text-gray-500 mt-2 max-w-sm">
      When you add restaurants, clubs, or hotels to your favorites, they’ll appear here.
    </p>
  </div>
) : (
   <>
    {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {venues.map((venue) => (
            <div
              key={venue._id}
              onClick={() => handleClick(venue._id)}
              className="bg-white rounded-lg p-1  shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative  overflow-hidden  rounded-md">
                <img
                  src={venue.profileImages[0]}
                  alt={venue.businessName}
                  className="w-full h-48 object-cover hover:scale-105 rounded-md transition-transform transition-all size-full object-cover duration-300 ease-out 
                  "
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex flex-col mb-2">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {venue.businessName}
                  </h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm font-medium">
                      {venue.rating}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({venue.reviewCount})
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {venue.services.join(' • ')}
                </p>
                <div className="flex items-start text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{venue.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
   </>
)}
      </div>
    </div>
  );
}


export default Favorites;