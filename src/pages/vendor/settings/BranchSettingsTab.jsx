import { Building2, ChevronDown, Clock } from "lucide-react";
import { InputField, SectionCard, SelectField, TimeInput, ToggleSwitch } from "./part/settingsComp";

// Branch Configuration Header Component
export const BranchConfigHeader = ({ selectedBranch, setSelectedBranch, branchEnabled, setBranchEnabled }) => (
  <SectionCard title="Branch Configuration">
    <p className="text-sm text-gray-600 mb-6">Configure specific settings to each branch</p>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-6 h-6 text-gray-600" />
        </div>
        <div className="relative flex-1 max-w-md">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option>Restaurant 1 - Headquarter</option>
            <option>Restaurant 2 - Downtown</option>
            <option>Restaurant 3 - Mall</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Branch Status</p>
          <p className="text-xs text-gray-600">Enable or disable booking for this branch</p>
        </div>
        <ToggleSwitch
          enabled={branchEnabled}
          onToggle={() => setBranchEnabled(!branchEnabled)}
        />
      </div>
    </div>

    {branchEnabled && (
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          This branch has 12 active bookings for the upcoming week. Disabling bookings will not affect existing reservations.
        </p>
      </div>
    )}
  </SectionCard>
);


const OpeningHoursRow = ({ day, hours, onUpdateTime, onToggle }) => (
  <div className="flex items-center gap-4">
    <div className="w-24 text-sm text-gray-700">{day}</div>
    
    <div className="flex items-center gap-2 flex-1">
      <TimeInput
        value={hours.start}
        onChange={(e) => onUpdateTime(day, 'start', e.target.value)}
        disabled={!hours.enabled}
      />
      
      <span className="text-gray-500">to</span>
      
      <TimeInput
        value={hours.end}
        onChange={(e) => onUpdateTime(day, 'end', e.target.value)}
        disabled={!hours.enabled}
      />
    </div>

    <ToggleSwitch
      enabled={hours.enabled}
      onToggle={() => onToggle(day)}
    />
  </div>
);

// Opening Hours Component
export const OpeningHours = ({ openingHours, updateTime, toggleDayEnabled }) => (
  <SectionCard title="Opening Hours">
    <div className="space-y-3">
      {Object.keys(openingHours).map(day => (
        <OpeningHoursRow
          key={day}
          day={day}
          hours={openingHours[day]}
          onUpdateTime={updateTime}
          onToggle={toggleDayEnabled}
        />
      ))}
    </div>
  </SectionCard>
);


// Reservation Preferences Component
export const ReservationPreferences = ({
  minGuests,
  setMinGuests,
  maxGuests,
  setMaxGuests,
  defaultDuration,
  setDefaultDuration,
  defaultCapacity,
  setDefaultCapacity,
  leadTime,
  setLeadTime,
  cutoffTime,
  setCutoffTime
}) => (
  <SectionCard title="Reservation Preferences">
    <div className="grid grid-cols-2 gap-6">
      <InputField
        label="Minimum Guests Per Booking"
        type="number"
        value={minGuests}
        onChange={(e) => setMinGuests(parseInt(e.target.value))}
        min="1"
      />

      <InputField
        label="Maximum Guests Per Booking"
        type="number"
        value={maxGuests}
        onChange={(e) => setMaxGuests(parseInt(e.target.value))}
        min="1"
      />

      <SelectField
        label="Default Reservation Duration"
        value={defaultDuration}
        onChange={(e) => setDefaultDuration(e.target.value)}
        options={['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours']}
      />

      <InputField
        label="Default Capacity"
        type="number"
        value={defaultCapacity}
        onChange={(e) => setDefaultCapacity(parseInt(e.target.value))}
        min="1"
        helpText="Maximum number of guests at one time"
      />

      <SelectField
        label="Lead Time For Reservation"
        value={leadTime}
        onChange={(e) => setLeadTime(e.target.value)}
        options={['30 minutes before', '1 hour before', '2 hours before', '4 hours before', '1 day before']}
        helpText="Minimum time before a reservation can be made"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cut-off Time for Same-day Bookings
        </label>
        <div className="relative">
          <input
            type="time"
            value={cutoffTime}
            onChange={(e) => setCutoffTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-500 mt-1">After this time, same-day bookings will not be accepted</p>
      </div>
    </div>
  </SectionCard>
);