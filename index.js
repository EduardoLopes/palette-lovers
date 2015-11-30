#!/usr/bin/env node

var request = require('request');
var isNaN = require('is-nan');
var commandLineArgs = require('command-line-args');
var hexToRgb = require('hex-rgb');
var fs = require('fs');

var cli = commandLineArgs([
  { name: 'id', type: String, defaultOption: true },
  { name: 'filename', alias: 'f', type: String}
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

request('http://www.colourlovers.com/api/palette/'+ ID +'?format=json', function (error, response, content) {
  var output = '';
  var body;
  var name;

  content = JSON.parse(content);

  if (!error && response.statusCode == 200 && content.length > 0) {

    body = content[0];

    output += 'GIMP Paletten\n';
    output += 'Name: ' + body.title + '\n';
    output += 'Columns: 0\n';
    output += '#\n';

    body.colors.forEach(function(color){

      var rbg = hexToRgb(color);
      output += rbg[0] +'\t'+rbg[1] +'\t'+rbg[2] +'\n';

    });

    if(typeof options.filename == 'undefined'){
      name = getPaletteNameFromURL(body.url);
    } else {
      name = options.filename;
    }

    fs.writeFile('./'+name+'.gpl', output, function(err) {
      if(err) {
        return console.log(err);
      }
    });

  } else {

    if(content.length == 0){
      console.log('ERROR: Palette not found. Check if this palette really exists! ');
    }

  }

});

