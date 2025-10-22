

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoomsManagementComponent from "./components/RoomsManagement";


const RoomsManagement = () => {


  return (
    <DashboardLayout type="hotel" >
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
       <RoomsManagementComponent />
    </div>
    </DashboardLayout>
  );
};

export default RoomsManagement;
