/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { ChatRoom } from "./ChatRoom";

// 1) Re-export the DO class so that Wrangler sees it's exported by the entrypoint
export { ChatRoom };

// 2) The usual fetch handler for the Worker
export default {
	async fetch(request: Request, env: any) {
	  const url = new URL(request.url);
	  // Example: /room/<NAME>/websocket => ["", "room", "<NAME>", "websocket"]
	  const pathSegments = url.pathname.split("/");
  
	  // Check if the request matches /room/xxx/websocket
	  if (pathSegments[1] === "room" && pathSegments[3] === "websocket") {
		const roomName = pathSegments[2];
		
		//GET requests with Upgrade: websocket
		if (request.method === "GET" && request.headers.get("Upgrade") === "websocket") {
		  // Map the roomName to a Durable Object (DO) instance
		  const id = env.CHAT_ROOM.idFromName(roomName);	//the binding name from wrangler.jsonc
		  const objStub = env.CHAT_ROOM.get(id);
		  
		  // Forward the request to the DO's fetch method
		  return objStub.fetch(request);

		  //Now all “WebSocket upgrade” requests under the path /room/XXX/websocket  
		  //is routed to ChatRoom Durable Object

		}
	  }
  
	  // If the path doesn't match, return 404
	  return new Response("Not found", { status: 404 });
	},
  };

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;
