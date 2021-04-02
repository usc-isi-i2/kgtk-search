import os
import json
from datetime import datetime
from flask import current_app
from flask_restful import Resource
from slack.errors import SlackApiError
from iwqs.search.search_config import es_url, es_index
from iwqs.search.es_search import Search
from flask import request
from iwqs.search.search_result import SearchResult


class FindNearestQnodes(Resource):
    def get(self, search_term):
        lowercase = request.args.get('lowercase', 'true').lower() == 'true'
        user_es_url = request.args.get('es_url', None)
        user_es_index = request.args.get('es_index', None)
        language = request.args.get('language', None)
        query_type = request.args.get('type', 'ngram')
        item = request.args.get('item', 'qnode')
        instance_of = request.args.get('instance_of', '')
        is_class = request.args.get('is_class', 'false').lower().strip() == 'true'

        if user_es_url and user_es_index:
            es_search = Search(user_es_url, user_es_index)
        else:
            es_search = Search(es_url, es_index)

        size = request.args.get('size', 20)
        extra_info = request.args.get('extra_info', 'false').lower().strip() == 'true'

        is_production = os.environ.get('KGTK_SEARCH_PRODUCTION', 'false').lower() == 'true'

        if is_production:
            # Log the search in our mongo db
            timestamp = datetime.now().isoformat()
            logged_entry = current_app.mongo.db.search.insert_one({
                'created_at': timestamp,
                'search_term': search_term,
                'extra_info': extra_info,
                'query_type': query_type,
                'instance_of': instance_of,
                'is_class': is_class,
                'lowercase': language,
                'user_es_url': user_es_url,
                'user_es_index': user_es_index,
                'language': language,
                'item': item,
                'size': size,
            })

            # Send a message to slack with the search query
            text = 'New search query on KGTK!'
            blocks = [{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*{}*".format(text),
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "View search results",
                        "emoji": True
                    },
                    "value": str(logged_entry.inserted_id),
                },
            }, {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "> {}".format(
                        search_term,
                    )},
            }]

            try:
                current_app.slack_client.api_call(
                    api_method='chat.postMessage',
                    json={
                        'channel': '#kgtk-search',
                        'text': text,
                        'blocks': json.dumps(blocks),
                    },
                )
            except SlackApiError as e:
                print('Slack error: {}'.format(e))

        # if is_class:
        #     query = es_search.create_ngram_query(search_term, size=size, language=language, instance_of='',
        #                                          is_class=is_class)
        if item == 'qnode':
            if query_type == 'ngram':
                query = es_search.create_ngram_query(search_term, size=size, language=language, instance_of=instance_of,
                                                     is_class=is_class)
            else:
                query = es_search.create_exact_match_query(search_term, lowercase, size=size, language=language,
                                                           instance_of=instance_of)
        else:
            query = es_search.create_property_query(search_term, size=size, query_type=query_type,
                                                    instance_of=instance_of)

        r_objs = []
        results = es_search.search_es(query)
        if not results:
            return r_objs

        lang = language if language else 'en'

        for result in results:
            source = result['_source']
            score = result['_score']
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

            statements = source.get('statements', 1)

            r_objs.append(SearchResult(source['id'],
                                       labels,
                                       aliases,
                                       descriptions,
                                       source['pagerank'],
                                       data_type=data_type,
                                       statements=statements,
                                       score=score))

        # update our mongo db log entry with top 10 results
        if is_production:
            top10results = [{
                'qnode': r_obj.qnode,
                'label': r_obj.label,
                'pagerank': r_obj.pagerank,
                'description': r_obj.description,
            } for r_obj in r_objs[:10]]
            update = current_app.mongo.db.search.update_one(
                {"_id": logged_entry.inserted_id},
                {'$set': {'results': top10results}}
            )

        return [x.to_json(extra_info=extra_info) for x in r_objs]


class FindNearestQnodes2(Resource):
    def get(self):
        search_term = request.args.get('q', None)
        if search_term is None:
            return {'error': 'The url parameter "q" is required'}

        lowercase = request.args.get('lowercase', 'true').lower() == 'true'
        user_es_url = request.args.get('es_url', None)
        user_es_index = request.args.get('es_index', None)
        language = request.args.get('language', None)
        query_type = request.args.get('type', 'ngram')
        item = request.args.get('item', 'qnode')
        instance_of = request.args.get('instance_of', '')
        is_class = request.args.get('is_class', 'false').lower().strip() == 'true'

        if user_es_url and user_es_index:
            es_search = Search(user_es_url, user_es_index)
        else:
            es_search = Search(es_url, es_index)

        size = request.args.get('size', 20)
        extra_info = request.args.get('extra_info', 'false').lower().strip() == 'true'

        is_production = os.environ.get('KGTK_SEARCH_PRODUCTION', 'false').lower() == 'true'

        if is_production:
            # Log the search in our mongo db
            timestamp = datetime.now().isoformat()
            logged_entry = current_app.mongo.db.search.insert_one({
                'created_at': timestamp,
                'search_term': search_term,
                'extra_info': extra_info,
                'query_type': query_type,
                'instance_of': instance_of,
                'is_class': is_class,
                'lowercase': language,
                'user_es_url': user_es_url,
                'user_es_index': user_es_index,
                'language': language,
                'item': item,
                'size': size,
            })

            # Send a message to slack with the search query
            text = 'New search query on KGTK!'
            blocks = [{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*{}*".format(text),
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "View search results",
                        "emoji": True
                    },
                    "value": str(logged_entry.inserted_id),
                },
            }, {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "> {}".format(
                        search_term,
                    )},
            }]

            try:
                current_app.slack_client.api_call(
                    api_method='chat.postMessage',
                    json={
                        'channel': '#kgtk-search',
                        'text': text,
                        'blocks': json.dumps(blocks),
                    },
                )
            except SlackApiError as e:
                print('Slack error: {}'.format(e))

        # if is_class:
        #     query = es_search.create_ngram_query(search_term, size=size, language=language, instance_of='',
        #                                          is_class=is_class)
        if item == 'qnode':
            if query_type == 'ngram':
                query = es_search.create_ngram_query(search_term, size=size, language=language, instance_of=instance_of,
                                                     is_class=is_class)
            else:
                query = es_search.create_exact_match_query(search_term, lowercase, size=size, language=language,
                                                           instance_of=instance_of)
        else:
            query = es_search.create_property_query(search_term, size=size, query_type=query_type,
                                                    instance_of=instance_of)

        r_objs = []
        results = es_search.search_es(query)
        if not results:
            return r_objs

        lang = language if language else 'en'

        for result in results:
            source = result['_source']
            score = result['_score']
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

            statements = source.get('statements', 1)

            r_objs.append(SearchResult(source['id'],
                                       labels,
                                       aliases,
                                       descriptions,
                                       source['pagerank'],
                                       data_type=data_type,
                                       statements=statements,
                                       score=score))

        # update our mongo db log entry with top 10 results
        if is_production:
            top10results = [{
                'qnode': r_obj.qnode,
                'label': r_obj.label,
                'pagerank': r_obj.pagerank,
                'description': r_obj.description,
            } for r_obj in r_objs[:10]]
            update = current_app.mongo.db.search.update_one(
                {"_id": logged_entry.inserted_id},
                {'$set': {'results': top10results}}
            )

        return [x.to_json(extra_info=extra_info) for x in r_objs]
