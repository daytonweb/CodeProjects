const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
const fs = require('fs');
const port = process.env.PORT || 3000;

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res)
{
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/get_pokemon', function(req, res)
{
  let speech = req.body.sr;

  let pokeArr = fs.readFileSync('pokemon_names.txt').toString().split("\n");

  if(pokeArr.includes(speech))
  {
    let pokeURL = 'https://pokeapi.co/api/v2/pokemon/'+speech.toLowerCase()+'/';
    request(pokeURL, {json: true}, function(err, resp, body)
    {
      if(err) { return console.log(err); }
      let pokeJson = { name:body.name, number:body.id, sprite:body.sprites.front_default, type:body.types[0].type.name, height:body.height, weight:body.weight}
      console.log(pokeJson);
      res.send(pokeJson);
    });
  }
  else
  {
    res.send('Failed to find Pokemon: ' + speech);
  }
});

app.listen(port, function()
{
  console.log(`App is actually running on ${port}, YAY!`);
});