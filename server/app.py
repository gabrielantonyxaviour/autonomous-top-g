import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask.helpers import send_from_directory
from game import play
from db import getGame, setGame
import traceback

import chess
import chess.svg
from collections import OrderedDict
from operator import itemgetter
import pandas as pd
import numpy as np
import tensorflow as tf
from game import human_play_turn, ai_play_turn, draw_board

app = Flask(__name__, static_url_path="", static_folder=".")
app.config["CORS_HEADERS"] = "Content-Type"

# Load environment variables
load_dotenv()


@app.after_request
def after_request_func(response):
    # CORS section
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response


def play_game(turn, current_board, move_uci=None):
    """Play through the whole game

    Keyword arguments:
    turn -- True for A.I plays first
    current_board -- chess.Board()
    """
    if current_board.is_stalemate():
        print("Stalemate: both A.I and human win")
        return
    else:
        if not turn:
            if not current_board.is_checkmate():
                human_play_turn(current_board, move_uci)
                turn = not turn
                board = current_board
                setGame(board.fen(), turn)
                return board.fen()
            else:
                draw_board(current_board)
                print("A.I wins")
                setGame(current_board.fen(), turn)
                return current_board.fen()
        else:
            if not current_board.is_checkmate():
                ai_play_turn(current_board)
                turn = not turn
                board = current_board
                setGame(board.fen(), turn)
                return board.fen()
            else:
                draw_board(current_board)
                print("Human wins")
                setGame(current_board.fen(), turn)
                return current_board.fen()


@app.route("/new-chess", methods=["POST"])
def new_game_controller():
    try:
        board = chess.Board()
        setGame(board.fen(), False)
        game = getGame()
        # insert record in database
        res = jsonify(game)
        res.status_code = 200
        return res
    except Exception as e:
        print(e)


@app.route("/play", methods=["POST"])
def player_controller():
    try:
        _form = request.form
        _source = _form["source"]
        _destination = _form["destination"]

        game = getGame()
        board = chess.Board(game["board"])
        turn = game["turn"]

        play_game(turn, board, _source + _destination)
        game = getGame()
        res = jsonify(game)
        res.status_code = 200
        return res
    except Exception as e:
        print(e)


@app.route("/game", methods=["GET"])
def game_controller():
    # Sample route with a method handlers and a view function
    try:
        game = getGame()
        res = jsonify(game)
        res.status_code = 200
        return res
    except Exception as e:
        print(e)


# ... and more endpoints here


# 404 handler
@app.errorhandler(404)
def not_found(error=None):
    message = {
        "status": 404,
        "message": "There is no record: " + request.url,
    }
    res = jsonify(message)
    res.status_code = 404
    return res


# 403 handler
@app.errorhandler(403)
def forbidden(error=None):
    message = {
        "status": 403,
        "message": "Forbidden",
    }
    res = jsonify(message)
    res.status_code = 403
    return res


# 500 handler
@app.errorhandler(500)
def internal_server_error(error=None):
    message = {
        "status": 500,
        "message": "Failed to process request",
    }
    res = jsonify(message)
    res.status_code = 500
    traceback.print_exc()
    return res


@app.route("/")
def home_page():
    try:
        res = "<h1 style='position: fixed; top: 50%;  left: 50%; transform: translate(-50%, -50%);text-align:center'>FLASK API HOME<p>If you are seeing this page, Good Job. Your Flask app is ready! Add your endpoints in the /routes directory.</p></h1>"
        return res

    except Exception as e:
        print(e)


# Setting Favicon
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000, threaded=True, use_reloader=True)
