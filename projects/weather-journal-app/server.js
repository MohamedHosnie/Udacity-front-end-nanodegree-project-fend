// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser')
const cors = require('cors')

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors())

// Initialize the main project folder
app.use(express.static('website'));


// Spin up the server
const port = 3000;
const server = app.listen(port, listening);
// Callback to debug
function listening () {
    console.log(`running on localhost: ${port}`);
};

// Initialize all route with a callback function
let data = [];

//GET all route
app.get('/all', getAllData);
function getAllData (request, response) {
    response.send(projectData);
};

//GET recent route
app.get('/recent', getRecentData);
function getRecentData (request, response) {
    response.send(data[data.length - 1]);
};

//POST route
app.post('/add', addNewData);
function addNewData (request, response) {
    let input = request.body;
    data.push({
        date: input.date,
        temp: input.temp,
        content: input.content
    });
};