import { upgradeWebSocket } from "https://deno.land/x/hono@v4.1.5/adapter/deno/websocket.ts";
import { Hono } from "https://deno.land/x/hono@v4.1.5/mod.ts";
import { connectedClients } from "../utils/ws.ts";

const app = new Hono();

app.get(
  "/teams",
  upgradeWebSocket(() => {
    return {
      onOpen: (_evt, ws) => {
        connectedClients.add(ws);
      },
      onClose: (_evt, ws) => {
        connectedClients.delete(ws);
      },
    };
  }),
);

export default app;
