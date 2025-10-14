import { ChevronDown, Clock, Edit2 } from "lucide-react";

// Toggle Switch Component
export const ToggleSwitch = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-teal-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Section Card Component
export const SectionCard = ({ title, onEdit, children }) => (
  <div className="bg-white w-full rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {onEdit && (
        <Edit2 
          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" 
          onClick={onEdit}
        />
      )}
    </div>
    {children}
  </div>
);

// Input Field Component
export const InputField = ({ label, value, onChange, type = "text", maxLength, helpText, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        maxLength={maxLength}
        {...props}
      />
      {maxLength && (
        <span className="absolute right-3 top-2 text-sm text-gray-400">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
    {helpText && (
      <p className="text-xs text-gray-500 mt-1">{helpText}</p>
    )}
  </div>
);

// Select Field Component
export const SelectField = ({ label, value, onChange, options, helpText }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
    {helpText && (
      <p className="text-xs text-gray-500 mt-1">{helpText}</p>
    )}
  </div>
);

// Time Input Component
export const TimeInput = ({ value, onChange, disabled }) => (
  <div className="relative">
    <input
      type="time"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
    />
    <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);


// Placeholder Tab Component
export const PlaceholderTab = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
   {Icon && <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);


// Tabs Navigation Component
export const TabsNavigation = ({ activeTab, setActiveTab, tabs }) => (
  <div className="bg-white mt-6 flex items-center justify-between">
    <div className="flex gap-1 px-6 overflow-x-auto">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center rounded-[4px] gap-2  p-2 text-sm font-medium whitespace-nowrap border-1  transition-colors ${
              activeTab === tab.id
                ? 'border-[#B3D1D2] bg-[#E7F0F0] text-[#111827]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
     <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Edit2 className="w-4 h-4" />
        Edit All
      </button>
  </div>
);

// Action Buttons Component
export const ActionButtons = ({ onReset, onSave }) => (
  <div className="flex items-center justify-end gap-4 mt-8">
    <button
      onClick={onReset}
      className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      Reset to Default
    </button>
    <button
      onClick={onSave}
      className="px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
    >
      Save Changes
    </button>
  </div>
);