# ISI's Wikidata Query Service

## GET /search/\<search term\>
  **/search/apple**
  
  ```
  [
    {
      "qnode": "Q65386863",
      "description": [
          "fictional character appearing in the movie « Turbo Kid »"
      ]
    }
  ]
  ```
  
   **/search/apple?extra_info=true**
   ```
   [
      {
        "qnode": "Q65386863",
        "description": [
          "fictional character appearing in the movie « Turbo Kid »"
        ],
        "label": [
          "Apple"
        ],
        "alias": [],
        "pagerank": 2.575437389727643E-9
      }
    ]
   ```
   
   **Results subject to completion of the index**
