export default {
    "openrank": {
        "accounts": {
            "notuseful": 100,
            "useful": 14,
            "processed": 33,
            "notprocessed": 33
        },
        "clients": [
            {
                "groupids": [],
                "_id": "608834847951d408c8d4f82a",
                "matchmode": "openrank",
                "clientip": "1.1.1.1",
                "capacity": 4,
                "res": {
                    "cpu": 90,
                    "availableRam": 8080,
                    "totalRam": 8080
                },
                "useful": false,
                "__v": 0
            },
            {
              "groupids": [],
              "_id": "608834847951d408c8d4f82a",
              "matchmode": "openrank",
              "clientip": "2.2.2.2",
              "capacity": 4,
              "res": {
                  "cpu": 50,
                  "availableRam": 2222,
                  "totalRam": 5555
              },
              "useful": false,
              "__v": 0
          }
        ],
        "matches" : [
            {
                "matchmode": "openrank",
                "firstgroup": [
                    "123sdfsdf",
                    "sdf",
                    "34sdfsdfsd5",
                    "45sdfsdf6",
                    "78sdfsdfsd9"
                ],
                "secondgroup": [
                    "111",
                    "222",
                    "333",
                    "444",
                    "555"
                ],
                "score" :{
                    "firstgroup": 16,
                    "secondgroup": 3
                },
                "status": "processing"
            },
            {
                "matchmode": "openrank",
                "firstgroup": [
                    "sdfsdfsfd",
                    "234sdfsdf",
                    "dddd",
                    "45sdfsdf6",
                    "78sdfsdfsd9"
                ],
                "secondgroup": [
                    "111",
                    "222",
                    "333",
                    "444",
                    "555"
                ],
                "score" :{
                    "firstgroup": 16,
                    "secondgroup": 3
                },
                "status": "processing"
            }
        ]
    },
    "onlylose": {
        "accounts": {
            "notuseful": 10,
            "useful": 23,
            "processing": 43,
            "processed": 20,
            "notprocessed": 20
        },
        "clients": [
            {
                "groupids": [],
                "_id": "6087fef5abfe6341443ebcf4",
                "matchmode": "onlylose",
                "clientip": "10.10.11.36",
                "capacity": 4,
                "res": {
                    "cpu": 46,
                    "availableRam": 2222,
                    "totalRam": 7777
                },
                "useful": false,
                "__v": 0
            }
        ],
        "matches": [
            {
                "matchmode": "openrank",
                "firstgroup": [
                    "fffff",
                    "234sdfsdf",
                    "34sdfsdfsd5",
                    "45sdfsdf6",
                    "78sdfsdfsd9"
                ],
                "secondgroup": [
                    "111",
                    "222",
                    "333",
                    "444",
                    "555"
                ],
                "score" :{
                    "firstgroup": 16,
                    "secondgroup": 3
                },
                "status": "processing"
            }
        ]
    },
    "level": {
        "accounts": {
            "notuseful": 20,
            "useful": 17,
            "processing": 12,
            "processed": 32,
            "notprocessed": 12
        },
        "clients": [
            {
                "groupids": [],
                "_id": "6087fed6abfe6341443ebcf3",
                "matchmode": "level",
                "clientip": "10.10.11.33",
                "capacity": 4,
                "res": {
                    "cpu": 50,
                    "availableRam": 1111,
                    "totalRam": 5555
                },
                "useful": false,
                "__v": 0
            }
        ],
        "matches": []
    }
};
