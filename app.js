const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const apiKey = require('./keys.js');

const app = express();
const geocodioAPI = "https://api.geocod.io/v1.3/geocode?q=";
const darkSky = 'https://api.darksky.net/forecast/';
var zip = 10012;
var lat = '40.730610';
var lng = '-73.935242';
const geocodioKey = apiKey.geocodioKey;
const darkSkyKey = apiKey.darkSkyKey;
const options = {
    method: 'GET',
    mode: 'cors'
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//function to set the inital screen
const setWeather = (zip) =>{
    var geocodioURL = geocodioAPI + zip + geocodioKey;

    var requestGoogle = new fetch.Request(geocodioURL, options);
    fetch(requestGoogle)
        .then ( (response) => {
            if(response.ok)
                return response.json();
            else
                throw new Error('bad request');
        })
        .then ( (geo) =>{
            lat = geo.results[0].location.lat;
            lng = geo.results[0].location.lng;
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
                    console.log("here");
                    app.get('/', function(req, res){
                        res.render('landing', {json : weather, geo : geo.results[0]} );
                    });
                })
                .catch( (err) => {
                    console.log('ERROR ' + err.message + ' darksky');
                });
        })
        .catch( (err) => {
            console.log('ERROR: ' + err.message + ' geo');
        });
};

setWeather(zip);


//post to change the area after submit
app.post('/', function(req, res){
    zip = req.body.zip_code;
    geocodioURL = geocodioAPI + zip + geocodioKey;

    var requestGoogle = new fetch.Request(geocodioURL, options);
    fetch(requestGoogle)
        .then ( (response) => {
            if(response.ok)
                return response.json();
            else
                throw new Error('bad request');
        })
        .then ( (geo) =>{
            lat = geo.results[0].location.lat;
            lng = geo.results[0].location.lng;
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
                    console.log('ERROR ' + err.message + ' darksky-post');
                });
        })
        .catch( (err) => {
            console.log('ERROR: ' + err.message + ' geo-post');
        });
});

app.listen(8080, e => {
    console.log('server has started');
});