const express = require('express');
const fetch = require('node-fetch');
const app = express();
const googleAPI = "http://maps.googleapis.com/maps/api/geocode/json?address=";
const darkSky = 'https://api.darksky.net/forecast/';
const darkSkyKey = 'd164e7314fa315f1df13d8d23d484306';
var zip = 10012;
var lat = '';
var lng = '';
const options = {
    method: 'GET',
    mode: 'cors'
}

app.set('view engine', 'ejs');

const setWeather = (zip) =>{
    var googleURL = googleAPI + zip;

    var requestGoogle = new fetch.Request(googleURL, options);
    fetch(requestGoogle)
        .then ( (response) => {
            if(response.ok)
                return response.json();
            else
                throw new Error('bad request');
        })
        .then ( (geo) =>{
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

app.listen(5500, e => {
    console.log('server has started');
});