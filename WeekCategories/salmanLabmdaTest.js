"use strict";
exports.__esModule = true;
var event;
var Client = require('pg').Client;
var client = new Client({
    user: 'calibermobile',
    host: 'calibermobile.cvtq9j4axrge.us-east-1.rds.amazonaws.com',
    database: 'calibermobile',
    password: '8Sy2MoFBRxY1Rt0prtuOh',
    port: 5432
});
client.connect();
//let id = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
//getCategories(client,id);
client.query('select * from weekcategories', function (err, res) {
    console.log(res);
    client.end();
});
