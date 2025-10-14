import { Building2 } from "lucide-react";
import { InputField, SectionCard, SelectField } from "./settingsComp";

export const BusinessInformation = ({ businessName, setBusinessName, businessType, setBusinessType }) => (
  
  <SectionCard title="Business Information">
    <div className="space-y-4">
      <InputField
        label="Business name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        maxLength={50}
      />

      <SelectField
        label="Business Type"
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        options={['Restaurant', 'Club', 'Hotel']}
      />
    </div>
  </SectionCard>
);

export const BusinessLogo = () => (

    <SectionCard title="Business Logo">
    <div className="flex items-start gap-6">
      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-3">
          Upload a logo on your profile and customer facing pages
        </p>
        <button className="px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
          Browse Files
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Recommended size: 400×400px. Max file size: 2MB.
        </p>
      </div>
    </div>
  </SectionCard>

 
                  
);