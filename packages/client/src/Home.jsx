import React from "react";
import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { useState } from "react";
import Hero from "./assets/hero.gif";
function generateRandomHex() {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hex;
}
const Home = () => {
  const {
    components: { GameMoves, Record, NFTs },
    systemCalls: { createGame, makeMove, finishGame },
  } = useMUD();
  const [randomHex, setRandomHex] = useState(generateRandomHex());
  const [fenCode, setFenCode] = useState("");
  return (
    <div className="text-white max-w-[1200px] mx-auto select-custom min-h-screen">
      <div
        className="flex flex-col items-center justify-center"
        style={{ flexDirection: "column" }}
      >
        <img
          src={Hero}
          width={400}
          height={400}
          style={{ margin: "100px" }}
        ></img>
        <button
          className="text-white bg-yellow-700 rounded-xl p-3"
          onClick={async () => {
            window.location.href = `http://localhost:3000/game`;
          }}
          style={{
            background: "rgb(161 98 7)",
            margin: "16px",
            padding: "16px",
          }}
        >
          Create Game
        </button>
        {/* <p style={{ margin: "15px" }}>Enter your FEN Code</p>
        <input
          type="text"
          value={fenCode}
          onChange={(e) => {
            setFenCode(e.target.value);
          }}
          style={{
            margin: "16px",
            color: "black",
            padding: "16px",
          }}
        />
        <button
          className="text-white bg-yellow-700 rounded-xl p-3"
          onClick={async () => {
            await makeMove(
              randomHex,
              "r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 0 1"
            );
          }}
          style={{
            background: "rgb(161 98 7)",
            margin: "16px",
            padding: "16px",
          }}
        >
          Play Turn
        </button>
        <button
          className="text-white bg-yellow-700 rounded-xl p-3"
          onClick={async () => {
            await finishGame(
              randomHex,
              0,
              "https://bafkreickhtgvmkibcufhfoopnvsaryu7jmvik3e5w333r7i2xoahcxqsoi.ipfs.nftstorage.link/"
            );
          }}
          style={{
            background: "rgb(161 98 7)",
            margin: "16px",
            padding: "16px",
          }}
        >
          End Game as Winner
        </button> */}
      </div>
    </div>
  );
};

export default Home;
