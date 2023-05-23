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

  const cloneObject = (obj) => {
    return Object.create(
      Object.getPrototypeOf(obj),
      Object.getOwnPropertyDescriptors(obj)
    );
  };

  function makeRandomMove() {
    console.log("making random move");
    const possibleMoves = game.moves();
    console.log("possible moves:", possibleMoves);

    // exit if the game is over
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return;
    let isEvaluating = true;
    let updatedGame = cloneObject(game);
    // while (isEvaluating) {
    let randomIndex = Math.floor(Math.random() * possibleMoves.length);
    console.log("trying move:", possibleMoves[randomIndex]);
    // try {
    updatedGame.move(possibleMoves[randomIndex]);
    isEvaluating = false;
    setGame(updatedGame);
    // } catch (e) {}
    // }
  }

  function onDrop(sourceSquare, targetSquare) {
    const updatedGame = cloneObject(game);
    console.log(game);

    console.log("sourceSquare:", sourceSquare);
    console.log("targetSquare:", targetSquare);

    const move = updatedGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setGame(updatedGame);

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
          className="py-2 px-3 mt-4 bg-[#c79c2f] rounded-lg hover:bg-white hover:text-black transition ease-in-out delay-150 hover:scale-110 duration-300"
          onClick={() => {
            let updatedGame = cloneObject(game);
            updatedGame.reset();
            setGame(updatedGame);
            clearTimeout(currentTimeout);
          }}
        >
          reset
        </button>
        <button
          className="ml-2 py-2 px-3 mt-4 bg-[#c79c2f] rounded-lg hover:bg-white hover:text-black transition ease-in-out delay-150 hover:scale-110 duration-300"
          onClick={() => {
            let updatedGame = cloneObject(game);
            updatedGame.undo();
            setGame(updatedGame);
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
