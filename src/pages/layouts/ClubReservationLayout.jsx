import { ReservationsProvider } from "@/contexts/club/ReservationContext";
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
