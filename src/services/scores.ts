import { Hono } from "https://deno.land/x/hono@v4.1.5/mod.ts";

import * as Scores from "../models/scores.ts";

const app = new Hono();

app.get("/teams/:id", async (c) => {
  const id = c.req.param("id");

  const score = await Scores.getTotalScore(id);

  return c.json({ score });
});

app.get("/teams/:teamId/challegens/:challengeId", async (c) => {
  const { teamId, challengeId } = c.req.param();

  const score = await Scores.get(teamId, challengeId);

  return c.json({ score });
});

app.post("/teams/:teamId/challenges/:challengeId", async (c) => {
  const { teamId, challengeId } = c.req.param();
  const json = await c.req.json<{ score: number }>();

  const { success } = await Scores.set(teamId, challengeId, json.score);
  if (!success) {
    c.status(500);
    return c.text("Failed to set score");
  }

  return c.text("Score set");
});

export default app;
