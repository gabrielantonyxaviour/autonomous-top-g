// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { GameMoves ,GameMovesData,NFTs,Record,RecordData} from "../codegen/Tables.sol";
import {Color,GameState} from "../codegen/Types.sol";
contract GameStateManagementSystem is System {

  string public constant initFenCode = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  function addressToBytes32(address _address)internal pure returns(bytes32)
  {
    return bytes32(uint256(uint160(_address)));
  }


  function setGameInit(bytes32 gameId,uint playerColor)public{
    require(GameMoves.getState(gameId)==GameState.DOES_NOT_EXIST,"Game already exists");
    GameMoves.set(gameId,Color.WHITE,playerColor==0?Color.WHITE:Color.BLACK,addressToBytes32(_msgSender()),GameState.ONGOING,initFenCode);
  }

  function playTurn(bytes32 gameId, string memory fenCode) public {
    GameMovesData memory game=GameMoves.get(gameId);
    require(GameMoves.getState(gameId)==GameState.ONGOING,"Game is not ongoing");

    // if(addressToBytes32(_msgSender())==GameMoves.getPlayerAddress(gameId))
    // {
    //   require(GameMoves.getTurn(gameId)==GameMoves.getPlayerColor(gameId),"Not your turn");
    // }else{
    //   require(GameMoves.getTurn(gameId)!=GameMoves.getPlayerColor(gameId),"Not your turn");
    // }
      GameMoves.setFenCode(gameId,fenCode);
      GameMoves.setTurn(gameId,game.turn==Color.WHITE?Color.BLACK:Color.WHITE);
  }

  function endGame(bytes32 gameId,Color winner,string memory ipfsHash)public 
  {
    RecordData memory record=Record.get(addressToBytes32(_msgSender()));

    // require(GameMoves.getState(gameId)==GameState.ONGOING,"Game is not ongoing");
    if(GameMoves.getPlayerColor(gameId)==winner)
    {
      GameMoves.setState(gameId, GameState.WON);
      NFTs.set(addressToBytes32(_msgSender()), gameId, ipfsHash);
    Record.setWins(addressToBytes32(_msgSender()), record.wins++);

    }else{
      GameMoves.setState(gameId, GameState.LOST);
      Record.setLosses(addressToBytes32(_msgSender()), record.losses++);
    }
  }
}
