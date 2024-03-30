import { Hono } from "https://deno.land/x/hono@v4.1.5/mod.ts";
import * as Teams from "../models/teams.ts";

const app = new Hono();

app.get("/", async (c) => {
  const teams = await Teams.getAll();
  return c.json(teams);
});

app.get("/challenges/:id", async (c) => {
  const id = c.req.param("id");
  const teams = await Teams.getAll(id);
  if (!teams) {
    c.status(404);
    return c.text("Team not found");
  }

  return c.json(teams);
});

app.post("/", async (c) => {
  const json = await c.req.json<{ name: string }>();

  const team = await Teams.add(json.name);

  return c.json(team);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { success } = await Teams.remove(id);
  if (!success) {
    return c.text("Failed to remove team");
  }

  return c.text("Team removed");
});

export default app;
