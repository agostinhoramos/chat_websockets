// Import express.js
let express = require('express');
const path = require('path');

// Import body parser
let bodyParser = require('body-parser');

// .Env
const dotenv = require('dotenv');
dotenv.config();


// Import mongoose
let app = express();
const cors = require("cors");

// Configure bodyparser to process orders
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

let options = {}

// Load all static files
app.use(express.static("public", options));

app.get('/',function(req,res) {
    if( !true ){
        res.sendFile(path.join(__dirname+'/views/index.html'));
    }else{
        res.sendFile(path.join(__dirname+'/views/login.html'));
    }
});

const PORT = process.env.PORT || 1300; 
app.listen(PORT, function() {
    console.log(`Server running: http://127.0.0.1:${PORT}`);
});