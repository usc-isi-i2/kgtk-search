import os
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_pymongo import PyMongo
from app_config import host, port
from iwqs.search.main import FindNearestQnodes
from iwqs.slack.main import SlackEvents
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
api.add_resource(SlackEvents, '/api/slack/events')
api.add_resource(FindNearestQnodes, '/api')

if __name__ == '__main__':
    app.run(host=host, port=port)
