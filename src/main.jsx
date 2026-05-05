import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import { LocationProvider } from "./contexts/LocationContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import "./index.css";
import { persistor, store } from "./redux/store";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <BrowserRouter>
            <LocationProvider>
              <QueryClientProvider client={queryClient}>
                  <App />
              </QueryClientProvider>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                closeButton={true}
                toastClassName={(context) => {
                  const isError = context?.type === "error";
                  return (
                    "flex items-center gap-0.5  py-3 pl-3 pr-8 rounded-xl " +
                    "bg-[#ffffff] text-[#191b1a] text-sm " +
                    "shadow-[0_0_20px_rgba(29,158,117,0.15)] " +
                    (isError
                      ? "border border-red-500"
                      : "border border-[rgba(29,158,117,0.4)]")
                  );
                }}
                bodyClassName={() => "flex items-center gap-2.5 p-0 m-0"}
                // icon={false}
              />
            </LocationProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
