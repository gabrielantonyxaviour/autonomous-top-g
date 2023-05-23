import json


def setGame(board, turn):
    # Open the board.db file as writable
    with open("board.db", "w") as f:
        # Write the board to the file
        f.write(json.dumps({"board": board, "turn": turn}))
        # Close the file
        f.close()


def getGame():
    # Open the board.db file as readable
    with open("board.db", "r") as f:
        # Read the board from the file
        board = f.read()
        # Close the file
        f.close()
        return json.loads(board)
