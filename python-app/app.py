import json
import jwt
import sqlite3

from flask import Flask, make_response, render_template, request, redirect, current_app, g

app = Flask(__name__)


config = {}

with open('../config.json', 'r') as config_file:
    config = json.loads(config_file.read())


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            '../sqlite.db',
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


@app.route("/")
def index():
    res = make_response(render_template('index.html'))
    return res


@app.route("/authorized")
def hello():
    token = request.cookies.get('token')

    if not token:
        return redirect('/')

    if token:
        token_data = jwt.decode(request.cookies.get(
            'token'), config.get('secret'))

        user_exists = get_db().execute('SELECT * from users where username = ? and email = ?',
                                      (token_data.get('username'), token_data.get('email'),)).fetchone()

        if user_exists:
            res = make_response(render_template('authorized.html'))
        else:
            res = make_response(render_template('index.html'))

    return res
