const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const apiKey = require('./js/keys');

const app = express();
const googleAPI = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const darkSky = 'https://api.darksky.net/forecast/';
var zip = 10012;
var lat = '40.730610';
var lng = '-73.935242';
const googleKey = apiKey.googleKey;
const darkSkyKey = apiKey.darkSkyKey;
const options = {
    method: 'GET',
    mode: 'cors'
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//function to set the inital screen
const setWeather = (zip) =>{
    var googleURL = googleAPI + zip + googleKey;

    var requestGoogle = new fetch.Request(googleURL, options);
    fetch(requestGoogle)
        .then ( (response) => {
            if(response.ok)
                return response.json();
            else
                throw new Error('bad request');
        })
        .then ( (geo) =>{
            console.log(geo);
            lat = geo.results[0].geometry.location.lat;
            lng = geo.results[0].geometry.location.lng;
            let url = darkSky  + darkSkyKey + '/' + lat + ',' + lng;
            var request = new fetch.Request(url, options);
            fetch(request)
                .then( (response) =>{
                    if(response.ok)
                        return response.json();
                    else
                        throw new Error('Bad HTTP')
                })
                .then ( (weather) => {
                    app.get('/', function(req, res){
                        res.render('landing', {json : weather, geo : geo.results[0]} );
                    });
                })
                .catch( (err) => {
                    console.log('ERROR ' + err.message);
                });
        })
        .catch( (err) => {
            console.log('ERROR: ' + err.message);
        });
};

setWeather(zip);


//post to change the area after submit
app.post('/', function(req, res){
    zip = req.body.zip_code;
    var googleURL = googleAPI + zip + googleKey;

    var requestGoogle = new fetch.Request(googleURL, options);
    fetch(requestGoogle)
        .then ( (response) => {
            if(response.ok)
                return response.json();
            else
                throw new Error('bad request');
        })
        .then ( (geo) =>{
            console.log(geo);
            lat = geo.results[0].geometry.location.lat;
            lng = geo.results[0].geometry.location.lng;
            let url = darkSky  + darkSkyKey + '/' + lat + ',' + lng;
            var request = new fetch.Request(url, options);
            fetch(request)
                .then( (response) =>{
                    if(response.ok)
                        return response.json();
                    else
                        throw new Error('Bad HTTP')
                })
                .then ( (weather) => {
                    res.render('landing', {json : weather, geo : geo.results[0]} );
                    
                })
                .catch( (err) => {
                    console.log('ERROR ' + err.message);
                });
        })
        .catch( (err) => {
            console.log('ERROR: ' + err.message);
        });
});

app.listen(5500, e => {
    console.log('server has started');
});