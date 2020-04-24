'use strict';


// Load Environment Variables from the .env file
require('dotenv').config();
let $ = require('jquery');


// Application Dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const superagent = require('superagent');
const handleError = require('./modules/error');
const showStories = require('./modules/stories');
// const submitStory = require('./modules/submit');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

// Application Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors()); //middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use((req,res,next)=> {
    try {
        const { user } = req.cookies;
        console.log('user',req.user);
        req.user = user && JSON.parse(user) || {};
    }
    catch (err) {
        console.warn('error parsing user cookie', err);
        req.user = {};
    }
    res.locals.user = req.user;

    next();
});

//view engine/templating
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

//routes
app.get('/', (req, res) => {
  res.render('pages/index');
});
app.get('/views/pages/submission', (req, res) => {
  getQuote(req, res);
  // res.render('pages/submission', )
});
app.get('/views/pages/stories', (req, res) => {
  showStories(req, res);
});
app.get('/views/pages/aboutUs', (req, res) => {
  res.render('pages/aboutUs');
});
app.get('/views/pages/search', (req, res) => {
  res.render('pages/search');
});
app.get('/views/pages/results', (req, res) => {
  getResults(req, res);
})
app.get('/chart.json', (req, res) => {
  getCovidData(req, res);
})
app.post('/views/pages/submission', submitStory);

//routes for login
app.get('/register', showRegister);
app.post('/register', createUser);

app.get('/login', showLogin);
app.post('/login', doLogin);
app.post('/logout', doLogout);

//handlers
function showRegister(req,res){
    res.render('pages/register');
}

function showLogin(req,res){
    res.render('pages/login');
}

function doLogin(req,res){
    const { username } = req.body;
    const SQL =
        SELECT id, username FROM users
        WHERE username = $1;
        ;
       client.query(SQL, [username])
        .then(results => {
            let { rows } = results;
            let user = rows[0];

            if (!user) {
                res.status(400)
                    .render('pages/error-view', { error: 'User not found!' });
                return;
            }

            response.cookie('user', JSON.stringify(user));
            response.redirect('/');
        })
}

function doLogout(req,res){
    res.clearCookie('user');
    res.redirect('/');
}

function createUser(req,res){
    const { username } = req.body;
    const SQL =
        INSERT INTO users (username)
        VALUES ($1)
        RETURNING id, username;
        ;
       client.query(SQL, [username])
        .then(results => {
            let { rows } = results;
            let user = rows[0];

            res.cookie('user', JSON.stringify(user));
            res.redirect('/');
        })
        .catch(err=> handleError(err,response));
}


// submit the story
function submitStory(req, res) {
  const sql = 'INSERT INTO stories (name,location,story,category) VALUES($1, $2, $3, $4) RETURNING id;';
  const values = [req.body.name, req.body.location, req.body.story, req.body.category];
  client.query(sql, values).then((sqlResponse) => {
    res.redirect('stories');
  }).catch(err =>
    handleError(err, req, res));
}

function getQuote(req, res) {
  const url = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en ';
  superagent.get(url).then(quoteResponse => {
    let quotes = quoteResponse.body;
    console.log({ quotes: quotes });
    res.render('pages/submission', { quotes: quotes });
  }).catch(err =>
    handleError(err, req, res));
}

function getResults(req, res) {
  res.render('pages/results', req.query);
}

function getCovidData(req, res) {
  let url = 'https://api.covid19api.com/country/'

  let qString = `${req.query.country}?from=${req.query.startDate}T00:00:00Z&to=${req.query.endDate}T00:00:00Z`
  url = url + qString;
  console.log(url);
  superagent.get(url).then(covidResponse => {
    confirmedNumbers = [];
    dateRange = [];
    let cases = covidResponse.body.map(dayData => {
      let data = new ConfirmedCases(dayData);
      return data;
    });
    console.log(cases);
    res.send(cases);
  }).catch(err =>
    handleError(err, req, res));
}


let confirmedNumbers = [];
let dateRange = [];
function ConfirmedCases(covidData) {
  this.country = covidData.Country;
  this.confirmed = covidData.Confirmed;
  confirmedNumbers.push(parseInt(covidData.Confirmed));
  this.date = new Date(Date.parse(covidData.Date)).toDateString();
  dateRange.push(new Date(Date.parse(covidData.Date)).toDateString());

}

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));



