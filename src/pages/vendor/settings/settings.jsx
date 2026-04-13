import React, { useState } from 'react';
import { ChevronDown, Mail, Phone, UploadCloud } from 'lucide-react';

/** --- CUSTOM ICONS FROM YOUR SET --- **/
const Edit = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <path fill="#606368" fillRule="evenodd" d="M11.44.488a1.667 1.667 0 0 0-2.357 0L.488 9.083A1.67 1.67 0 0 0 0 10.261v4.361c0 .464.378.842.842.842l13.328-.001a.833.833 0 0 0 0-1.667H7.56l7.416-7.416a1.667 1.667 0 0 0 0-2.356zM5.203 13.796l8.594-8.594-3.535-3.536-8.595 8.595v3.535z" clipRule="evenodd" />
  </svg>
);

const DashBoardIcon = () => (
  <svg width="18" height="17" fill="none" viewBox="0 0 18 17">
    <path fill="currentColor" d="M10.024 1.24a1.666 1.666 0 0 0-2.047 0L.99 6.673c-.626.49-.281 1.494.513 1.494h.83v6.666A1.667 1.667 0 0 0 4 16.5h3.334v-5a1.667 1.667 0 1 1 3.333 0v5H14a1.666 1.666 0 0 0 1.667-1.667V8.167h.83c.794 0 1.14-1.005.513-1.493z" />
  </svg>
);

const BranchesIcon = () => (
  <svg width="18" height="17" fill="none" viewBox="0 0 18 17">
    <path fill="currentColor" d="M1.5 14.833h.834V4.3a1.25 1.25 0 0 1 .855-1.186L9.855.893A1.25 1.25 0 0 1 11.5 2.078v12.755h.834V7.325a.416.416 0 0 1 .498-.408l1.83.366a1.25 1.25 0 0 1 1.005 1.225v6.325h.833a.833.833 0 0 1 0 1.667h-15a.834.834 0 0 1 0-1.667" />
  </svg>
);

const BookingsIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <path fill="currentColor" d="M15.5 8v5.833a1.666 1.666 0 0 1-1.667 1.667H2.167A1.667 1.667 0 0 1 .5 13.833V8zM11.333.5a.833.833 0 0 1 .834.833v.834h1.666A1.666 1.666 0 0 1 15.5 3.833v2.5H.5v-2.5a1.667 1.667 0 0 1 1.667-1.666h1.666v-.834a.833.833 0 0 1 1.667 0v.834h5v-.834A.833.833 0 0 1 11.333.5" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="15" fill="none" viewBox="0 0 20 15">
    <path fill="currentColor" d="M10 8a7.1 7.1 0 0 1 4.012 1.24c.986.687 1.821 1.708 1.821 2.807 0 .604-.257 1.104-.663 1.476-.382.35-.88.578-1.393.733-1.026.31-2.377.41-3.777.41s-2.75-.1-3.777-.41c-.513-.155-1.011-.383-1.394-.733a1.96 1.96 0 0 1-.662-1.475c0-1.099.835-2.12 1.82-2.808A7.1 7.1 0 0 1 10 8M10 .5a3.333 3.333 0 1 1 0 6.666A3.333 3.333 0 0 1 10 .5" />
  </svg>
);

const PaymentIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path fill="currentColor" d="M10 1.667a8.333 8.333 0 1 1 0 16.666 8.333 8.333 0 0 1 0-16.666M8.334 5h-.417a.833.833 0 0 0-.833.833v2.5h-.417a.833.833 0 0 0 0 1.667h.417v.833h-.417a.833.833 0 1 0 0 1.667h.417v1.667a.833.833 0 0 0 1.666 0V12.5h1.353l.79 1.976a.83.83 0 0 0 .774.524h.417a.833.833 0 0 0 .833-.833V12.5h.417a.833.833 0 0 0 0-1.667h-.417V10h.417a.833.833 0 0 0 0-1.667h-.417v-2.5a.833.833 0 1 0-1.667 0v2.5h-1.019L9.108 5.524A.83.83 0 0 0 8.334 5" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path fill="currentColor" d="M13.3333 12.5C14.4217 12.5 15.3483 13.1958 15.6917 14.1667H16.6667C17.5 14.1667 17.5 15.8333 16.6667 15.8333H15.6917C15.3483 16.8042 14.4217 17.5 13.3333 17.5C12.245 17.5 11.3183 16.8042 10.975 15.8333H3.33333C2.5 15.8333 2.5 14.1667 3.33333 14.1667H10.975C11.3183 13.1958 12.245 12.5 13.3333 12.5Z" />
  </svg>
);

/** --- SHARED COMPONENTS --- **/

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-[16px] font-semibold text-[#111827]">{title}</h2>
      <button className="hover:opacity-70 transition-opacity">
        <Edit />
      </button>
    </div>
    {children}
  </div>
);

const InputWrapper = ({ label, children, required }) => (
  <div className="space-y-1.5 w-full">
    <label className="block text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

/** --- MAIN SETTINGS COMPONENT --- **/

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Info', icon: DashBoardIcon },
    { id: 'branch', label: 'Branch Settings', icon: BranchesIcon },
    { id: 'rules', label: 'Reservation Rules', icon: BookingsIcon },
    { id: 'staff', label: 'Staff Access', icon: UsersIcon },
    { id: 'payment', label: 'Payment & Payouts', icon: PaymentIcon },
    { id: 'security', label: 'Security', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans">
      {/* Header Tabs */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-0">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                  isActive 
                    ? 'border-[#0D9488] text-[#111827] bg-[#F3F4F6] rounded-t-lg' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
          <Edit />
          Edit All
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px]">
        
        {/* Business Information */}
        <SectionCard title="Business Information">
          <div className="space-y-5">
            <InputWrapper label="Business name">
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="Joe's Platter" 
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none text-gray-900"
                />
                <span className="absolute right-3 top-3 text-xs text-gray-400">0/50</span>
              </div>
            </InputWrapper>
            
            <InputWrapper label="Business Type">
              <div className="relative">
                <select className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg appearance-none focus:ring-1 focus:ring-teal-500 outline-none text-gray-900">
                  <option>Restaurant</option>
                  <option>Club</option>
                  <option>Hotel</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </InputWrapper>
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact Information">
          <div className="space-y-5">
            <InputWrapper label="Support Contact Email" required>
              <div className="relative">
                <input 
                  type="email" 
                  defaultValue="support@bookings.com" 
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none text-gray-900"
                />
                <Mail className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </InputWrapper>
            
            <InputWrapper label="Support Phone Number" required>
              <div className="relative">
                <input 
                  type="tel" 
                  defaultValue="+234 000 111 234" 
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none text-gray-900"
                />
                <Phone className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </InputWrapper>
          </div>
        </SectionCard>

        {/* Business Logo */}
        <SectionCard title="Business Logo">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 bg-[#E5E7EB] rounded-xl flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-gray-500" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                Upload a logo on your profile and customer facing pages
              </p>
              <button className="px-4 py-1.5 text-sm font-medium text-[#0D9488] bg-[#F0FDFA] border border-[#CCFBF1] rounded-lg hover:bg-[#CCFBF1]">
                Browse Files
              </button>
              <p className="text-xs text-gray-400">
                Recommended size: 400×400px. Max file size: 2MB.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Footer Buttons */}
      <div className="mt-12 flex justify-end gap-4">
        <button className="px-8 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          Reset to Default
        </button>
        <button className="px-8 py-2.5 text-sm font-medium text-white bg-[#065F46] rounded-lg hover:bg-[#044e3a] shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;