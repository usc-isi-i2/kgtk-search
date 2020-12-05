query = {
    "query": {
        "function_score": {
            "query": {
                "bool": {
                    "should": [
                        {
                            "term": {}
                        }
                    ],
                    "must_not": [
                        {
                            "term": {
                                "descriptions.keyword_lower": {
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
