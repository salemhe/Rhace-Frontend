import { useState } from 'react';
import { ConciergeBell, BedSingle, Speaker } from 'lucide-react';
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

          <div className='bg-[#F9FAFB] p-4 max-w-5xl w-full rounded-full mx-auto mt-8 border-2 border-[#E5E7EB] shadow-md'>

          </div>
        </div>
      </section>
    </div>
  );
}

export default ReservationHomePage;