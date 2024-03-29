import * as Scores from "./scores.ts";

const db = await Deno.openKv();

export const PREFIX = "challenge";

export type Challenge = {
  name: string;
};

export const getAll = async () => {
  const entries = db.list<Challenge>({ prefix: [PREFIX] });

  const challenges = [];
  for await (const entry of entries) {
    const id = entry.key[entry.key.length - 1].toString();
    const name = entry.value.name;
    challenges.push({
      id,
      name,
    });
  }

  return challenges;
};

export const get = async (id: string) => {
  const challenge = await db.get<Challenge>([PREFIX, id]);

  if (!challenge) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    data: {
      id,
      ...challenge.value,
    },
  };
};

export const add = async (name: string) => {
  const id = crypto.randomUUID();

  await db.set([PREFIX, id], {
    name,
  });

  return {
    success: true,
    data: {
      id,
      name,
    },
  };
};

export const remove = async (id: string) => {
  const exisitingChallenge = await db.get<Challenge>([PREFIX, id]);

  if (!exisitingChallenge) {
    return {
      success: false,
    };
  }

  await db.delete(["challenge", id]);

  await Scores.remove("challenge", id);

  return {
    success: true,
  };
};
