import copy
import requests
import logging
from requests.auth import HTTPBasicAuth
from iwqs.query.exact_match_query import query
from iwqs.query.ngram_query import ngram_query
from iwqs.query.query_property import query_property


class Search(object):
    def __init__(self, es_url, es_index, es_user=None, es_pass=None):
        self.es_url = es_url
        self.es_index = es_index
        self.es_user = es_user
        self.es_pass = es_pass
        self.query = copy.deepcopy(query)
        self.ngram_query = copy.deepcopy(ngram_query)
        self.query_property = copy.deepcopy(query_property)
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

    def create_exact_match_query(self, search_term, lower_case, size=20, language=None, instance_of=''):
        exact_match_query = self.query
        instance_of_part = None
        if instance_of.strip():
            instance_of_part = {
                "term": {
                    "instance_ofs.keyword_lower": {
                        "value": instance_of.lower()
                    }
                }
            }

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

        query_part = {
            "term": {
                search_field: {
                    'value': search_term
                }
            }
        }

        exact_match_query['query']['function_score']['query']['bool']['must'].append(query_part)

        if instance_of_part is not None:
            exact_match_query['query']['function_score']['query']['bool']['must'].append(instance_of_part)

        exact_match_query['size'] = size

        return exact_match_query

    def create_ngram_query(self, search_term, language='en', size=20, instance_of=''):
        search_field = f'all_labels.{language}.ngram'
        instance_of_part = None
        query_part = {
            "match": {
                search_field: {
                    "query": search_term,
                    "operator": "and"
                }
            }
        }
        if instance_of.strip():
            instance_of_part = {
                "term": {
                    "instance_ofs.keyword_lower": {
                        "value": instance_of.lower()
                    }
                }
            }

        ngrams_query = self.ngram_query
        ngrams_query['query']['function_score']['query']['bool']['must'].append(query_part)

        if instance_of_part is not None:
            ngrams_query['query']['function_score']['query']['bool']['must'].append(instance_of_part)

        ngrams_query['size'] = size

        return ngrams_query

    def create_property_query(self, search_term, size='20', query_type='ngram', instance_of=''):
        instance_of_part = None
        if instance_of.strip():
            instance_of_part = {
                "term": {
                    "instance_ofs.keyword_lower": {
                        "value": instance_of.lower()
                    }
                }
            }
        search_term = search_term.lower()

        if query_type == 'ngram':
            search_field = 'all_labels.en.ngram'
            query_part = {
                "match": {
                    search_field: {
                        "query": search_term,
                        "operator": "and"
                    }
                }
            }
        else:
            search_field = 'all_labels.en.keyword_lower'
            query_part = {
                "term": {
                    search_field: search_term
                }
            }

        exists_part = {
            "exists": {
                "field": "data_type"
            }
        }

        _property_query = self.query_property
        _property_query['query']['function_score']['query']['bool']['must'].append(query_part)

        _property_query['query']['function_score']['query']['bool']['must'].append(exists_part)

        if instance_of_part is not None:
            _property_query['query']['function_score']['query']['bool']['must'].append(instance_of_part)

        _property_query['size'] = size
        
        return _property_query
