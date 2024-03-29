import { Hono } from "https://deno.land/x/hono@v4.1.5/mod.ts";
import { broadcast } from "../utils/ws.ts";
import * as Teams from "../models/teams.ts";

const app = new Hono();

app.get("/", async (c) => {
  const teams = await Teams.getAll();
  broadcast(JSON.stringify(teams));

  return c.text("OK");
});

export default app;
