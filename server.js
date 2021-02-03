'use strict';

require('dotenv').config();

const express = require('express');
const pg =  require('pg');
const superagent = require('superagent');
const cors = require('cors');



const PORT = process.env.PORT || 3000;

const app = express();

const client = new pg.Client(process.env.DATABASE_URL);

app.use(cors());

app.use(express.static('./public'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//Routes
app.get('/', homeHandler);
app.get('/aboutus', aboutUsHandler);
app.get('/form', formHandler);
app.post('/savefile', saveHandler);

//Handlers
function homeHandler(request, response){
  response.status(200).render('pages/index');
}

function aboutUsHandler(request, response){
  response.status(200).render('pages/aboutus');
}

function formHandler(request, response){
  response.status(200).render('pages/form');
}

function saveHandler(request, response){
  console.log(request.body);

  let url = `https://v2.convertapi.com/convert/${request.body.fileLegacy}/to/${request.body.fileConversion}`;

  console.log(url);

  let queryParams = {
    Secret: process.env.SECRET,
    File: request.body.fileUpload,
  };
  superagent.get(url)
    .query(queryParams)
    .attach('File', {uri: request.body.fileUpload, name: 'image', type: 'image/png'}, {contentType: 'png'})
    .then(results =>{
      console.log(results);
      // console.log('-------');
      // console.log(results.body);
    }).catch(error => console.error(error));
  response.status(200).render('pages/savefile');
}

app.listen(PORT, () => {
  console.log(`hi, you are on port ${PORT}`);
  console.log(`hello, you are connected to database >>> ${client.connectionParameters.database}`);
});



