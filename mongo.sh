#!/bin/bash

mongodump --uri="mongodb+srv://jobx-dev@jobx.auduktk.mongodb.net/dev"
mongorestore --uri="mongodb://localhost:27017" ./dump/
