import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

const entityToBytes32 = (entity: string) => {
  return "0x" + entity.replace("0x", "").padStart(64, "0");
};

export function createSystemCalls(
  { worldSend }: SetupNetworkResult,
  { GameMoves, Record, NFTs }: ClientComponents
) {
  const createGame = async (gameId: string, playerColor: number) => {
    const tx = await worldSend("setGameInit", [
      entityToBytes32(gameId),
      playerColor,
    ]);
  };
  const makeMove = async (gameId: string, fenCode: string) => {
    const tx = await worldSend("playTurn", [entityToBytes32(gameId), fenCode]);
  };
  const finishGame = async (
    gameId: string,
    winner: number,
    ipfsHash: string
  ) => {
    const tx = await worldSend("endGame", [entityToBytes32(gameId), winner, ipfsHash]);
  };

  return {
    createGame,
    makeMove,
    finishGame,
  };
}
