# palette-lovers

> Generate a palette file from a COLOURLovers palette

### Install
`npm install palette-lovers -g`

### Usage
Pass it a collor lovers palette url or the id of the palette.

```
$ palette-lovers http://www.colourlovers.com/palette/3950622/violet_gen
$ palette-lovers 3950622
$ palette-lovers 3950622 --filename violet_color_ramp
$ palette-lovers 3950622 --f violet_color_ramp
```

By default it will generate a .gpl palette file with the name of the palette in the directory you run it, but you can use the `--filename` option to change the name.

### Options
```
  -f, --filename  Set the name of the file 
  -h , --help     Display usage guide      
```