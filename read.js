const fs = require('fs');
const path = require('path');
const { access, constants } = require('fs')

const resolveAndExistPromise = (ruta) => {
  let pathResolve = path.resolve(ruta);
  return new Promise((resolve, reject) => {
    fs.access(pathResolve, constants.F_OK, (err) => {
      const existPath = err ? 'does not exist' : 'exists';
      if (existPath === 'exists') {
        console.log('La ruta existe')
        resolve(pathResolve.replaceAll(/\\/g, '/'))
      }
      reject('La ruta no existe')
    });
  })
}

const fileOrDirectory = (ruta) => {
  return new Promise((resolve, reject) => {
    fs.stat(ruta, (err, stats) => {
      if (!err) {
        if (stats.isFile() && path.extname(ruta) == '.md') {
          console.log('Es un archivo .md? ' + stats.isFile())
          resolve([ruta])
        }
        else if (stats.isDirectory()) {
          console.log('Es un directorio? ' + stats.isDirectory())
          const files = fs.readdirSync(ruta)
          let arrayFiles = [];
          files.forEach(file => {
            if (path.extname(file) == '.md') {
              arrayFiles.push(path.resolve(file))
            }
          })
          resolve(arrayFiles)
        }
      }
      reject('No es o no existen archivos md.')
    })
  })
}

let ruta = 'md-files';

resolveAndExistPromise(ruta)
  .then(res => {
    console.log('Esta es la ruta absoluta', res)
    return fileOrDirectory(res)
  })
  .then(response => {
    console.log('Archivos obtenidos', response)
  })
  .catch(error => {
    console.log(error)
  })

  // readline = require('readline');

// let reader = readline.createInterface({
//   input: fs.createReadStream('md-files/example.md')
// });

// reader.on('line', function (line) {
//   console.log(line);
// });