import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children}) => {
  const socket = useRef(null);
  const vendor = useSelector((state) => state.auth.vendor);
  const [connected, setConnected] = useState(false);
  const listeners = useRef(new Map());
  const reconnectTimeout = useRef(null);

  const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL; // e.g., ws://localhost:3000

  const connect = useCallback(() => {
    // Don't connect if we don't have user info or already connected
    if (!vendor?._id) return;
    if (socket.current?.readyState === WebSocket.OPEN) return;

    // Construct URL with query params as expected by your backend
    const url = `${VITE_SOCKET_URL}/?type=vendor&id=${vendor._id}`;
    
    socket.current = new WebSocket(url);

    socket.current.onopen = () => {
      setConnected(true);
      console.log(`WebSocket Connected as vendor (${vendor._id})`);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };

    socket.current.onclose = (e) => {
      setConnected(false);
      console.log(`WebSocket Disconnected: ${e.reason}. Reconnecting in 3s...`);
      // Manual Reconnection Logic
      reconnectTimeout.current = setTimeout(connect, 3000);
    };

    socket.current.onerror = (err) => {
      console.error("WebSocket Error:", err);
      socket.current.close();
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // We assume your backend sends objects like: { type: 'reservation-created', payload: {...} }
        const { type, payload } = data;

        const handler = listeners.current.get(type);
        if (handler) {
          handler(payload);
        }

        // Support for your camelCase fallbacks (optional)
        const camelCaseMapping = {
          "reservationCreated": "reservation-created",
          "reservationUpdated": "reservation-updated",
          "paymentUpdate": "payment_update"
        };
        
        if (camelCaseMapping[type]) {
          const fallbackHandler = listeners.current.get(camelCaseMapping[type]);
          if (fallbackHandler) fallbackHandler(payload);
        }
      } catch (err) {
        console.warn("Received non-JSON message or malformed data:", event.data);
      }
    };
  }, [VITE_SOCKET_URL, vendor._id]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (socket.current) socket.current.close();
    };
  }, [connect]);

  const sendMessage = useCallback((type, payload) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

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

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};