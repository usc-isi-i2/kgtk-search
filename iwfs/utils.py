import gzip
from time import time


class Utils(object):

    @staticmethod
    def create_labels_dict(labels_file):
        s = time()
        if labels_file.endswith(".gz"):
            f = gzip.open(labels_file, mode='rt')
        else:
            f = open(labels_file)
        labels_dict = {}
        for row in f:
            vals = row.strip().split('\t')
            if 'node1' in vals and 'node2' in vals:
                node1_index = vals.index('node1')
                node2_index = vals.index('node2')
            else:
                labels_dict[vals[node1_index]] = vals[node2_index].split('@')[0]
        print(f'Time taken to create labels dict: {time() - s}')
        return labels_dict
