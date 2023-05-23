// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("Record")));
bytes32 constant RecordTableId = _tableId;

struct RecordData {
  uint256 wins;
  uint256 losses;
}

library Record {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](2);
    _schema[0] = SchemaType.UINT256;
    _schema[1] = SchemaType.UINT256;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.BYTES32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](2);
    _fieldNames[0] = "wins";
    _fieldNames[1] = "losses";
    return ("Record", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get wins */
  function getWins(bytes32 player) internal view returns (uint256 wins) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get wins (using the specified store) */
  function getWins(IStore _store, bytes32 player) internal view returns (uint256 wins) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set wins */
  function setWins(bytes32 player, uint256 wins) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((wins)));
  }

  /** Set wins (using the specified store) */
  function setWins(IStore _store, bytes32 player, uint256 wins) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((wins)));
  }

  /** Get losses */
  function getLosses(bytes32 player) internal view returns (uint256 losses) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get losses (using the specified store) */
  function getLosses(IStore _store, bytes32 player) internal view returns (uint256 losses) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set losses */
  function setLosses(bytes32 player, uint256 losses) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked((losses)));
  }

  /** Set losses (using the specified store) */
  function setLosses(IStore _store, bytes32 player, uint256 losses) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked((losses)));
  }

  /** Get the full data */
  function get(bytes32 player) internal view returns (RecordData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store, bytes32 player) internal view returns (RecordData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(bytes32 player, uint256 wins, uint256 losses) internal {
    bytes memory _data = encode(wins, losses);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(IStore _store, bytes32 player, uint256 wins, uint256 losses) internal {
    bytes memory _data = encode(wins, losses);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(bytes32 player, RecordData memory _table) internal {
    set(player, _table.wins, _table.losses);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, bytes32 player, RecordData memory _table) internal {
    set(_store, player, _table.wins, _table.losses);
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (RecordData memory _table) {
    _table.wins = (uint256(Bytes.slice32(_blob, 0)));

    _table.losses = (uint256(Bytes.slice32(_blob, 32)));
  }

  /** Tightly pack full data using this table's schema */
  function encode(uint256 wins, uint256 losses) internal view returns (bytes memory) {
    return abi.encodePacked(wins, losses);
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(bytes32 player) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));
  }

  /* Delete all data for given keys */
  function deleteRecord(bytes32 player) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, bytes32 player) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((player));

    _store.deleteRecord(_tableId, _keyTuple);
  }
}
