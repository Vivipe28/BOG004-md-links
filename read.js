const fs = require('fs');
const path = require('path');
const fsp = require('fs').promises;

// readline = require('readline');

// let reader = readline.createInterface({
//   input: fs.createReadStream('md-files/example.md')
// });

// reader.on('line', function (line) {
//   console.log(line);
// });

const resolveAndExistPromise = (ruta) => {
  let pathResolve = path.resolve(ruta)
  let existPath = fs.existsSync(pathResolve)
  return new Promise((resolve, reject) => {
    if (existPath === true) {
      console.log('La ruta existe')
      resolve(pathResolve.replaceAll(/\\/g, '/'))
    }
    reject('La ruta no existe')
  })
}

const fileOrDirectory = (ruta) => {
  return new Promise((resolve, reject) => {
    fs.stat(ruta, (err, stats) => {
      if (!err) {
        if (stats.isFile()) {
          console.log('Es un archivo? ' + stats.isFile())
          resolve(ruta)
        }
        else if (stats.isDirectory()) {
          console.log('Es un directorio? ' + stats.isDirectory())
          fs.readdir(ruta, (error, files) => {
            if (error){
              console.log('ERROR DEL IF', error)
              resolve('ESTE ES EL ERROR DEL RESOLVE')
            }
            else{
              resolve(files)
              console.log('FILES', files)
            }
          });
        }
      }
      else reject('Se produjo un error');
    });
  })
}

// isMD()

let ruta = 'md-files';

resolveAndExistPromise(ruta)
  .then(res => {
    console.log('RES DEL EXIST', res)
    return fileOrDirectory(res)
  })
  .then(response => {
    console.log('DE NUEVO RES', response)
  })
  .catch(error => {
    console.log('DE NUEVO ERROR', error)
    })
  //})
 /* .catch(error => {
    console.log('ÚLTIMO ERROR', error)
  })*/

// let rutaResuelta = 'C:/Users/vivia/Desktop/md-links/BOG004-md-links/md-files';

// fileOrDirectory(rutaResuelta)
//   .then(res => {
//     console.log(res)
//   })
//   .catch(error => {
//     console.log(error)
//   })
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});