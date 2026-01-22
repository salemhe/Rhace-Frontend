import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ url, children }) => {
  const socket = useRef(null);
  const [connected, setConnected] = useState(false);
  const listeners = useRef(new Map());

  useEffect(() => {
    socket.current = io(url);

    socket.current.on("connect", () => {
      setConnected(true);
      console.log("Socket.IO connected");
    });

    socket.current.on("disconnect", () => {
      setConnected(false);
      console.log("Socket.IO disconnected");
    });

    socket.current.on("report-update", (payload) => {
      const handler = listeners.current.get("report-update");
      if (handler) {
        console.log("Report update received:", payload);
        handler(payload);
      }
    });

    socket.current.on("payment_update", (payload) => {
      const handler = listeners.current.get("payment_update");
      if (handler) {
        console.log("Payment update received:", payload);
        handler(payload);
      }
    });

    socket.current.on("paymentUpdate", (payload) => {
      const handler = listeners.current.get("payment_update");
      if (handler) {
        console.log("Payment update (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("payout_update", (payload) => {
      const handler = listeners.current.get("payout_update");
      if (handler) {
        console.log("Payout update received:", payload);
        handler(payload);
      }
    });

    socket.current.on("payoutUpdate", (payload) => {
      const handler = listeners.current.get("payout_update");
      if (handler) {
        console.log("Payout update (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("reservation-updated", (payload) => {
      const handler = listeners.current.get("reservation-updated");
      if (handler) {
        console.log("Reservation update received:", payload);
        handler(payload);
      }
    });

    socket.current.on("reservationUpdated", (payload) => {
      const handler = listeners.current.get("reservation-updated");
      if (handler) {
        console.log("Reservation update (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("reservation-created", (payload) => {
      const handler = listeners.current.get("reservation-created");
      if (handler) {
        console.log("Reservation created received:", payload);
        handler(payload);
      }
    });

    socket.current.on("reservationCreated", (payload) => {
      const handler = listeners.current.get("reservation-created");
      if (handler) {
        console.log("Reservation created (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("reservation-deleted", (payload) => {
      const handler = listeners.current.get("reservation-deleted");
      if (handler) {
        console.log("Reservation deleted received:", payload);
        handler(payload);
      }
    });

    socket.current.on("reservationDeleted", (payload) => {
      const handler = listeners.current.get("reservation-deleted");
      if (handler) {
        console.log("Reservation deleted (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("reservation-counters-updated", (payload) => {
      const handler = listeners.current.get("reservation-counters-updated");
      if (handler) {
        console.log("Reservation counters updated received:", payload);
        handler(payload);
      }
    });

    socket.current.on("reservationCountersUpdated", (payload) => {
      const handler = listeners.current.get("reservation-counters-updated");
      if (handler) {
        console.log("Reservation counters updated (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("user-created", (payload) => {
      const handler = listeners.current.get("user-created");
      if (handler) {
        console.log("User created received:", payload);
        handler(payload);
      }
    });

    socket.current.on("userCreated", (payload) => {
      const handler = listeners.current.get("user-created");
      if (handler) {
        console.log("User created (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("user-deleted", (payload) => {
      const handler = listeners.current.get("user-deleted");
      if (handler) {
        console.log("User deleted received:", payload);
        handler(payload);
      }
    });

    socket.current.on("userDeleted", (payload) => {
      const handler = listeners.current.get("user-deleted");
      if (handler) {
        console.log("User deleted (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("user-updated", (payload) => {
      const handler = listeners.current.get("user-updated");
      if (handler) {
        console.log("User updated received:", payload);
        handler(payload);
      }
    });

    socket.current.on("userUpdated", (payload) => {
      const handler = listeners.current.get("user-updated");
      if (handler) {
        console.log("User updated (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("user-count-updated", (payload) => {
      const handler = listeners.current.get("user-count-updated");
      if (handler) {
        console.log("User count updated received:", payload);
        handler(payload);
      }
    });

    socket.current.on("userCountUpdated", (payload) => {
      const handler = listeners.current.get("user-count-updated");
      if (handler) {
        console.log("User count updated (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("user-activity", (payload) => {
      const handler = listeners.current.get("user-activity");
      if (handler) {
        console.log("User activity received:", payload);
        handler(payload);
      }
    });

    socket.current.on("userActivity", (payload) => {
      const handler = listeners.current.get("user-activity");
      if (handler) {
        console.log("User activity (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("vendor-created", (payload) => {
      const handler = listeners.current.get("vendor-created");
      if (handler) {
        console.log("Vendor created received:", payload);
        handler(payload);
      }
    });

    socket.current.on("vendorCreated", (payload) => {
      const handler = listeners.current.get("vendor-created");
      if (handler) {
        console.log("Vendor created (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("vendor-updated", (payload) => {
      const handler = listeners.current.get("vendor-updated");
      if (handler) {
        console.log("Vendor updated received:", payload);
        handler(payload);
      }
    });

    socket.current.on("vendorUpdated", (payload) => {
      const handler = listeners.current.get("vendor-updated");
      if (handler) {
        console.log("Vendor updated (camelCase) received:", payload);
        handler(payload);
      }
    });

    socket.current.on("vendor-deleted", (payload) => {
      const handler = listeners.current.get("vendor-deleted");
      if (handler) {
        console.log("Vendor deleted received:", payload);
        handler(payload);
      }
    });

    socket.current.on("vendorDeleted", (payload) => {
      const handler = listeners.current.get("vendor-deleted");
      if (handler) {
        console.log("Vendor deleted (camelCase) received:", payload);
        handler(payload);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [url]);

  const sendMessage = useCallback(
    (type, payload) => {
      if (socket.current && connected) {
        socket.current.emit(type, payload);
      }
    },
    [connected]
  );

  const subscribe = useCallback((type, handler) => {
    listeners.current.set(type, handler);
  }, []);

  const unsubscribe = useCallback((type) => {
    listeners.current.delete(type);
  }, []);

  return (
    <WebSocketContext.Provider value={{ connected, sendMessage, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};
