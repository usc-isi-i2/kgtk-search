query_property = {
    "query": {
        "function_score": {
            "query": {
                "bool": {
                    "filter": [
                        {
                            "exists": {
                                "field": "data_type"
                            }
                        },
                        {
                            "term": {

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
