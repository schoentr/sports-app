'use strict';

// Application Dependencies
const express = require('express');
const superagent = require ('superagent');

// Load Enviroment from .env file
require('dotenv').config();

//App Setup
const app = express();
const PORT = process.env.PORT ||3000;

app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', homePage);

function homePage(req,res){
  res.render('pages/index');
}