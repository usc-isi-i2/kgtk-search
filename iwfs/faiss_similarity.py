import os
import gzip
import faiss
from glob import glob
import numpy as np
from utils import Utils
from sklearn.metrics.pairwise import cosine_similarity
from compute_embedding_vectors import ComputeEmbeddings


class FAISSIndex(object):
    def __init__(self, text_embedding_path, labels_file_path):
        self.text_embedding_path = text_embedding_path
        self.index = None
        self.qnode_to_vector_dict = {}
        self.qnode_to_label_dict = Utils.create_labels_dict(labels_file_path)
        self.qnode_to_sentence_dict = {}
        self.ce = ComputeEmbeddings()

    def build_index(self):
        if os.path.isdir(self.text_embedding_path):
            file_list = glob(f'{self.text_embedding_path}/*')
        else:
            file_list = [self.text_embedding_path]

        for text_embedding_file in file_list:
            print('Processing file: {}'.format(text_embedding_file))
            if text_embedding_file.endswith(".gz"):
                f = gzip.open(text_embedding_file, mode='rt')
            else:
                f = open(text_embedding_file)

            ids = []
            vectors = []
            for line in f:
                vals = line.split('\t')
                if vals[0].startswith('Q'):
                    qnode = vals[0]
                    # use the number part of Qnodes as id
                    id = int(qnode[1:])
                    if vals[1] == 'embedding_sentence':
                        self.qnode_to_sentence_dict[qnode] = vals[2]
                    if vals[1] == 'text_embedding':
                        x = vals[2].strip().split(',')
                        x = [np.float32(r) for r in x]
                        self.qnode_to_vector_dict[qnode] = np.array([x])
                        ids.append(id)
                        vectors.append(x)
                        index = faiss.IndexFlatL2(len(x))
                        if self.index is None:
                            self.index = faiss.IndexIDMap(index)

            self.index.add_with_ids(np.array(vectors), np.array(ids))

    def nearest_neighbors(self, query_qnode, k=5, debug=False):
        if query_qnode not in self.qnode_to_vector_dict:
            return None
        results = []
        d, i = self.index.search(self.qnode_to_vector_dict[query_qnode], k+1)
        for h, g in enumerate(i[0]):
            qnode = f'Q{g}'
            if query_qnode != qnode:
                _ = {
                    'sim': float(d[0][h]),
                    'qnode1': query_qnode,
                    'qnode1_label': self.qnode_to_label_dict.get(query_qnode, ''),
                    'qnode2': qnode,
                    'qnode2_label': self.qnode_to_label_dict.get(qnode, '')
                }
                if debug:
                    _['qnode1_sentence'] = self.qnode_to_sentence_dict[query_qnode]
                    _['qnode2_sentence'] = self.qnode_to_sentence_dict[qnode]
                results.append(_)

        return results

    def nearest_neighbor_sentence(self, sentence, k=5, debug=False):
        sentence_vector = self.ce.get_vectors(sentence)
        results = []

        d, i = self.index.search(sentence_vector, k+1)
        for h, g in enumerate(i[0]):
            qnode = f'Q{g}'
            _ = {
                'sim': float(d[0][h]),
                'input_sentence': sentence,
                'qnode': qnode,
                'qnode_label': self.qnode_to_label_dict.get(qnode, '')
            }
            if debug:
                _['qnode_sentence'] = self.qnode_to_sentence_dict[qnode]

            results.append(_)
        return results

    def nearest_neighbors_batch(self, query_qnodes, k=5, debug=False):
        if not isinstance(query_qnodes, list):
            query_qnodes = [query_qnodes]

        query_vectors = [self.qnode_to_vector_dict[q][0] for q in query_qnodes]
        query_vectors = np.array(query_vectors)
        results = []
        distances, ids = self.index.search(query_vectors, k+1)
        for q_id_index, nns in enumerate(ids):
            qnode = query_qnodes[q_id_index]
            for i, nn in enumerate(nns):
                qnode2 = f'Q{ids[q_id_index][i]}'
                if qnode != qnode2:
                    _ = {
                        'sim': float(distances[q_id_index][i]),
                        'qnode1': qnode,
                        'qnode1_label': self.qnode_to_label_dict.get(qnode, ""),
                        'qnode2': qnode2,
                        'qnode2_label': self.qnode_to_label_dict.get(qnode2, "")
                    }
                    if debug:
                        _['qnode1_sentence'] = self.qnode_to_sentence_dict.get(qnode, "")
                        _['qnode2_sentence'] = self.qnode_to_sentence_dict.get(qnode2, "")
                    results.append(_)

        return results

    def compute_cosine_similarity(self, qnode1, qnode2):
        if qnode1 not in self.qnode_to_vector_dict or qnode2 not in self.qnode_to_vector_dict:
            return -1
        sim = cosine_similarity(self.qnode_to_vector_dict[qnode1], self.qnode_to_vector_dict[qnode2])[0][0]
        return {
            'sim': sim,
            'qnode1_label': self.qnode_to_label_dict[qnode1],
            'qnode1_sentence': self.qnode_to_sentence_dict[qnode1],
            'qnode2_label': self.qnode_to_label_dict[qnode2],
            'qnode2_sentence': self.qnode_to_sentence_dict[qnode2]
        }
