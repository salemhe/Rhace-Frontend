import { InputField, SectionCard } from "./settingsComp";

export const ContactInformation = ({ supportEmail, setSupportEmail, supportPhone, setSupportPhone }) => (
  <SectionCard title="Contact Information">
    <div className="space-y-4">
      <InputField
        label="Support Contact Email*"
        type="email"
        value={supportEmail}
        onChange={(e) => setSupportEmail(e.target.value)}
      />

      <InputField
        label="Support Phone Number*"
        type="tel"
        value={supportPhone}
        onChange={(e) => setSupportPhone(e.target.value)}
      />
    </div>
  </SectionCard>
);