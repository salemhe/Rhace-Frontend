import { useState } from 'react';
import { ConciergeBell, BedSingle, Speaker, Search } from 'lucide-react';
import Restaurant from "../../assets/RestaurantBackground.jpg";

function ReservationHomePage() {
  const [activeButton, setActiveButton] = useState('restaurant');

  const getButtonClass = (buttonType) => {
    return buttonType === activeButton
      ? 'bg-[#F9FAFB] rounded-full px-4 py-2 flex gap-2 text-black'
      : 'text-[#F9FAFB] flex gap-2 px-4 py-2';
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat max-h-[500px] h-[500px]"
      style={{
        backgroundImage: `linear-gradient(#20053299 0%, #20053299 60%), url(${Restaurant})`,
      }}
    >
      <section className="h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-[#F9FAFB] text-6xl font-medium mb-4">
              Find your Perfect Table
            </h1>
            <p className="text-[#F9FAFB]/80 text-2xl">
              Discover and reserve the best restaurants in your city
            </p>
          </div>

          <div className='mt-12 flex justify-between items-center max-w-sm w-full mx-auto'>
            <button 
              className={getButtonClass('restaurant')}
              onClick={() => setActiveButton('restaurant')}
            > 
              <ConciergeBell /> Restaurant
            </button>
            <button 
              className={getButtonClass('hotels')}
              onClick={() => setActiveButton('hotels')}
            > 
              <BedSingle /> Hotels
            </button>
            <button 
              className={getButtonClass('clubs')}
              onClick={() => setActiveButton('clubs')}
            > 
              <Speaker /> Clubs
            </button>
          </div>

          <div className='bg-[#F9FAFB] px-5 py-3 max-w-5xl w-full rounded-full mx-auto mt-8 border-2 border-[#E5E7EB] shadow-md'>
            <div className='flex items-center justify-between gap-4'>
              {/* Restaurant/Cuisine Input */}
              <div className='flex-1'>
                <h1 className='text-xs text-[#111827]'>Restaurant/Cuisine</h1>
                <input
                  type="text"
                  placeholder="Enter Restaurant or Cuisine"
                  className='w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-sm'
                />
              </div>
              
              {/* Vertical Divider */}
              <div className='h-8 w-px bg-gray-300'></div>
              
              {/* Date Dropdown */}
              <div className='flex-1'>
                 <h1 className='text-xs text-[#111827] ms-1'>Date</h1>
                <select className='w-full bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer'>
                  <option value="">Pick date</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this-weekend">This Weekend</option>
                </select>
              </div>
              
              {/* Vertical Divider */}
              <div className='h-8 w-px bg-gray-300'></div>
              
              {/* Time Dropdown */}
              <div className='flex-1'>
                 <h1 className='text-xs text-[#111827] ms-1'>Time</h1>
                <select className='w-full bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer'>
                  <option value="">Select Time</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                </select>
              </div>
              
              {/* Vertical Divider */}
              <div className='h-8 w-px bg-gray-300'></div>
              
              {/* Guest Dropdown */}
              <div className='flex-1'>
                 <h1 className='text-xs text-[#111827] ms-1'>Guest</h1>
                <select className='w-full bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer'>
                  <option value="">Select number</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
              
              {/* Search Button */}
              <button className='bg-[#0A6C6D] hover:bg-teal-700 text-white px-6 py-3 rounded-full transition-colors duration-200 flex items-center justify-center min-w-[100px]'>
                <Search className='me-2' />Search
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReservationHomePage;