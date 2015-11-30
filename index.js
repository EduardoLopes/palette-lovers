#!/usr/bin/env node

var request = require('request');
var isNaN = require('is-nan');
var commandLineArgs = require('command-line-args');
var hexToRgb = require('hex-rgb');
var fs = require('fs');

var cli = commandLineArgs([
  { name: 'id', type: String, defaultOption: true, description: 'The id of the palette'},
  { name: 'filename', alias: 'f', type: String, description: 'Set the name of the file'},
  { name: 'help', alias: 'h', type: Boolean, description: 'Display usage guide'}
]);

var options = cli.parse();

var ID;

if(options.help){
  console.log(cli.getUsage({
    title: 'palette-lovers',
    description: 'Generate a palette file with a COLOURLovers palette',
    synopsis: [
      '$ palette-lovers http://www.colourlovers.com/palette/3950622/violet_gen',
      '$ palette-lovers 3950622',
      '$ palette-lovers 3950622 --filename violet_color_ramp',
      '$ palette-lovers 3950622 --f violet_color_ramp'
    ],
    hide: "id"
  }));

  return false;

}


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

