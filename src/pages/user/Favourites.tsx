import React, { useState, useCallback, useEffect } from 'react';
import { Heart, MapPin, Star, ChevronRight } from 'lucide-react';
import Header from '@/components/user/Header';
import { FiStar } from 'react-icons/fi';
import Footer from '@/components/Footer';

// Enhanced dummy data with multiple images
const restaurantsData = [
  {
    _id: 'r1',
    businessName: 'The Golden Spoon',
    profileImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'
    ],
    rating: 4.8,
    reviewCount: '245 reviews',
    services: ['Fine Dining', 'Italian Cuisine', 'Wine Bar'],
    address: '123 Main Street, Downtown',
    isFavorite: true
  },
  {
    _id: 'r2',
    businessName: 'Sushi Paradise',
    profileImages: [
      'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800',
      'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800'
    ],
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
    profileImages: [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800'
    ],
    rating: 4.7,
    reviewCount: '198 reviews',
    services: ['Indian', 'Vegetarian Options', 'Takeaway'],
    address: '321 Curry Street, Little India',
    isFavorite: true
  },
  {
    _id: 'r5',
    businessName: 'La Petite Bistro',
    profileImages: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800'
    ],
    rating: 4.9,
    reviewCount: '267 reviews',
    services: ['French Cuisine', 'Brunch', 'Romantic Setting'],
    address: '555 Boulevard St, Arts Quarter',
    isFavorite: true
  },
  {
    _id: 'r6',
    businessName: 'Taco Fiesta',
    profileImages: [
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800',
      'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800',
      'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800'
    ],
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
    profileImages: [
      'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      'https://images.unsplash.com/photo-1571266028243-d220c98a7313?w=800'
    ],
    rating: 4.5,
    reviewCount: '178 reviews',
    services: ['Nightclub', 'Live DJ', 'VIP Tables'],
    address: '100 Night Street, Entertainment District',
    isFavorite: true
  },
  {
    _id: 'c2',
    businessName: 'Pulse Nightclub',
    profileImages: [
      'https://images.unsplash.com/photo-1571266028243-d220c98a7313?w=800',
      'https://images.unsplash.com/photo-1598387846786-a41de1034d39?w=800'
    ],
    rating: 4.6,
    reviewCount: '294 reviews',
    services: ['EDM Music', 'Late Night', 'Dance Floor'],
    address: '234 Beat Avenue, Party Zone',
    isFavorite: true
  }
];

const hotelsData = [
  {
    _id: 'h1',
    businessName: 'Grand Palace Hotel',
    profileImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
    ],
    rating: 4.9,
    reviewCount: '542 reviews',
    services: ['5-Star', 'Spa', 'Fine Dining', 'Pool'],
    address: '1 Royal Drive, City Center',
    isFavorite: true
  },
  {
    _id: 'h2',
    businessName: 'Seaside Resort',
    profileImages: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    ],
    rating: 4.7,
    reviewCount: '389 reviews',
    services: ['Beach Access', 'Water Sports', 'All-Inclusive'],
    address: '50 Ocean View Road, Coastal Area',
    isFavorite: true
  }
];

const Favorites: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'clubs' | 'hotels'>('restaurants');
  const [currentIndices, setCurrentIndices] = useState<Record<string, number>>({});
  const [resetTimeouts, setResetTimeouts] = useState<Record<string, number>>({});
  const [isHovering, setIsHovering] = useState<Record<string, boolean>>({});

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

  const hasMultipleImages = useCallback((venue) => {
    return venue.profileImages && venue.profileImages.length > 1;
  }, []);

  const handleMouseEnter = (venueId) => {
    const venue = venues.find(v => v._id === venueId);
    if (!venue || !hasMultipleImages(venue)) return;

    setIsHovering(prev => ({ ...prev, [venueId]: true }));

    if (resetTimeouts[venueId]) {
      clearTimeout(resetTimeouts[venueId]);
      setResetTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[venueId];
        return newTimeouts;
      });
    }
  };

  const handleMouseMove = useCallback((e, venueId) => {
    const venue = venues.find(v => v._id === venueId);
    if (!venue || !hasMultipleImages(venue)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const xPercent = (x / rect.width) * 100;
    const images = venue.profileImages;
    const imageIndex = Math.min(
      Math.max(Math.floor(xPercent / (100 / images.length)), 0),
      images.length - 1
    );

    setCurrentIndices(prev => ({
      ...prev,
      [venueId]: imageIndex
    }));
  }, [venues, hasMultipleImages]);

  const handleMouseLeave = useCallback((venueId) => {
    const venue = venues.find(v => v._id === venueId);
    if (!venue || !hasMultipleImages(venue)) return;

    setIsHovering(prev => ({ ...prev, [venueId]: false }));

    const timeout = setTimeout(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [venueId]: 0
      }));
    }, 300);

    setResetTimeouts(prev => ({
      ...prev,
      [venueId]: timeout
    }));
  }, [venues, hasMultipleImages]);

  useEffect(() => {
    return () => {
      Object.values(resetTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [resetTimeouts]);

  const handleClick = (venueId) => {
    const basePath =
      activeTab === "restaurants"
        ? "/restaurants"
        : activeTab === "clubs"
        ? "/clubs"
        : "/hotels";
    console.log(`Navigate to: ${basePath}/${venueId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     <Header/>

      <div className="mt-24  mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-20 h-20 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mt-6">
              No favorites yet
            </h2>
            <p className="text-gray-500 mt-2 max-w-sm">
              When you add restaurants, clubs, or hotels to your favorites, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {venues.map((venue) => {
              const currentIndex = currentIndices[venue._id] || 0;
              const multipleImages = hasMultipleImages(venue);
              const hovering = isHovering[venue._id] || false;
              const images = venue.profileImages || [];

              return (
                <div
                  key={venue._id}
                  onClick={() => handleClick(venue._id)}
                  className="h-80 px-2 pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container with Carousel */}
                  <div
                    className="relative h-48 w-full"
                    onMouseEnter={() => handleMouseEnter(venue._id)}
                    onMouseMove={
                      multipleImages ? (e) => handleMouseMove(e, venue._id) : undefined
                    }
                    onMouseLeave={() => handleMouseLeave(venue._id)}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-xl">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${venue.businessName} - Image ${index + 1}`}
                          className={`absolute w-full h-full object-cover transition-all duration-300 ease-out ${
                            multipleImages
                              ? `will-change-transform ${hovering ? "brightness-105" : ""}`
                              : "hover:scale-105"
                          }`}
                          style={
                            multipleImages
                              ? {
                                  transform: `translateX(${(index - currentIndex) * 100}%)`,
                                  transition: hovering
                                    ? "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease"
                                    : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease",
                                }
                              : {
                                  transition: "transform 0.3s ease, brightness 0.3s ease",
                                }
                          }
                        />
                      ))}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Heart Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Toggle favorite:', venue._id);
                      }}
                      className="absolute top-2 right-2 text-white cursor-pointer text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </button>

                    {/* Progress Dots */}
                    {multipleImages && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                        {images.map((_, index) => (
                          <span
                            key={index}
                            className={`block rounded-full transition-all duration-300 ease-out ${
                              index === currentIndex
                                ? "bg-white scale-125 w-6 h-2 shadow-md"
                                : "bg-white/70 w-2 h-2 hover:bg-white/90"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {venue.businessName}
                      </h3>
                      <div className="flex items-center mb-2">
                        <FiStar className="w-4 h-4 text-yellow-500  mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {venue.rating}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({venue.reviewCount})
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {venue.services.join(' • ')}
                      </p>
                      <div className="flex items-start text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{venue.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Favorites;