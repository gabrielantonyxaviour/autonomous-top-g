import { useComponentValue } from "@latticexyz/react";
import { useState } from "react";
import { useMUD } from "./MUDContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
const GamePage = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
    network: { singletonEntity },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);

  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();

  function safeGameMutate(modify: any) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game: any) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare: any, targetSquare: any) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeRandomMove, 200);
    setCurrentTimeout(newTimeout);
    return true;
  }

  return (
    <>
      {/* <div>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button> */}
      <div style={{ width: "400px", height: "400px" }}>
        <Chessboard
          id="PlayVsRandom"
          position={game.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
        />
        <button
          style={{}}
          onClick={() => {
            safeGameMutate((game: any) => {
              game.reset();
            });
            clearTimeout(currentTimeout);
          }}
        >
          reset
        </button>
        <button
          style={{}}
          onClick={() => {
            safeGameMutate((game: any) => {
              game.undo();
            });
            clearTimeout(currentTimeout);
          }}
        >
          undo
        </button>
      </div>
    </>
  );
};
export default GamePage;
