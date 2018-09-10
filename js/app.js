const express = require('express');
const fetch = require('node-fetch');

const app = express();
const darkSky = 'https://api.darksky.net/forecast/';
const key = 'd164e7314fa315f1df13d8d23d484306';
var lat = '42.3601';
var long = '-71.0589';

let url = darkSky  + key + '/' + lat + ',' + long;
let options = {
    method: 'GET',
    mode: 'cors'
}

let reqest = new fetch.Request(url, options);

fetch(reqest)
    .then( (response) =>{
        if(response.ok)
            return response.json();
        else
            throw new Error('Bad HTTP')
    })
    .then ( (j) => {
        app.get('/', function(req, res){
            var string = j.timezone + "\nSummary: " + j.currently.summary + "\nTemperature: " + j.currently.temperature;
            res.send(string);
        });
    })
    .catch( (err) => {
        console.log('ERROR ' + err.message);
    });

app.listen(5500, e => {
    console.log('server has started');
});