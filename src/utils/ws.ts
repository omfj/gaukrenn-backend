import { WSContext } from "https://deno.land/x/hono@v4.1.5/helper/websocket/index.ts";

export const connectedClients = new Set<WSContext>();

export function broadcast(message: string) {
  for (const client of connectedClients) {
    client.send(message);
  }
}
