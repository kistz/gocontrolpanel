"use server";
import { withAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { collections, getDatabase } from "../../lib/mongodb";
import { DBPlayer, Player } from "../../types/player";

export async function getAllPlayers(): Promise<Player[]> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const players = await collection
    .find({
      deletedAt: { $exists: false },
    })
    .toArray();
  return players.map((player) => mapDBPlayerToPlayer(player));
}

export async function getPlayerCount(): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  return collection.countDocuments({
    deletedAt: { $exists: false },
  });
}

export async function getNewPlayersCount(days: number): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const date = new Date();
  date.setDate(date.getDate() - days);
  const count = await collection.countDocuments({
    createdAt: { $gte: date },
    deletedAt: { $exists: false },
  });
  return count;
}

export async function getPlayersPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
  filter?: string,
): Promise<{ data: Player[]; totalCount: number }> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const totalCount = await collection.countDocuments({
    deletedAt: { $exists: false },
    ...(filter && {
      $or: [
        { login: { $regex: filter, $options: "i" } },
        { nickname: { $regex: filter, $options: "i" } },
        { ubiUid: { $regex: filter, $options: "i" } },
        { path: { $regex: filter, $options: "i" } },
      ],
    }),
  });
  const players = await collection
    .find({
      deletedAt: { $exists: false },
      ...(filter && {
        $or: [
          { login: { $regex: filter, $options: "i" } },
          { nickname: { $regex: filter, $options: "i" } },
          { ubiUid: { $regex: filter, $options: "i" } },
          { path: { $regex: filter, $options: "i" } },
        ],
      }),
    })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sorting.field]: sorting.order === "ASC" ? 1 : -1 })
    .toArray();

  return {
    data: players.map((player) => mapDBPlayerToPlayer(player)),
    totalCount,
  };
}

export async function getPlayerById(
  playerId: ObjectId | string,
): Promise<Player> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const player = await collection.findOne({
    _id: new ObjectId(playerId),
    deletedAt: { $exists: false },
  });
  if (!player) {
    throw new Error(`Player not found`);
  }
  return mapDBPlayerToPlayer(player);
}

export async function getPlayerByLogin(login: string): Promise<Player | null> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const player = await collection.findOne({
    login,
    deletedAt: { $exists: false },
  });
  if (!player) {
    return null;
  }
  return mapDBPlayerToPlayer(player);
}

export async function createPlayerAuth(
  player: Omit<DBPlayer, "_id" | "createdAt" | "updatedAt">,
): Promise<Player> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);

  const existingPlayer = await collection.findOne({
    $or: [
      { login: player.login },
      { nickname: player.nickName },
      { ubiUid: player.ubiUid },
    ],
  });

  if (existingPlayer) {
    throw new Error("Player with this login or nickname already exists");
  }

  const newPlayer = {
    ...player,
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newPlayer);

  if (!result.acknowledged) {
    throw new Error("Failed to create player");
  }

  return mapDBPlayerToPlayer({ ...newPlayer, _id: result.insertedId });
}

export async function updatePlayer(
  playerId: ObjectId | string,
  data: Partial<DBPlayer>,
): Promise<void> {
  const session = await withAuth(["admin"]);
  if (playerId === session.user._id) {
    throw new Error("Cannot update your own account");
  }

  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const result = await collection.updateOne(
    { _id: new ObjectId(playerId) },
    { $set: data },
  );
  if (result.matchedCount === 0) {
    throw new Error(`Player not found`);
  }
}

export async function deletePlayerById(
  playerId: ObjectId | string,
): Promise<void> {
  const session = await withAuth(["admin"]);

  if (playerId === session.user._id) {
    throw new Error("Cannot delete your own account");
  }

  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const result = await collection.updateOne(
    { _id: new ObjectId(playerId) },
    { $set: { deletedAt: new Date() } },
  );
  if (result.matchedCount === 0) {
    throw new Error(`Player not found`);
  }
}

function mapDBPlayerToPlayer(dbPlayer: DBPlayer): Player {
  return {
    ...dbPlayer,
    _id: dbPlayer._id.toString(),
  };
}
