let ws = null;
let reconnectInterval = 1000;
let maxReconnectInterval = 10000;
let reconnectTimeout = null;

export const getWebSocket = (onMessage) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return ws;
  }

  const connect = () => {
    console.log("🔌 Connecting to WebSocket...");

    ws = new WebSocket(
      window.location.protocol === "https:"
        ? import.meta.env.VITE_WEBSOCKET_ENDPOINT
        : "ws://localhost:3000"
    );

    ws.onopen = () => {
      console.log("🟢 WebSocket connected");
      reconnectInterval = 1000;
    };

    ws.onmessage = (event) => {
      if (typeof onMessage === "function") {
        onMessage(event);
      }
    };

    ws.onclose = () => {
      console.log("🔴 WS closed. Reconnecting...");
      scheduleReconnect();
    };

    ws.onerror = (err) => {
      console.warn("⚠️ WS error:", err);
      ws.close();
    };
  };

  const scheduleReconnect = () => {
    clearTimeout(reconnectTimeout);

    reconnectTimeout = setTimeout(() => {
      reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
      connect();
    }, reconnectInterval);
  };

  connect();
  return ws;
};
