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
app.get('/game/:id',getGameDetails);
app.get('/teams/:id',getTeam);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

let gameDetail = [];
let rosterTemp ={};
// let rosterTemp.players =[];
let rosterTempplayers= [];
let teamId = '';
var index = 0;

function handleError(error, response){
  console.log(error);
  response.render('/error', {error: 'The request could not be processed'});
}

function homePage(req,res){
  res.render('./index');
}

function getGameDetails(req,res){
  // console.log(req.params.id);
  // console.log(req.params.id.length);
  index = req.params.id;
  // const index = (req.parms.id);
  //  console.log('index', index);

  // console.log('line 39', gameDetail[index]);
  const singleGameObject = gameDetail[index];
  // console.log('ln42', singleGameObject);
  return res.render('./detail',{singleGameObject:singleGameObject});
  // return res.redirect('./../game')

}

function getGame(req,res){
  Game.lookupGame(req.query.data)
    .then((results) => {
      return res.render('./game11',{results:results});
    })
}

function getTeam (req,res){
  // console.log(req.params.id);
  teamId='';
  teamId=req.params.id;
  Player.lookupPlayer(req.query.data)
    .then ((results) => {
      return res.render ('./team',{rosterTemp:rosterTemp});
    });
}



Player.lookupPlayer = (query) => {
  // console.log('getTeam');
  // console.log(gameDetail);

  const url = `https://api.sportradar.us/mlb/trial/v6.5/en/teams/${teamId}/profile.json?api_key=${process.env.SPORTSRADAR_API}`;
  return superagent.get(url)
    .then((apiResponse) => {
      rosterTemp= {};
      rosterTemp.name = apiResponse.body.name;
      console.log(rosterTemp.name);
      // console.log(apiResponse.body.players[0]);
      let playerArr = apiResponse.body.players.map((player) =>{
        const singlePlayer = new Player(player);
        return singlePlayer;
      });
      // console.log(playerArr);
      rosterTemp.players = playerArr;
      console.log(rosterTemp);
      return playerArr;
    });
}
Game.lookupGame = (query) => {
  let month = 6;
  let year = 2014;
  let day = 28;
  gameDetail = [];
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

        // console.log('ln 69',gameDetail);
        return dailyGames;
      }
    })


}
function Player(data){
  // console.log ('data',data);
  this.id = data.id;
  this.position = data.primary_position;
  this.height =data.height;
  this.weight = data.weight;
  this.name = data.full_name;
  this.bats = data.bat_hand;
  this.throw = data.throw_hand;
  this.birthday = data.birthdate;
  rosterTempplayers.push(this);
}



function Game ( data){
  this.gameId = data.game.id;
  this.homeTeamName = `${data.game.home.market} ${data.game.home.name}` ;
  this.homeTeamId = data.game.home.id;
  this.homePitcherERA = data.game.home.probable_pitcher.era;
  this.homeTeamID = data.game.home.id;
  this.homeTeamWins = data.game.home.win;
  this.homeTeamLoses = data.game.home.loss;
  this.homePitcherFirst = data.game.home.probable_pitcher.first_name;
  this.homePitcherLast = data.game.home.probable_pitcher.last_name;
  this.homePitcherERA = data.game.home.probable_pitcher.era;
  this.awayTeamName = `${data.game.away.market} ${data.game.away.name}`;
  this.awayTeamID = data.game.away.id;
  this.awayTeamWins = data.game.away.win;
  this.awayTeamLoses = data.game.away.loss;
  this.awayPitcherFirst = data.game.away.probable_pitcher.first_name;
  this.awayPitcherLast = data.game.away.probable_pitcher.last_name;

  gameDetail.push(this);// console.log(this.?);
}
