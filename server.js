`use strict`;

/// packages
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const unirest = require("unirest");


const client = new pg.Client(process.env.DATABASE_URL)
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



app.get('/', proofOfLife);
app.get('/dictionary', getFromDictionary)
app.get('/newTerm', NewWordForm)
app.post('/addNew', addNewWord)
app.get('/test', data)

app.use('*', notFoundHandler);
app.use(errorHandler);

function data(params) {

    var req = unirest("GET", "https://wordsapiv1.p.rapidapi.com/words/hatchback/typeOf");

    req.headers({
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": "861a23e564msh9e59c3b41ee0870p1bc725jsn80dfae1d8670"
    });


    req.end(function (res) {
        // if (res.error) throw new Error(res.error);

        console.log(res.body);
    });
}


function proofOfLife(req, res) {
    // res.status(200).send(`hello form our app`)
    res.render('pages/info')
}

function getFromDictionary(req, res) {
    let SQL = 'SELECT * FROM words';
    client.query(SQL)
        .then(results => {
            res.render('pages/dictionary', { card: results.rows[0] });
            console.log('res', results.rows[0]);

        })
}

function NewWordForm(req, res) {
    let SQL = 'SELECT * FROM words';
    client.query(SQL)
        .then(results => {
            res.render('pages/info', { card: results.rows[0] });
            console.log('res', results.rows[0]);

        })
}

function addNewWord(req, res) {
    let SQL = `INSERT INTO words (term, discription, image_url, notes) VALUES ($1,$2,$3,$4) RETURNING *`;
    let values = ['dog', 'mammal animal', 'https://i.dailymail.co.uk/1s/2019/11/23/09/21370544-7717313-image-a-1_1574501083030.jpg', 'hello doggoy'];
    client.query(SQL, values)
        .then(results => {
            res.status(200).json(results.rows);
        })
}

function errorHandler(error, req, res) {
    res.status(500).send('We R Sorry')
}

function notFoundHandler(req, res) {
    res.status(404).send('WHERE ARE YOU GOING!!')
}

client.connect()
    .then(() => app.listen(PORT, () => {
        console.log(`Welcome aboard on port ${PORT}`);
    }));