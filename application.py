import os
import json
from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
from flask_restful import Api
from flask_pymongo import PyMongo
from bson import ObjectId
from app_config import host, port
from iwqs.search.main import FindNearestQnodes
from slack import WebClient
from slack.errors import SlackApiError


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


def open_modal(data_id, trigger_id):
    data = app.mongo.db.search.find_one(ObjectId(data_id))

    # show an error message if there is no data
    if not data:
        blocks = [{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Err.. can't find this query in our logs :("
            },
        }]
    else:
        blocks = [{
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": "Top 10 search results for the query:\n\n{}".format(data['search_term']),
                "emoji": True
            }
        }, {
            "type": "divider"
        }]

    # Dump blocks into a string with json
    view = json.dumps({
        "type": "modal",
        "title": {
            "type": "plain_text",
            "text": "Search Results",
            "emoji": True
        },
        "blocks": json.dumps(blocks)
    })

    try:
        app.slack_client.api_call(
            api_method='views.open',
            json={
                'trigger_id': trigger_id,
                'view': view,
            },
        )
    except SlackApiError as e:
        print('Slack error: {}'.format(e))


@app.route('/events', methods=['POST'])
def events():
    """
    Handles incoming slack events
    """
    data = json.loads(request.values.get('payload'))
    data_id = data['actions'][0]['value']
    trigger_id = data.get('trigger_id')
    open_modal(data_id, trigger_id)
    return jsonify({'ok': True})


if __name__ == '__main__':
    app.run(host=host, port=port)
