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
const fs = require('fs');
const path = require('path');



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
function homeHandler(request, response) {
  response.status(200).render('pages/index');
}

function aboutUsHandler(request, response) {
  response.status(200).render('pages/aboutus');
}

function formHandler(request, response) {
  const extensions = ['png','jpg','pdf','docx','xlsx','html','gif','jpeg','zip','doc','webp','txt'];
  const conversionTypes = ['jpg','png','pdf','pdfa','tiff','watermark','webp','gif','doc','txt','jpeg','docx','html','jpg','mhtml','odt','pdf','pdfa','png','rtx','tiff','txt','webp','xps','zip','compress','decompress','decrypt','encrypt','extract','jpg','pdfa','png','pptx','repair','txt','zip','watermark'];
  extensions.sort();
  conversionTypes.sort();
  let uniqueTypes= new Set(conversionTypes);
  response.status(200).render('pages/form',{Files:extensions,FilesTwo:uniqueTypes});
}

function saveHandler(request, response) {
  let form = new formidable.IncomingForm();
  let myUploadedFile = document.getElementById("fileUpload").files[0];
  console.log(myUploadedFile);

  form.parse(request, (err, fields, files) => {
    console.log(fields);
    console.log(files);
    console.log(files.fileUpload.name+' -------------- ');

    let holder = files.fileUpload.path;
    let newPath= path.join(__dirname,'uploads')+'/'+files.fileUpload.name;
    let fileData = fs.readFileSync(holder);
    console.log(newPath);
    // base64.encode(holder, (err, base64String) => {

    // });
    fs.writeFile(newPath, fileData, function(err){
      return err? console.log(err): console.log('Nice uploaded!');
    });
    
    convertapi.convert(fields.fileConversion,{File:newPath})
      .then(result=>{
        console.log(result.response.Files[0]);
        // console.log(result.file);
      }).catch(err=>console.error(err));
 
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
    response.status(200).render('pages/savefile');
  });

}


app.listen(PORT, () => {
  console.log(`hi, you are on port ${PORT}`);
  console.log(`hello, you are connected to database >>> ${client.connectionParameters.database}`);
});



