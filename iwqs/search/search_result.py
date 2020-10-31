from typing import List


class SearchResult(object):
    def __init__(self, qnode: str, label: List[str], alias: List[str], description: List[str], pagerank: float):
        self.qnode = qnode
        self.label = label
        self.alias = alias
        self.description = description
        self.pagerank = pagerank

    def to_json(self, extra_info=False):
        r = {
            'qnode': self.qnode,
            'description': self.description
        }
        if extra_info:
            r['label'] = self.label
            r['alias'] = self.alias
            r['pagerank'] = self.pagerank
        return r
