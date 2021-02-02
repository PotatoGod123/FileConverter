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




app.listen(PORT, () => {
  console.log(`hi you are on port ${PORT}`);
  console.log(`hello you are connect to database>> ${client.connectionParameters.database}`);
});



