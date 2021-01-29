from typing import List


class SearchResult(object):
    def __init__(self, qnode: str, label: List[str], alias: List[str], description: List[str], pagerank: float,
                 data_type: str = None):
        self.qnode = qnode
        self.label = label
        self.alias = alias
        self.description = description
        self.pagerank = pagerank
        self.data_type = data_type

    def to_json(self, extra_info=False):
        r = {
            'qnode': self.qnode,
            'description': self.description
        }
        if extra_info:
            r['label'] = self.label
            r['alias'] = self.alias
            r['pagerank'] = self.pagerank
            if self.data_type:
                r['data_type'] = self.data_type
        return r
