from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from iwqs.search.main import FindNearestQnodes
from app_config import host, port

app = Flask(__name__)
CORS(app)

# Set the APP_SECRET key
app.secret_key = os.environ.get('APP_SECRET', '')

api = Api(app)
api.add_resource(FindNearestQnodes, '/api/<string:search_term>')

if __name__ == '__main__':
    app.run(host=host, port=port)
