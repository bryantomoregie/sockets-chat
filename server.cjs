const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();
server.on("connection", (ws) => {
  console.log("New client connected");
  clients.add(ws);
  ws.on("message", (message) => {
    console.log("Receieved a message", message);
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.on("close", () => {
    console.log("Client has disconnected");
    clients.delete(ws);
  });
});
console.log("WebSocket server is running on ws://localhost:8080");
