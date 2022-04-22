const fs = require('fs');
const path = require('path');
const fsp = require('fs').promises;

/*fs.readFile('example.md', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  console.log(data);
});*/

readline = require('readline');

let reader = readline.createInterface({
  input: fs.createReadStream('md-files/example.md')
});

reader.on('line', function (line) {
  console.log(line);
});

/*fs.stat('C:/Users/vivia/Desktop/md-links/BOG004-md-links/otro.md', function(err) {
  if (err == null) {
    console.log("El archivo existe");
  } else if (err.code == 'ENOENT') {
    console.log("el archivo no existe");
  } else {
    console.log(err); // ocurrió algún error
  }
})*/

fsp.stat(__filename + '/otro.md')
.then((response)=>{
  console.log(__filename)
  console.log("El archivo existe", response)
})
.catch((err)=>{
  if (err.code == 'ENOENT') {
    console.log("el archivo no existe");
  } else {
    console.log(err); // ocurrió algún error
  }
})

console.log(path.isAbsolute('C:/Users/vivia/Desktop/md-links/BOG004-md-links'))
console.log(path.isAbsolute('/example.md'))
console.log(__filename)
console.log(path.relative('C:/Users/vivia/Desktop/md-links/BOG004-md-links/read.js', 'C:/Users/vivia/Desktop/md-links/BOG004-md-links/md-files/example.md'))
console.log(path.resolve('/read.js', '/example.md'))

