/* Autogenerated file. Do not edit manually. */

import { TableId } from "@latticexyz/utils";
import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    GameMoves: (() => {
      const tableId = new TableId("", "GameMoves");
      return defineComponent(
        world,
        {
          turn: RecsType.Number,
          playerColor: RecsType.Number,
          playerAddress: RecsType.String,
          state: RecsType.Number,
          fenCode: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    Record: (() => {
      const tableId = new TableId("", "Record");
      return defineComponent(
        world,
        {
          wins: RecsType.BigInt,
          losses: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    NFTs: (() => {
      const tableId = new TableId("", "NFTs");
      return defineComponent(
        world,
        {
          ipfsHash: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
  };
}
