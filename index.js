// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const cross_fetch = require('cross-fetch');
const bodyParser = require('body-parser');

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

app.use(bodyParser.json());

// Will be changed to a post request responder
app.post("/getData", function(req, res, next) {
    let date_str = String(req.body.year)+"-"+String(req.body.month)+"-1";
    const fetch_url = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start="+date_str+"&End="+date_str;
    cross_fetch.fetch(fetch_url).then((dat)=>{return dat.json();}).then((dat)=> {
        let storage_info = [
            {"code": "SHA", "capacity": 4552000, "storage": 0}, 
            {"code": "ORO", "capacity": 3537577, "storage": 0},
            {"code": "CLE", "capacity": 2447650, "storage": 0},
            {"code": "NML", "capacity": 2400000, "storage": 0}, 
            {"code": "SNL", "capacity": 2041000, "storage": 0}, 
            {"code": "DNP", "capacity": 2030000, "storage": 0}, 
            {"code": "BER", "capacity": 1602000, "storage": 0}
        ];
        for (let i = 0; i < dat.length; ++i) {
            storage_info[i].storage = Math.max(0, dat[i].value);
        }
        console.log(storage_info);
        res.send(storage_info);
    }).catch((err)=>{res.send(err);});
});

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"});
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});
