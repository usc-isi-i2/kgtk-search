ngram_query = {
    "query": {
        "function_score": {
            "query": {
                "bool": {
                    "should": [
                        {
                            "match": {

                            }
                        }
                    ],
                    "must_not": [
                        {
                            "term": {
                                "descriptions.en.keyword_lower": {
                                    "value": "wikimedia disambiguation page"
                                }
                            }
                        }
                    ]
                }
            },
            "boost": 1,
            "field_value_factor": {
                "field": "pagerank",
                "modifier": "none",
                "factor": 10000
            },
            "boost_mode": "multiply"
        }
    }
}
