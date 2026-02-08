// GuestDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiMinus, FiPlus } from 'react-icons/fi';

const GUEST_CONFIG = {
  adults:    { label: 'Adults',   subtitle: '18 years and above',    min: 1 },
  children:  { label: 'Children', subtitle: '18 years and under',    min: 1 },
  infants:   { label: 'Infant',   subtitle: 'Under the age of 2',     min: 0 },
};

export const GuestDropdown = ({ onChange }) => {
  const [show, setShow] = useState(false);
  const ref = useRef();

  const [counts, setCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target )) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const inc = (type) => {
    setCounts(c => {
      const next = { ...c, [type]: c[type] + 1 };
      onChange?.(next);
      return next;
    });
  };
  const dec = (type) => {
    setCounts(c => {
      const min = GUEST_CONFIG[type].min;
      const nextVal = Math.max(c[type] - 1, min);
      const next = { ...c, [type]: nextVal };
      onChange?.(next);
      return next;
    });
  };

  const totalGuests = counts.adults + counts.children + counts.infants;

  return (
    <div className="relative inline-block w-full" ref={ref}>
      {/* trigger */}
      <div
        className="w-full flex items-center justify-between  pt-1 bg-white  rounded-lg cursor-pointer"
        onClick={() => setShow(s => !s)}
      >
        <span className="text-sm text-gray-700">
          {totalGuests} {totalGuests > 1 ? 'Guests' : 'Guest'}
        </span>
        <FiChevronDown className="text-gray-500" />
      </div>

      {/* dropdown panel */}
      {show && (
        <div className="absolute left-0 right-0 z-50 w-72 mt-2 bg-white rounded-lg shadow-lg p-4">
          {(Object.keys(GUEST_CONFIG)).map(type => {
            const { label, subtitle, min } = GUEST_CONFIG[type];
            const val = counts[type];
            return (
              <div
                key={type}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex flex-col items-start">
                  <div className="font-medium text-gray-800">{label}</div>
                  <div className="text-xs text-gray-500">{subtitle}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => dec(type)}
                    disabled={val <= min}
                    className="p-1 border rounded-full disabled:opacity-40"
                  >
                    <FiMinus className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="outline-1 h-8 px-3 outline-offset-[-1px] outline-neutral-200 inline-flex items-center justify-center">
                  <span className=" text-center font-medium text-sm text-gray-700 ">
                    {val}
                  </span>
                  </div>
                  <button
                    onClick={() => inc(type)}
                    className="p-1 border rounded-full"
                  >
                    <FiPlus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};