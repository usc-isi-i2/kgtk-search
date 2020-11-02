# ISI's Wikidata Query Service

## GET /search/\<search term\>
  **/search/apple?size=5**
  
  ```
  [
   {
     "qnode": "Q312",
     "description": [
       "American multinational technology corporation",
       "American multinational technology company"
     ]
   },
   {
     "qnode": "Q89",
     "description": [
       "fruit of the apple tree"
     ]
   },
   {
     "qnode": "Q213710",
     "description": [
       "UK international record label; imprint of Apple Corps Ltd."
     ]
   },
   {
     "qnode": "Q621347",
     "description": [
       "river in the United States of America"
     ]
   },
   {
     "qnode": "Q24777599",
     "description": [
       "InterPro Domain"
     ]
   }
 ]
  ```
  
  ## GET /search/\<search term\>?lowercase=false
  **/search/apple?size=5&lowercase=false**
  ```
  [
   {
     "qnode": "Q89",
     "description": [
       "fruit of the apple tree"
     ]
   },
   {
     "qnode": "Q1519207",
     "description": [
       "heraldic figure"
     ]
   },
   {
     "qnode": "Q62474609",
     "description": [
       "type of wood"
     ]
   }
 ]
  ```
  
## GET /search/\<search term\>?extra_info=true
**/search/apple?extra_info=true**
   ```
  [
  {
    "qnode": "Q312",
    "description": [
      "American multinational technology corporation",
      "American multinational technology company"
    ],
    "label": [
      "Apple Inc.",
      "Apple"
    ],
    "alias": [
      "Apple Computer, Inc.",
      "Apple",
      "Apple Computer Inc",
      "Apple Computer",
      "Apple Computer Incorporated",
      "\uf8ff",
      "Apple Incorporated"
    ],
    "pagerank": 2.6044584634823355e-05
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
    "pagerank": 2.7054146987449343e-06
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
      "Apple Records",
      "LC 01074",
      "LC 1074"
    ],
    "pagerank": 3.6296661096803823e-07
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
    "pagerank": 1.8949564704749884e-07
  },
  {
    "qnode": "Q24777599",
    "description": [
      "InterPro Domain"
    ],
    "label": [
      "Apple domain"
    ],
    "alias": [
      "IPR000177",
      "Apple"
    ],
    "pagerank": 2.563873578580089e-08
  },
  {
    "qnode": "Q29711518",
    "description": [
      "protein-coding gene in the species Drosophila melanogaster"
    ],
    "label": [
      "TER94"
    ],
    "alias": [
      "ter94",
      "Dmel_CG2331",
      "VCP/p97",
      "p97",
      "dVCP",
      "22.26",
      "l(2)03775",
      "VCP ATPase",
      "vcp",
      "dmTERA",
      "pTER94",
      "CG2331",
      "l(2)46Ch",
      "dTERA",
      "DmTER94",
      "anon-WO2004063362.65",
      "Apple",
      "l(2)46CFs",
      "BcDNA:GM02885",
      "7.12",
      "anon-WO2004063362.67",
      "l(2)46CFf",
      "cdc48",
      "BcDNA.GM02885",
      "Q7KN62",
      "CG2331 gene product from transcript CG2331-RA",
      "VIII",
      "l(2)46Db",
      "I",
      "Tera",
      "Dmel\\\\\\\\CG2331"
    ],
    "pagerank": 1.5146130068382317e-08
  },
  {
    "qnode": "Q26944932",
    "description": [
      "family name",
      "surname"
    ],
    "label": [
      "Apple"
    ],
    "alias": [],
    "pagerank": 6.962673865660999e-09
  },
  {
    "qnode": "Q16274912",
    "description": [
      "name: given name and surname"
    ],
    "label": [
      "Apple"
    ],
    "alias": [],
    "pagerank": 4.7201842561623204e-09
  },
  {
    "qnode": "Q227418",
    "description": [
      "Wikimedia disambiguation page"
    ],
    "label": [
      "Apple"
    ],
    "alias": [],
    "pagerank": 4.7201842561623204e-09
  },
  {
    "qnode": "Q62474609",
    "description": [
      "type of wood"
    ],
    "label": [
      "apple"
    ],
    "alias": [
      "apple wood"
    ],
    "pagerank": 4.08957927753176e-09
  }
]
   ```
   
   **Results subject to completion of the index**
