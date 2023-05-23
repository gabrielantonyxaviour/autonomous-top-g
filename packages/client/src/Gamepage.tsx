import { useComponentValue } from "@latticexyz/react";
import { useEffect, useState } from "react";
import { useMUD } from "./MUDContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Celebration from "./assets/celebration.gif";
import Idle from "./assets/idle.png";
import Lost from "./assets/lost.gif";
function generateRandomHex() {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hex;
}
const GamePage = () => {
  const {
    components: { GameMoves, Record, NFTs },
    systemCalls: { createGame, makeMove, finishGame },
  } = useMUD();
  const [randomHex, setRandomHex] = useState(generateRandomHex());
  const [fenCode, setFenCode] = useState("");
  const [isKill, setIsKill] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // const counter = useComponentValue(Counter, singletonEntity);

  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
  useEffect(() => {
    (async function () {
      await createGame(randomHex, 0);
    })();
  }, []);
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
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      finishGame(randomHex, 1, "");
    }
    let isEvaluating = true;
    let updatedGame = cloneObject(game);
    // while (isEvaluating) {
    let randomIndex = Math.floor(Math.random() * possibleMoves.length);
    console.log("trying move:", possibleMoves[randomIndex]);
    // try {
    updatedGame.move(possibleMoves[randomIndex]);
    makeMove(randomHex, game.fen());

    isEvaluating = false;
    setGame(updatedGame);
    // } catch (e) {}
    // }
  }

  async function onDrop(sourceSquare, targetSquare) {
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
    if (game.game_over()) {
      finishGame(randomHex, 1, "");
      setIsWin(true);
      setTimeout(() => {
        setIsKill(false);
      }, 6000);
    }
    makeMove(randomHex, game.fen());

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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "white", textAlign: "center" }}>Player</h1>
          {isKill ? (
            <img
              src={Celebration}
              width={400}
              height={400}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            ></img>
          ) : isWin ? (
            <img
              src={Celebration}
              width={400}
              height={400}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            ></img>
          ) : (
            <img
              src={Idle}
              width={400}
              height={400}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            ></img>
          )}
        </div>

        <div
          style={{
            width: "400px",
            height: "400px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Chessboard
            id="PlayVsRandom"
            position={game.fen()}
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            dropOffBoardAction={() => {
              setIsKill(true);
              setTimeout(() => {
                setIsKill(false);
              }, 6000);
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
        <div>
          <h1 style={{ color: "white" }}>AI</h1>
          {isKill ? (
            <img
              src={Lost}
              width={400}
              height={400}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            ></img>
          ) : isWin ? (
            <img
              src={Lost}
              width={400}
              height={400}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            ></img>
          ) : (
            <img
              src={Idle}
              width={400}
              height={400}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            ></img>
          )}
        </div>
      </div>
    </>
  );
};
export default GamePage;
