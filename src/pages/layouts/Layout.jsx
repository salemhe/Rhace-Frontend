import { ReduxProvider } from "@/hooks/providers";
import React from "react";
import { Outlet } from "react-router";

const Layout = () => {
    return (
        <ReduxProvider>
            <Outlet />
        </ReduxProvider>
    );
};

export default Layout;
