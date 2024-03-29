const db = await Deno.openKv();

export const PREFIX = "score";

export const set = async (
  teamId: string,
  challengeId: string,
  score: number
) => {
  await db.set([PREFIX, teamId, challengeId], score);

  return {
    success: true,
  };
};

export const get = async (teamId: string, challengeId: string) => {
  const score = await db.get<number>([PREFIX, teamId, challengeId]);

  if (!score.value) {
    await set(teamId, challengeId, 0);

    return 0;
  }

  return score.value;
};

export const getTotalScore = async (teamId: string) => {
  const entries = db.list<number>({ prefix: [PREFIX, teamId] });

  let totalScore = 0;
  for await (const entry of entries) {
    totalScore += entry.value;
  }

  return totalScore;
};

export const remove = async (type: "team" | "challenge", id: string) => {
  const entries = db.list<number>({ prefix: [PREFIX] });

  for await (const entry of entries) {
    const [_prefix, teamId, challengeId] = entry.key;

    if (type === "team" && teamId === id) {
      await db.delete(entry.key);
    }

    if (type === "challenge" && challengeId === id) {
      await db.delete(entry.key);
    }
  }

  return {
    success: true,
  };
};
