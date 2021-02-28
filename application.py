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
                "type": "mrkdwn",
                "text": "*Top 10 search results for the query:*\n\n{}".format(data['search_term']),
            }
        }, {
            "type": "divider"
        }]

        # add various search parameters to the slack modal
        search_params = ""
        if 'language' in data and data['language']:
            search_params += "\nLanguage: {}".format(data['language'])
        if 'query_type' in data and data['query_type']:
            search_params += "\nQuery Type: {}".format(data['query_type'])
        if 'item' in data and data['item']:
            search_params += "\nSearch: {}".format(data['item'])
        if 'is_class' in data and data['is_class']:
            search_params += "\nClasses only: {}".format(data['is_class'])
        if 'instance_of' in data and data['instance_of']:
            search_params += "\nInstance Of: {}".format(data['instance_of'])
        if search_params:
            blocks.append({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Search Parameters:*\n{}".format(search_params)
                }
            })
            blocks.append({"type": "divider"})

        # add search results to the slack modal
        if 'results' in data and data['results']:
            num_results = len(data['results'])
            blocks.append({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Top {} search results:*\n\n".format(num_results)
                }
            })
            for index, result in enumerate(data['results']):
                result_text = "{}. ".format(index + 1)
                if 'label' in result and result['label']:
                    result_text += "{}".format(result['label'][0])
                if 'qnode' in result and result['qnode']:
                    result_text += " ({})".format(result['qnode'])
                if 'description' in result and result['description']:
                    result_text += "\n{}".format(result['description'][0])
                if 'pagerank' in result and result['pagerank']:
                    result_text += "\nScore: {}".format(str(result['pagerank']))
                blocks.append({
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "{}".format(result_text)
                    },
                })

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
