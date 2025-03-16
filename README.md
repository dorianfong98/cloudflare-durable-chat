# 💬 Real-Time Chat (powered by Cloudflare Durable Objects + Workers)🚀

A fully _serverless_, real-time chat application  **running entirely on** **[Cloudflare’s Edge](https://www.cloudflare.com/network/) 🌐**.  
Messages are broadcast in real-time to all connected users in a chat room, powered by Durable Objects maintaining room state globally.  

🛠️ Built with:
- **Workers + Durable Objects** for the back-end logic and persistent WebSocket connections.
- **Cloudflare Pages** for the front-end.
- **No traditional servers** to manage—this is 100% serverless at the edge.

---

## 👨‍💻👩‍💻 Live Demo

👉 **Frontend (Chat in realtime)**: [https://cf-chat-frontend.pages.dev/](https://cf-chat-frontend.pages.dev/)  
👉 **Back-End (WebSocket API endpoint)**: https://cloudflare-chat.burrito-bot.workers.dev/<br />
    _The Back-End link is the Cloudflare Worker endpoint that handles WebSocket connections and message broadcasting._  
    _It’s the "brain" behind the chat — but it’s designed to be used via the [front-end UI](https://cf-chat-frontend.pages.dev/)._

**To try it out**:
1. Simply open the link above in **two or more tabs** (or share with a friend).
2. Type a message in one tab and hit **Send**.
3. Watch it appear in **all tabs** instantly — **real-time chat at the edge**.

---

## ✨ Features

✅ Real-time chat using **Cloudflare Durable Objects + WebSockets**  
✅ Persistent room state across global clients  
✅ Edge-deployed — **instant response, low latency, globally**  
✅ Simple & responsive front-end hosted on **Cloudflare Pages**  
✅ No backend servers — 100% serverless architecture  

---

## 🧠 How It Works

### 💬 Real-Time Chat Rooms

- Each chat room is managed by a **Durable Object `(ChatRoom)`**.
- Clients connect via **WebSockets** to `/room/general/websocket`.
- Messages are broadcast to all connected clients in real-time.

### ⚙️ Edge Compute Capabilities

- **Cloudflare Workers** handle WebSocket upgrades and route messages.
- Durable Objects maintain room-specific state, tracking connected clients.
- **Cloudflare Pages** serves the static front-end.

---

## 🏗️ Architecture Diagram

```
                +-----------+        WebSocket       +-------------------------+
                |  User A   | <--------------------> |  CF Worker (index.js)   |
                +-----------+                        +-------------------------+
                                                         |
                +-----------+        WebSocket           |
                |  User B   | <--------------------------+
                +-----------+                            |
                                                         v
                                                   +-----------+
                                                   | ChatRoom  |
                                                   | Durable   |
                                                   | Object    |
                                                   +-----------+
                                                        |
                                                        |
                                                        v
                +-----------------+             +------------------+
                | index.html      | <---------> |  User A (Browser)|
                | (CF Pages)      |             +------------------+
                +-----------------+
                     |
                     +-------------------------> User B (Browser)
```
**Summary:** Each user connects via WebSocket to a Cloudflare Worker, which forwards them to a Durable Object acting as the room manager, handling all messages and broadcasting them in real time — serverlessly and globally.
1. User A / User B loads the frontend Chat UI of the chat application `index.html`, which is served by **CF Pages** .
- This front-end contains JavaScript that will initiate a **WebSocket connection** to the back-end (**Cloudflare Worker**).

2. Browser then runs JavaScript that that connects to a WebSocket endpoint exposed by the Worker. 
- `const socket = new WebSocket('wss://cloudflare-chat.burrito-bot.workers.dev/room/general/websocket');`
- **User A and User B are now connected** _via WebSocket_ to the **Worker**.

3. Cloudflare Worker Routes WebSocket to Durable Object (ChatRoom)
* The Worker doesn't handle chat messages directly. Instead, it:
     - **Identifies the chat room name** from the URL (e.g., general).
     - **Routes** the WebSocket connection **to the Durable Object (ChatRoom)** associated with that room.
* If the Durable Object instance doesn't exist yet for that room, Cloudflare automatically creates it.
* Thus the outcome is that both User A and User B are now **attached to the same ChatRoom Durable Object** for `general`.

4. ChatRoom Durable Object Manages Room State and Connections
* The **ChatRoom Durable Object**:
     - Keeps a list of all active WebSocket connections (users in the room).
     - Listens for incoming messages from connected clients.
* This means the Durable Object knows who is in the room and can broadcast messages to them.

5. User A Sends a Message
* When User A types a message and clicks "Send":
     - The front-end sends this message through the open WebSocket to the Worker.
     - The Worker passes this message to the ChatRoom Durable Object.
* Message from User A is now in the Durable Object's hands, ready to be broadcast.

6. Durable Object Broadcasts Message to All Users
* The ChatRoom Durable Object:
     - Receives the message.
     - Iterates through its list of WebSocket connections (users in the room).
     - Sends the message to each connected user, including User A (so they see their own message reflected back).
* **All users in the room** (User A and User B) see the message **instantly appear** in their chat window — real-time.

7. User B Sees the New Message
* User B's browser receives the message via the open WebSocket connection.
* JavaScript running in the browser updates the DOM and adds the message to the chat window.
* Real-time communication is complete — no refresh, no delay.

8. Multiple Rooms (Optional Future Expansion)
* If another user connects to /room/sports/websocket, a separate Durable Object for sports would be created, isolating chat rooms by name.
* Users in `general` would never see messages from sports, and vice versa.

## 💻 Local Development Setup
If you'd like, you can run and test everything locally:
### 0. Requirements
- Node.js + npm
- Wrangler CLI ()` npm install -g wrangler `)

### 1. Clone this Repo
Open your terminal, and navigate to the directory where you want your project folder to live
```
git clone https://github.com/<yourusername>/cloudflare-durable-chat.git
cd cloudflare-durable-chat
```
### 2. Install Dependencies
```
npm install
```
### 3. Run Worker Locally
```
npx wrangler dev
```
### 4. Serve Front-End Locally
```
cd frontend
npx http-server -p 8080
```
### 5. Connect Local Front-End to Local Worker
* Edit `frontend/index.html`:
```
const socketUrl = `ws://127.0.0.1:8787/room/general/websocket`;
```
* And open `http://localhost:8080` to start chatting locally!