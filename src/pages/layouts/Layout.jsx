import { ReduxProvider } from "@/hooks/providers";
import React from "react";
import { Outlet } from "react-router";

const Layout = () => {
    return (
        <div>
            <ReduxProvider>
                <Outlet />
            </ReduxProvider>
        </div>
    );
};

export default Layout;
