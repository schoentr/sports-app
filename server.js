'use strict';

// Application Dependencies
const express = require('express');
const superagent = require ('superagent');

// Load Enviroment from .env file
require('dotenv').config();

//App Setup
const app = express();
const cors = require('cors');
const PORT = process.env.PORT ||3000;

app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', homePage);
app.get('/game',getGame);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function handleError(error, response){
  console.log(error);
  response.render('/error', {error: 'The request could not be processed'});
}

function homePage(req,res){
  res.render('./index');
}
function getGame(req,res){
  Game.lookupGame(req.query.data)
    .then(data => res.send(data));
}
Game.lookupGame = (query) => {
  let month = 6;
  let year = 2019;
  let day = 28;
  const url = `https://api.sportradar.us/mlb/trial/v6.5/en/games/${year}/${month}/${day}/boxscore.json?api_key=${process.env.SPORTSRADAR_API}`;
  return superagent.get(url)
    .then((apiResponse) => {
      if (!apiResponse.body.league.games.length){
        throw 'No Data!';
      } else {
        let dailyGames =
      apiResponse.body.league.games.map((singleGame) => {
        const singleGameDetails = new Game( singleGame);
        return singleGameDetails;
      });
        return dailyGames;
      }
    });
}

function Game ( data){
  // this.query= query;
  this.homeTeamName = `${data.game.home.market} ${data.game.home.name}` ;
  this.homeTeamId = data.game.home.id;
  this.awayTeamName = `${data.game.away.market} ${data.game.away.name}`;
  this.awayTeamID = data.game.away.id;
  this.startTime = data.game.scheduled;
  // console.log(this.homeTeamName);

}

