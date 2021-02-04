from flask_restful import Resource
from iwqs.search.search_config import es_url, es_index
from iwqs.search.es_search import Search
from flask import request
from iwqs.search.search_result import SearchResult
import json


class FindNearestQnodes(Resource):
    def get(self, search_term):
        lowercase = request.args.get('lowercase', 'true').lower() == 'true'
        user_es_url = request.args.get('es_url', None)
        user_es_index = request.args.get('es_index', None)
        language = request.args.get('language', None)
        query_type = request.args.get('type', 'ngram')
        item = request.args.get('item', 'qnode')
        instance_of = request.args.get('instance_of', None)

        if user_es_url and user_es_index:
            es_search = Search(user_es_url, user_es_index)
        else:
            es_search = Search(es_url, es_index)

        size = request.args.get('size', 20)
        extra_info = request.args.get('extra_info', 'false').lower() == 'true'

        if item == 'qnode':
            if query_type == 'ngram':
                query = es_search.create_ngram_query(search_term, size=size, language=language, instance_of=instance_of)
            else:
                query = es_search.create_exact_match_query(search_term, lowercase, size=size, language=language,
                                                           instance_of=instance_of)
        else:
            query = es_search.create_property_query(search_term, size=size, query_type=query_type,
                                                    instance_of=instance_of)

        results = es_search.search_es(query)
        r_objs = []

        lang = language if language else 'en'

        for result in results:
            source = result['_source']
            labels = []
            aliases = []
            descriptions = []

            if lang in source['labels']:
                labels = source['labels'][lang]
            elif len(list(source['labels'])) > 0:
                labels = source['labels'][list(source['labels'])[0]]

            if lang in source['aliases']:
                aliases = source['aliases'][lang]
            elif len(list(source['aliases'])) > 0:
                aliases = source['aliases'][list(source['aliases'])[0]]

            if lang in source['descriptions']:
                descriptions = source['descriptions'][lang]
            elif len(list(source['descriptions'])) > 0:
                descriptions = source['descriptions'][list(source['descriptions'])[0]]

            data_type = source.get('data_type', None)

            r_objs.append(SearchResult(source['id'],
                                       labels,
                                       aliases,
                                       descriptions,
                                       source['pagerank'],
                                       data_type=data_type))

        return [x.to_json(extra_info=extra_info) for x in r_objs]
