import { Hono } from "https://deno.land/x/hono@v4.1.5/mod.ts";

import * as Challenges from "../models/challenges.ts";

const app = new Hono();

app.get("/", async (c) => {
  const challenges = await Challenges.getAll();
  return c.json(challenges);
});

app.post("/", async (c) => {
  const json = await c.req.json<{ name: string }>();

  const challenge = await Challenges.add(json.name);
  if (!challenge) {
    c.status(500);
    return c.text("Failed to add challenge");
  }

  return c.json(challenge);
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");

  const challenge = await Challenges.get(id);
  if (!challenge) {
    c.status(404);
    return c.text("Challenge not found");
  }

  return c.json(challenge);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const { success } = await Challenges.remove(id);
  if (!success) {
    c.status(500);
    return c.text("Failed to remove challenge");
  }

  return c.text("Challenge removed");
});

export default app;
