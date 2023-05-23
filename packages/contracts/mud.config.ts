import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    GameMoves: {
      schema: {
        turn: "Color",
        playerColor: "Color",
        playerAddress: "bytes32",
        state: "GameState",
        fenCode: "string",
      },
      keySchema: {
        gameId: "bytes32",
      },
    },
    Record: {
      schema: {
        wins: "uint256",
        losses: "uint256",
      },
      keySchema: {
        player: "bytes32",
      },
    },
    NFTs: {
      keySchema: {
        player: "bytes32",
        gameId: "bytes32",
      },
      schema: {
        ipfsHash: "string",
      },
    },
  },
  enums: {
    Color: ["WHITE", "BLACK"],
    GameState: ["DOES_NOT_EXIST", "WON", "LOST", "ONGOING"],
  },
  modules: [
    {
      name: "UniqueEntityModule",
      root: true,
      args: [],
    },
  ],
});
