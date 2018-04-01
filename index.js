/**
 * This file is responsible for host the web application locally 
 */
var express = require('express');
var app = express();

//Specifying root for file to serve
app.use(express.static("."));

//Port to host locally
app.listen(8000);


