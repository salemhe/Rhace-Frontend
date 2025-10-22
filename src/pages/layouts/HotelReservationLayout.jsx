import { ReservationsProvider } from "@/contexts/hotel/ReservationContext";
import React from "react";
import { Outlet } from "react-router";

const ReservationLayout = () => {
  return (
    <div>
      <ReservationsProvider>
        <Outlet />
      </ReservationsProvider>
    </div>
  );
};

export default ReservationLayout;
