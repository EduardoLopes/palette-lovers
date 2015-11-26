#!/usr/bin/env node

var request = require('request');
var isNaN = require('is-nan');
var commandLineArgs = require('command-line-args');
var hexToRgb = require('hex-rgb');
var fs = require('fs');

var cli = commandLineArgs([
  { name: 'id', type: String, defaultOption: true }
]);

var options = cli.parse();

var ID;

if(isNaN( parseInt(options.id) ) ){
  ID = options.id.match(/(?:palette\/(\d+)|(\d+))/)[1];
} else {
  ID = parseInt(options.id);
}

function getPaletteNameFromURL(url){
  return url.match(/palette\/\d+\/(.*)/)[1];
}

request('http://www.colourlovers.com/api/palette/'+ ID +'?format=json', function (error, response, body) {
  var output = '';

  if (!error && response.statusCode == 200) {

    body = JSON.parse(body)[0];

    output += 'GIMP Paletten\n';
    output += 'Name: ' + body.title + '\n';
    output += 'Columns: 0\n';
    output += '#\n';

    body.colors.forEach(function(color){

      var rbg = hexToRgb(color);
      output += rbg[0] +'\t'+rbg[1] +'\t'+rbg[2] +'\n';

    });

    var name = getPaletteNameFromURL(body.url);

    fs.writeFile('./'+name+'.gpl', output, function(err) {
      if(err) {
        return console.log(err);
      }
    });

  } else {

    console.log('ERROR: ARE YOU CONNECTED TO THE INTERNET?');

  }

});

