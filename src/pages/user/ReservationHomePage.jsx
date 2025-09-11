import { useState } from 'react';
import { ConciergeBell, BedSingle, Speaker, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import Restaurant from "../../assets/RestaurantBackground.jpg";

function ReservationHomePage() {
  const [activeButton, setActiveButton] = useState('restaurant');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeInput, setActiveInput] = useState(null); // Track active input

  const availableTimes = [
    '9:00 PM', '10:00 PM', '11:00 PM', '1:00 PM', '2:00 PM',
    '4:00 PM', '6:00 PM', '7:00 PM', '9:00 PM',
  ];

  const getButtonClass = (buttonType) => {
    return buttonType === activeButton
      ? 'bg-[#F9FAFB] rounded-full px-4 py-2 flex gap-2 text-black'
      : 'text-[#F9FAFB] flex gap-2 px-4 py-2';
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(newDate);
      setShowDatePicker(false);
      setActiveInput(null); // Clear active input after selection
    }
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return 'Pick date';
    return selectedDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatSelectedTime = () => {
    if (!selectedTime) return 'Pick time';
    return selectedTime;
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimePicker(false);
    setActiveInput(null); // Clear active input after selection
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Handle Restaurant/Cuisine input focus
  const handleRestaurantFocus = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setActiveInput('restaurant');
  };

  // Handle Restaurant/Cuisine input blur
  const handleRestaurantBlur = () => {
    setActiveInput(null);
  };

  // Handle Date picker toggle
  const toggleDatePicker = () => {
    setShowTimePicker(false); // Close time picker if open
    setShowDatePicker(prev => !prev); // Toggle date picker
    setActiveInput(prev => (prev === 'date' ? null : 'date')); // Toggle active input
  };

  // Handle Time picker toggle
  const toggleTimePicker = () => {
    setShowDatePicker(false); // Close date picker if open
    setShowTimePicker(prev => !prev); // Toggle time picker
    setActiveInput(prev => (prev === 'time' ? null : 'time')); // Toggle active input
  };

  // Handle Guest dropdown focus
  const handleGuestFocus = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setActiveInput('guest');
  };

  // Handle Guest dropdown blur
  const handleGuestBlur = () => {
    setActiveInput(null);
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

          <div className='bg-[#F9FAFB] px-5 py-3 max-w-5xl w-full rounded-full mx-auto mt-8 border-2 border-[#E5E7EB] shadow-md relative'>
            <div className='flex items-center justify-between gap-4'>
              {/* Restaurant/Cuisine Input */}
              <div className='flex-1'>
                <h1 className='text-xs text-[#111827]'>Restaurant/Cuisine</h1>
                <input
                  type="text"
                  placeholder="Enter Restaurant or Cuisine"
                  className='w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-sm'
                  onFocus={handleRestaurantFocus}
                  onBlur={handleRestaurantBlur}
                />
              </div>
              
              {/* Vertical Divider */}
              <div className='h-8 w-px bg-gray-300'></div>
              
              {/* Date Picker */}
              <div className='flex-1 relative'>
                <h1 className='text-xs text-[#111827]'>Date</h1>
                <button 
                  className='w-full bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer text-left flex justify-between items-center'
                  onClick={toggleDatePicker}
                >
                  {formatSelectedDate()}

                    <ChevronDown size={15} />
                </button>
                
                {/* Date Picker Calendar */}
                {showDatePicker && (
                  <div className='absolute top-full left-[-16px] mt-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80'>
                    {/* Month Header */}
                    <div className='flex items-center justify-between mb-4'>
                      <button 
                        onClick={() => navigateMonth(-1)}
                        className='p-1 hover:bg-gray-100 rounded'
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <h3 className='font-medium text-gray-900'>
                        {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                      <button 
                        onClick={() => navigateMonth(1)}
                        className='p-1 hover:bg-gray-100 rounded'
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    
                    {/* Days of Week Header */}
                    <div className='grid grid-cols-7 gap-1 mb-2'>
                      {daysOfWeek.map(day => (
                        <div key={day} className='text-xs text-gray-500 text-center py-2'>
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className='grid grid-cols-7 gap-1'>
                      {getDaysInMonth(currentMonth).map((day, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(day)}
                          disabled={!day}
                          className={`
                            h-8 w-8 text-sm rounded hover:bg-gray-100 transition-colors
                            ${!day ? 'cursor-not-allowed' : 'cursor-pointer'}
                            ${day === 18 ? 'bg-[#0A6C6D]/70 text-white hover:bg-[#0A6C6D]' : 'text-gray-700'}
                            ${selectedDate && day === selectedDate.getDate() && 
                              currentMonth.getMonth() === selectedDate.getMonth() && 
                              currentMonth.getFullYear() === selectedDate.getFullYear() 
                              ? 'bg-[#0A6C6D] text-white' : ''}
                          `}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Vertical Divider */}
              <div className='h-8 w-px bg-gray-300'></div>
              
              {/* Time Picker */}
              <div className='flex-1 relative'>
                <h1 className='text-xs text-[#111827]'>Time</h1>
                <button 
                  className='w-full bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer text-left flex justify-between items-center'
                  onClick={toggleTimePicker}
                >
                  {formatSelectedTime()}
                  <ChevronDown size={15} />
                </button>
                
                {/* Time Picker Dropdown */}
                {showTimePicker && (
                  <div className='absolute top-full left-[-16px] mt-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-72'>
                    <h3 className='font-medium text-gray-900 mb-3'>Available Times</h3>
                    
                    {/* Time Grid */}
                    <div className='grid grid-cols-3 gap-2 max-h-48 overflow-y-auto'>
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`
                            px-3 py-2 text-xs rounded-md border transition-colors text-center
                            ${selectedTime === time 
                              ? 'bg-[#0A6C6D] text-white border-[#0A6C6D]' 
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Vertical Divider */}
              <div className='h-8 w-px bg-gray-300'></div>
              
              {/* Guest Dropdown */}
              <div className='flex-1'>
                <h1 className='text-xs text-[#111827]'>Guest</h1>
                <select 
                  className='w-full bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer'
                  onFocus={handleGuestFocus}
                  onBlur={handleGuestBlur}
                >
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