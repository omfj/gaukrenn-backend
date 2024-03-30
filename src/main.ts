import { Hono } from "https://deno.land/x/hono@v4.1.5/mod.ts";
import { cors, logger } from "https://deno.land/x/hono@v4.1.5/middleware.ts";

// Services
import teamsService from "./services/teams.ts";
import pushService from "./services/push.ts";
import wsService from "./services/ws.ts";
import scoresService from "./services/scores.ts";
import challengesService from "./services/challenges.ts";

const app = new Hono();

app.use(logger());
app.use("/api/*", cors());

app.route("/api/teams", teamsService);
app.route("/api/push", pushService);
app.route("/api/scores", scoresService);
app.route("/api/challenges", challengesService);
app.route("/ws", wsService);

Deno.serve(app.fetch);
