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

    socket.current.on("payout_update", (payload) => {
      const handler = listeners.current.get("payout_update");
      if (handler) {
        console.log("Payout update received:", payload);
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

    socket.current.on("reservation-created", (payload) => {
      const handler = listeners.current.get("reservation-created");
      if (handler) {
        console.log("Reservation created received:", payload);
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
