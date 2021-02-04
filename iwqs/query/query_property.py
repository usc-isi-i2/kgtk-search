query_property = {
    "query": {
        "function_score": {
            "query": {
                "bool": {
                    "must": []
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
