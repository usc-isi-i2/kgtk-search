import copy
import requests
import logging
from requests.auth import HTTPBasicAuth
from iwqs.query.exact_match_query import query
from iwqs.query.ngram_query import ngram_query


class Search(object):
    def __init__(self, es_url, es_index, es_user=None, es_pass=None):
        self.es_url = es_url
        self.es_index = es_index
        self.es_user = es_user
        self.es_pass = es_pass
        self.query = copy.deepcopy(query)
        self.ngram_query = copy.deepcopy(ngram_query)
        self.logger = logging.getLogger(__name__)

    def search_es(self, query):
        es_search_url = '{}/{}/_search'.format(self.es_url, self.es_index)

        # return the top matched QNode using ES
        if self.es_user and self.es_pass:
            response = requests.post(es_search_url, json=query, auth=HTTPBasicAuth(self.es_user, self.es_pass))
        else:
            response = requests.post(es_search_url, json=query)

        if response.status_code == 200:
            response_output = response.json()['hits']['hits']
        else:
            response_output = None
            self.logger.error("Query ES error with response {}!".format(response.status_code))
            self.logger.error(response.json())

        return response_output

    def create_exact_match_query(self, search_term, lower_case, size=20, language=None):
        exact_match_query = self.query

        if language is not None:
            search_field = f'all_labels.{language}'
        else:
            search_field = f'all_labels_aliases'
        if not lower_case:
            search_field += '.keyword'
        else:
            search_field += '.keyword_lower'

        if lower_case:
            search_term = search_term.lower()

        exact_match_query['query']['function_score']['query']['bool']['should'][0]['term'] = {
            search_field: {
                'value': search_term
            }
        }
        exact_match_query['size'] = size
        return exact_match_query

    def create_ngram_query(self, search_term, language='en', size=20):
        query_part = {
            "query": search_term,
            "operator": "and"
        }

        search_field = f'all_labels.{language}.ngram'
        ngrams_query = self.ngram_query
        ngrams_query['query']['function_score']['query']['bool']['should'][0]['match'][search_field] = query_part
        ngrams_query['size'] = size
        return ngrams_query
