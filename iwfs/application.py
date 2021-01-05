import json
import traceback
from flask import Flask
from flask import request
from flask_cors import CORS
from faiss_similarity import FAISSIndex
from app_config import TEXT_EMBEDDING_LARGE_ALL, WIKI_LABELS

app = Flask(__name__)
CORS(app)

fi = FAISSIndex(TEXT_EMBEDDING_LARGE_ALL, WIKI_LABELS)
fi.build_index()


@app.route('/similarity/faiss/nn/<qnode>', methods=['GET'])
def faiss_nn(qnode):
    try:
        k = int(request.args.get("k", 5)) + 1
        debug = request.args.get("debug", "false").lower() == 'true'
        results = fi.nearest_neighbors(qnode, k, debug=debug)
        if results is None:
            return {'Message': f'Qnode:{qnode} not found in the similarity index'}, 404
        return json.dumps(results), 200
    except Exception as e:
        traceback.print_exc()
        return {'Error': str(e)}, 500


@app.route('/similarity/faiss/nn/sentence/<sentence>', methods=['GET'])
def faiss_nn_sentence(sentence):
    try:
        k = int(request.args.get("k", 5))
        debug = request.args.get("debug", "false").lower() == 'true'
        results = fi.nearest_neighbor_sentence(sentence, k, debug=debug)
        return json.dumps(results), 200
    except Exception as e:
        traceback.print_exc()
        return {'Error': str(e)}, 500


@app.route('/')
def is_alive():
    return 'hello from Qnode Similarity', 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6733)
