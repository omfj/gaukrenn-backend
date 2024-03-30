import * as Scores from "./scores.ts";

const db = await Deno.openKv();

export const PREFIX = "team";

export const add = async (name: string) => {
  const id = crypto.randomUUID();

  await db.set([PREFIX, id], name);

  return {
    id,
    name,
  };
};

export const remove = async (id: string) => {
  const exisitingTeam = await db.get<string>([PREFIX, id]);

  if (!exisitingTeam) {
    return {
      success: false,
    };
  }

  await db.delete(["team", id]);
  await Scores.remove("team", id);

  return {
    success: true,
  };
};

export const getAll = async (challengeId?: string) => {
  const entries = db.list<string>({ prefix: [PREFIX] });

  const teams = [];
  for await (const entry of entries) {
    const id = entry.key[entry.key.length - 1].toString();
    const name = entry.value;

    const scoreGetter = challengeId
      ? Scores.get.bind(null, id, challengeId)
      : Scores.getTotalScore.bind(null, id);

    const score = await scoreGetter();

    teams.push({
      id,
      name,
      score,
    });
  }

  return teams;
};
