'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const cors = require('cors');
const formidable = require('formidable');
const base64 = require('file-base64');
const { ConvertAPI } = require('convertapi');
const convertapi = new ConvertAPI(process.env.SECRET, { conversionTimeout: 60 });
const fs = require('fs-extra');
const path = require('path');



const PORT = process.env.PORT || 3000;

const app = express();

const client = new pg.Client(process.env.DATABASE_URL);

app.use(cors());
client.connect();
client.on('error', err => console.error(err));
app.use(express.static('./public'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//Routes
app.get('/', homeHandler);
app.get('/aboutus', aboutUsHandler);
app.get('/form', formHandler);
app.post('/savefile', saveHandler);

//Handlers
function homeHandler(request, response) {
  let chartInfo='SELECT * FROM conversiondata;';
  client.query(chartInfo)
    .then(result=>{
      console.log(result);
      response.status(200).render('pages/index', {chartKey: result.rows});
    }).catch(err => console.error(err));
}

function aboutUsHandler(request, response) {
  response.status(200).render('pages/aboutus');
}

function formHandler(request, response) {
  const extensions = ['png', 'jpg', 'pdf', 'docx', 'xlsx', 'html', 'gif', 'jpeg', 'zip', 'doc', 'webp', 'txt'];
  const conversionTypes = ['jpg', 'png', 'pdf', 'pdfa', 'tiff', 'watermark', 'webp', 'gif', 'doc', 'txt', 'jpeg', 'docx', 'html', 'jpg', 'mhtml', 'odt', 'pdf', 'pdfa', 'png', 'rtx', 'tiff', 'txt', 'webp', 'xps', 'zip', 'compress', 'decompress', 'decrypt', 'encrypt', 'extract', 'jpg', 'pdfa', 'png', 'pptx', 'repair', 'txt', 'zip', 'watermark', 'csv'];
  extensions.sort();
  conversionTypes.sort();
  let uniqueTypes = new Set(conversionTypes);
  response.status(200).render('pages/form', { Files: extensions, FilesTwo: uniqueTypes });
}

function saveHandler(request, response) {
  let form = new formidable.IncomingForm();
  const SQL = 'INSERT INTO conversiondata (filetype,filesize) VALUES ($1,$2)';
  form.parse(request, (err, fields, files) => {
    console.log(fields);
    console.log(files);
    console.log(files.fileUpload.name + ' -------------- ');

    let holder = files.fileUpload.path;
    let newPath = path.join(__dirname, 'uploads') + '/' + files.fileUpload.name;
    let fileData = fs.readFileSync(holder);
    console.log(newPath);
    makeFile(newPath,fileData);

    convertapi.convert(fields.fileConversion, { File: newPath })
      .then(result => {
        console.log(result.response.Files[0]);
        let infoHolder = result.response.Files[0];
        const safeVal = [infoHolder.FileExt, infoHolder.FileSize];
        client.query(SQL, safeVal);
        fs.emptyDirSync(path.join(__dirname,'uploads'));
        response.status(200).render('pages/savefile', { fileData: infoHolder });

      }).catch(err => console.error(err));

    // superagent.get(url)
    //   .set('Content-Type', `application/json`)
    //   .send(queryParams)
    //   .then(results => {

    //     console.log(results);
    //     // console.log('-------');
    //     // console.log(results.body);
    //   }).catch(error => {
    //     console.error(error);

    //   });

  });

}
function makeFile(path,data){
  fs.writeFile(path, data, function (err) {
    return err ? console.log(err) : console.log('Nice uploaded!');
  });
}

function FileInfo(object) {
  this.filetype = object.FileExt;
  this.filesize = object.FileSize;
}


app.listen(PORT, () => {
  console.log(`hi, you are on port ${PORT}`);
  console.log(`hello, you are connected to database >>> ${client.connectionParameters.database}`);
});

