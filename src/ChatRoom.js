// src/ChatRoom.js
export class ChatRoom {
    constructor(state, env) {
      this.state = state;
      this.env = env;
      this.clients = [];
    }
  
    async fetch(request) {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 426 });
      }
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
  
      server.accept(); // Accept the server side of the WebSocket
  
      this.clients.push(server);
  
      server.addEventListener("message", (evt) => {
        const message = evt.data;
        for (let ws of this.clients) {
          try {
            ws.send(message);
          } catch (err) {
            console.error("Send error:", err);
          }
        }
      });
  
      server.addEventListener("close", () => {
        this.clients = this.clients.filter((ws) => ws !== server);
      });
  
      return new Response(null, { status: 101, webSocket: client });
    }
  }
  