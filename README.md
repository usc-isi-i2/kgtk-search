# KGTK Search API

Deployed URL: `https://kgtk.isi.edu/api`

## Parameters

- `language`: Currently there are labels, aliases and descriptions available in 4 languages: `en`, `es`, `ru` and `zh-cn` (english, spanish, russian and simplified chinese). Default: `en`.
- `type`: Search type. Valid options are `ngram` and `exact_match`. The `ngram` search will try to match partial labels and aliases, whereas `exact_match` search will only match exact labels. Default: `ngram`
- `item`: Search for wikibase items or properties. Valid options are `qnode` (for wikibase item) and `property` (for wikibase properties). Default: `qnode`
- `instance_of`: Search only for items which are instance of the input Qnode. For example, search for only humans: `instance_of=Q5`
- `is_class`: Search for only classes, `is_class=true`. Default, `false`
- `extra_info`: Return extra information about the matching items. If `extra_info=true`, the following extra fields will be returned: `label`, `alias`, `pagerank`, `statements` (number of), `score` (retrieval score) and `data_type` (for wikibase properties only)
- `size`: number of matching items to return. Default, `size=20`

## Examples

1. `https://kgtk.isi.edu/api?q=apple&extra_info=true&language=en&is_class=false&type=ngram&size=5` 

Search for **apple**, search type=`ngram`, language=`en`

Results:
  ```
  [
    {
     "qnode": "Q312",
     "description": [
     "American multinational technology company"
     ],
     "label": [
     "Apple Inc."
     ],
     "alias": [
     "",
     "Apple",
     "Apple Computer",
     "Apple Incorporated",
     "Apple Computer Inc",
     "Apple Computer Incorporated",
     "Apple Computer, Inc."
     ],
     "pagerank": 0.00003451312816255285,
     "statements": 985,
     "score": 509.29764
    },
    {
     "qnode": "Q89",
     "description": [
     "fruit of the apple tree"
     ],
     "label": [
     "apple"
     ],
     "alias": [
     "apples"
     ],
     "pagerank": 0.0000018559747423482135,
     "statements": 268,
     "score": 27.387943
    },
    {
      "qnode": "Q213710",
      "description": [
      "UK international record label; imprint of Apple Corps Ltd."
      ],
      "label": [
      "Apple"
      ],
      "alias": [
      "LC 1074",
      "Apple Records",
      "LC 01074"
      ],
      "pagerank": 6.786126121211227e-7,
      "statements": 139,
      "score": 10.014039
    },
    {
      "qnode": "Q60",
      "description": [
      "largest city in the United States"
      ],
      "label": [
      "New York City"
      ],
      "alias": [
      "New York",
      "New York, NY",
      "City of New York",
      "NY City",
      "the five boroughs",
      "Big Apple",
      "NYC",
      "New York, New York",
      "New York City, New York"
      ],
      "pagerank": 0.00012811598968018683,
      "statements": 485,
      "score": 4.627561
    },
    {
      "qnode": "Q621347",
      "description": [
      "river in the United States of America"
      ],
      "label": [
      "Apple"
      ],
      "alias": [
      "Apple River"
      ],
      "pagerank": 3.0619269127782033e-7,
      "statements": 51,
      "score": 4.518374
    }
]
  ```
  
2. `https://kgtk.isi.edu/api?q=apple&extra_info=true&language=en&is_class=false&type=ngram&size=5&instance_of=Q5`

Search for **apple**, search type=`ngram`, language=`en`, instance_of=`Q5` (human)

Results:
```
[
  {
    "qnode": "Q4886556",
    "description": [
      "American publisher"
    ],
    "label": [
      "Daniel Appleton"
    ],
    "alias": [],
    "pagerank": 0.0000034939515580981954,
    "statements": 66,
    "score": 0.39922956
  },
  {
    "qnode": "Q150502",
    "description": [
      "American basketball player-coach"
    ],
    "label": [
      "Muggsy Bogues"
    ],
    "alias": [
      "Muggs",
      "Apple",
      "Tyrone Bogues",
      "Tyrone Curtis Bogues",
      "Billy"
    ],
    "pagerank": 3.993216466627497E-9,
    "statements": 99,
    "score": 0.059006475
  },
  {
    "qnode": "Q87914166",
    "description": [],
    "label": [
      "Daniel Appleton"
    ],
    "alias": [],
    "pagerank": 2.875106675379438E-7,
    "statements": 40,
    "score": 0.032851845
  },
  {
    "qnode": "Q265852",
    "description": [
      "American business executive"
    ],
    "label": [
      "Tim Cook"
    ],
    "alias": [
      "Tim Apple",
      "Timothy Cook",
      "Timothy D. Cook",
      "Timothy Donald Cook"
    ],
    "pagerank": 4.333044932355228E-7,
    "statements": 98,
    "score": 0.031312153
  },
  {
    "qnode": "Q8011878",
    "description": [
      "American publisher"
    ],
    "label": [
      "William Henry Appleton"
    ],
    "alias": [],
    "pagerank": 2.7922388969025287E-7,
    "statements": 62,
    "score": 0.028795298
  }
]
```

3. `https://kgtk.isi.edu/api?q=ford%20escort&extra_info=true&language=en&is_class=true&type=ngram&size=5`

Search for **ford escort**, search type=`ngram`, language=`en`, is_class=`true`

Results:
```
[
  {
    "qnode": "Q504644",
    "description": [
      "European small family car"
    ],
    "label": [
      "Ford Escort"
    ],
    "alias": [
      "Ford Escort Ghia",
      "Ford Escort RS 1600",
      "Ford Escort RS1800",
      "Ford Escort RS1600",
      "Ford Escort RS Cosworth",
      "Ford Escort RS2000",
      "Ford Escort Cosworth",
      "Ford Escort RS"
    ],
    "pagerank": 2.1400817331862214E-8,
    "statements": 194,
    "score": 0.36644888
  },
  {
    "qnode": "Q2584029",
    "description": [
      "racing automobile model"
    ],
    "label": [
      "Ford Escort WRC"
    ],
    "alias": [],
    "pagerank": 5.218473500144622E-9,
    "statements": 116,
    "score": 0.0012064546
  },
  {
    "qnode": "Q1436815",
    "description": [
      "car model"
    ],
    "label": [
      "Ford Escort (North America)"
    ],
    "alias": [],
    "pagerank": 4.541820077538962E-9,
    "statements": 116,
    "score": 0.0008560259
  }
]
```

4. `https://kgtk.isi.edu/api?q=Владимир%20Путин&extra_info=true&language=ru&is_class=false&type=ngram&size=5`

Search for **Validimir Putin**, search type=`ngram`, language=`ru`, is_class=`false`

Results:
```
[
  {
    "qnode": "Q7747",
    "description": [
      "российский политик, президент РФ (2000-2008, с 2012), председатель правительства РФ (1999-2000, 2008-2012)"
    ]
  },
  {
    "qnode": "Q19300851",
    "description": [
      "отец В.В. Путина"
    ]
  },
  {
    "qnode": "Q21287326",
    "description": [
      "дубликат статьи"
    ]
  },
  {
    "qnode": "Q24957731",
    "description": []
  },
  {
    "qnode": "Q24957710",
    "description": []
  }
]
```

5. `https://kgtk.isi.edu/api?q=time&extra_info=true&language=en&is_class=false&type=ngram&size=5&item=property`

Search for **time**, search type=`ngram`, language=`en`, is_class=`false`, item=`property`

Results:
```
[
  {
    "qnode": "P421",
    "description": [
      "time zone for this item"
    ],
    "label": [
      "located in time zone"
    ],
    "alias": [
      "time",
      "TZ",
      "time zone",
      "timezone"
    ],
    "pagerank": 3.900277425573833E-9,
    "statements": 50,
    "score": 0.00043849097,
    "data_type": "wikibase-item"
  },
  {
    "qnode": "P8745",
    "description": [
      "the earliest time of day at which a reserved room in a hotel, inn or lodge is available to an arriving guest"
    ],
    "label": [
      "check-in time"
    ],
    "alias": [
      "checkin time"
    ],
    "pagerank": 3.900277425573833E-9,
    "statements": 23,
    "score": 0.00040667242,
    "data_type": "wikibase-item"
  },
  {
    "qnode": "P2781",
    "description": [
      "officially recorded time elapsed in a sports race"
    ],
    "label": [
      "race time"
    ],
    "alias": [],
    "pagerank": 3.900277425573833E-9,
    "statements": 46,
    "score": 0.00040174648,
    "data_type": "quantity"
  },
  {
    "qnode": "P2362",
    "description": [
      "time required by the subject to reach the specified altitude, from sea level"
    ],
    "label": [
      "time to altitude"
    ],
    "alias": [
      "time to climb"
    ],
    "pagerank": 3.900277425573833E-9,
    "statements": 26,
    "score": 0.00039514014,
    "data_type": "quantity"
  },
  {
    "qnode": "P8746",
    "description": [
      "the latest time of day a guest may check out of a hotel or lodge without incurring additional cost"
    ],
    "label": [
      "check-out time"
    ],
    "alias": [
      "checkout time"
    ],
    "pagerank": 3.900277425573833E-9,
    "statements": 23,
    "score": 0.00039514014,
    "data_type": "wikibase-item"
  }
]
```

## Running the app in development

1. Run `pip install -r requirements.txt`
2. Run `python application.py` to start the flask server 
3. Change into the `/app` directory and run `npm install`
4. Make sure the flask server is running on `http://0.0.0.0:7884/`  
   (or update the proxy setting in the `package.json` file)
5. Run `npm start` - this should open the app in your default browser


## Deploying the app with Docker

1. Change into the `/app` directory and run `npm run build`  
   (this will update the static front-end files used in deployment)
2. Run `docker build -t <image_name> .` in the root directory
3. Run `docker push <image_name>` to upload the new image
