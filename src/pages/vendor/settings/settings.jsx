import DashboardLayout from '@/components/layout/DashboardLayout';
import { Building2, Calendar, DollarSign, Home, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import { BranchConfigHeader, OpeningHours, ReservationPreferences } from './BranchSettingsTab';
import { BusinessInformation, BusinessLogo } from './part/BusinessInfo';
import { ContactInformation } from './part/ContactInfo';
import { ActionButtons,  PlaceholderTab, TabsNavigation } from './part/settingsComp';


// Main Component
const Settings = () => {
   const [activeTab, setActiveTab] = useState('general');
   const [selectedBranch, setSelectedBranch] = useState('Restaurant 1 - Headquarter');
   const [branchEnabled, setBranchEnabled] = useState(true);

   const [businessName, setBusinessName] = useState("Joe's Platter");
   const [businessType, setBusinessType] = useState('Restaurant');
   const [supportEmail, setSupportEmail] = useState('support@bookings.com');
   const [supportPhone, setSupportPhone] = useState('+234 000 111 234');

   const [openingHours, setOpeningHours] = useState({
      Monday: { start: '09:00', end: '22:00', enabled: true },
      Tuesday: { start: '09:00', end: '22:00', enabled: true },
      Wednesday: { start: '09:00', end: '22:00', enabled: true },
      Thursday: { start: '09:00', end: '22:00', enabled: true },
      Friday: { start: '09:00', end: '22:00', enabled: true },
      Saturday: { start: '09:00', end: '22:00', enabled: true },
      Sunday: { start: '09:00', end: '22:00', enabled: true }
   });

   const [minGuests, setMinGuests] = useState(1);
   const [maxGuests, setMaxGuests] = useState(12);
   const [defaultDuration, setDefaultDuration] = useState('1 hour');
   const [defaultCapacity, setDefaultCapacity] = useState(80);
   const [leadTime, setLeadTime] = useState('2 hours before');
   const [cutoffTime, setCutoffTime] = useState('21:00');

   const tabs = [
      { id: 'general', label: 'General Info', icon: Home },
      { id: 'branch', label: 'Branch Settings', icon: Building2 },
      { id: 'reservation', label: 'Reservation Rules', icon: Calendar },
      { id: 'staff', label: 'Staff Access', icon: Users },
      { id: 'payment', label: 'Payment & Payouts', icon: DollarSign },
      { id: 'security', label: 'Security', icon: Shield }
   ];

   const toggleDayEnabled = (day) => {
      setOpeningHours(prev => ({
         ...prev,
         [day]: { ...prev[day], enabled: !prev[day].enabled }
      }));
   };

   const updateTime = (day, field, value) => {
      setOpeningHours(prev => ({
         ...prev,
         [day]: { ...prev[day], [field]: value }
      }));
   };

   const handleSave = () => {
      alert('Settings saved successfully!');
   };

   const handleReset = () => {
      if (confirm('Are you sure you want to reset to default settings?')) {
         alert('Settings reset to default');
      }
   };

   return (

      <DashboardLayout>
         <div className="min-h-screen bg-gray-50">
            <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

            <div className="max-w-7xl mx-auto p-6">
               {activeTab === 'general' && (
                  <div className="space-y-6">
                     <div className="flex  space-x-6">
                        <BusinessInformation
                           businessName={businessName}
                           setBusinessName={setBusinessName}
                           businessType={businessType}
                           setBusinessType={setBusinessType}
                        />
                        <ContactInformation
                           supportEmail={supportEmail}
                           setSupportEmail={setSupportEmail}
                           supportPhone={supportPhone}
                           setSupportPhone={setSupportPhone}
                        />
                     </div>

                     <div className="md:w-[49%]">
                        <BusinessLogo />
                     </div>
                  </div>
               )}

               {activeTab === 'branch' && (
                  <div className="space-y-6">
                     <BranchConfigHeader
                        selectedBranch={selectedBranch}
                        setSelectedBranch={setSelectedBranch}
                        branchEnabled={branchEnabled}
                        setBranchEnabled={setBranchEnabled}
                     />
                     <OpeningHours
                        openingHours={openingHours}
                        updateTime={updateTime}
                        toggleDayEnabled={toggleDayEnabled}
                     />
                     <ReservationPreferences
                        minGuests={minGuests}
                        setMinGuests={setMinGuests}
                        maxGuests={maxGuests}
                        setMaxGuests={setMaxGuests}
                        defaultDuration={defaultDuration}
                        setDefaultDuration={setDefaultDuration}
                        defaultCapacity={defaultCapacity}
                        setDefaultCapacity={setDefaultCapacity}
                        leadTime={leadTime}
                        setLeadTime={setLeadTime}
                        cutoffTime={cutoffTime}
                        setCutoffTime={setCutoffTime}
                     />
                  </div>
               )}

               {activeTab === 'reservation' && (
                  <PlaceholderTab
                     icon={Calendar}
                     title="Reservation Rules"
                     description="Configure reservation policies and rules"
                  />
               )}

               {activeTab === 'staff' && (
                  <PlaceholderTab
                     icon={Users}
                     title="Staff Access"
                     description="Manage staff members and permissions"
                  />
               )}

               {activeTab === 'payment' && (
                  <PlaceholderTab
                     icon={DollarSign}
                     title="Payment & Payouts"
                     description="Configure payment methods and payout settings"
                  />
               )}

               {activeTab === 'security' && (
                  <PlaceholderTab
                     icon={Shield}
                     title="Security"
                     description="Manage security settings and authentication"
                  />
               )}

               <ActionButtons onReset={handleReset} onSave={handleSave} />
            </div>
         </div>
      </DashboardLayout>
   );
};

export default Settings;