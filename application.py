import os
import json
from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
from flask_restful import Api
from flask_pymongo import PyMongo
from iwqs.search.main import FindNearestQnodes
from app_config import host, port
from slack import WebClient


app = Flask(__name__)
CORS(app)


# Set the APP_SECRET key
app.secret_key = os.environ.get('APP_SECRET', '')


# Add mongo db settings for logging
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://0.0.0.0:27017/kgtk')
app.config["MONGO_URI"] = MONGO_URI
app.mongo = PyMongo(app)


# Slack api settings
SLACK_TOKEN = os.environ.get('SLACK_TOKEN', '')
app.slack_client = WebClient(SLACK_TOKEN)


api = Api(app)
api.add_resource(FindNearestQnodes, '/api/<string:search_term>')


@app.route('/events', methods=['POST'])
def events():
    """
    Handles incoming slack events
    """
    data = json.loads(request.values.get('payload'))
    data_id = data['actions'][0]['value']
    trigger_id = data.get('trigger_id')
    return jsonify({'ok': True})


if __name__ == '__main__':
    app.run(host=host, port=port)
