#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { access, constants } = require('fs')
const { marked } = require('marked');
const { resolve } = require('path');
const fetch = require('node-fetch');
readline = require('readline');
const colors = require('colors')

colors.setTheme({
  err: 'magenta',
  result: 'bgCyan'
});

const resolveAndExist = (ruta) => {
  let pathResolve = path.resolve(ruta);
  return new Promise((resolve, reject) => {
    fs.access(pathResolve, constants.F_OK, (err) => {
      const existPath = err ? 'does not exist' : 'exists';
      if (existPath === 'exists') {
        // console.log('Path exists ' + pathResolve)
        resolve(pathResolve.replaceAll(/\\/g, '/'))
      }
      reject('Path does not exist'.err)
    });
  })
}

const fileOrDirectory = (ruta) => {
  return new Promise((resolve, reject) => {
    fs.stat(ruta, (err, stats) => {
      if (!err) {
        if (stats.isFile() && path.extname(ruta) == '.md') {
          // console.log('It is a .md file')
          resolve([ruta])
        }
        if (stats.isDirectory()) {
          // console.log('It is a directory')
          resolve(ReadingDirectory(ruta))
        }
      }
      reject('Is not or does not exist .md files'.err)
    })
  })
}

const arrayFiles = [];
function ReadingDirectory(ruta) {
  const files = fs.readdirSync(ruta);
  files.forEach(file => {
    let fileAbsolute = path.resolve(ruta, file)
    let status = fs.statSync(fileAbsolute);
    if (status.isDirectory()) {
      ReadingDirectory(fileAbsolute)
    }
    if (status.isFile() && path.extname(fileAbsolute) == '.md') {
      arrayFiles.push(fileAbsolute.replaceAll(/\\/g, '/'))
    }
  })
  return arrayFiles
}

const getLinks = (fileMd) => {
  let regExpo = new RegExp(/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/);
  return new Promise((resolve, reject) => {
    fs.readFile(fileMd, 'utf8', (error, info) => {
      if (!error) {
        let links = [];
        let render = new marked.Renderer();
        render.link = function (href, title, text) {
          if (regExpo.test(href) === true) {
            links.push({
              href: href,
              text: text.slice(0, 50),
              fileMd: fileMd,
            })
          }
        };
        marked(info, {
          renderer: render
        });
        resolve(links)
      }
      else {
        reject(error)
      }
    }
    );
  })
}

const readingFiles = (arrayFiles) => {
  let arrayLinks = [];
  return new Promise((resolve, reject) => {
    arrayFiles.forEach(file => {
      arrayLinks = arrayLinks.concat(getLinks(file))
    })
    Promise.all(arrayLinks).then((result) => {
      if (result.flat().length === 0) {
        reject('No found links'.err)
      }
      resolve(result.flat())
    })
  })
}

const validateLinks = (link) => {
  return new Promise((resolve, reject) => {
    fetch(link.href).then(data => {
      if (data.status === 200) {
        link.status = data.status
        link.response = data.statusText
      }
      else {
        link.status = data.status
        link.response = 'FAIL'
      }
      resolve(link)
      reject('¡Something went wrong! no validate links!'.err)
    })
  })
}

const validationArrayLinks = (arrayLinks) => {
  let arrayValidateLinks = [];
  return new Promise((resolve) => {
    arrayLinks.forEach(link => {
      arrayValidateLinks.push(validateLinks(link))
    })
    Promise.all(arrayValidateLinks).then((result) => {
      resolve(result)
    })
  })
}

const StatsOption = (arrayLinks) => {
    let allLinks = arrayLinks.map(link => link.href);
    let totalLinks = arrayLinks.length;
    let uniqueLinks = [...new Set(allLinks)];
    
      let statsResult = {
        Total: totalLinks,
        Unique: uniqueLinks.length,
      }
      console.log('STATS: '.result)
      return statsResult;
    
}

const validateStatsOption = (arrayLinks) => {
  let allLinks = arrayLinks.map(link => link.href)
  let statusLink = arrayLinks.map(link => link.response)
  let totalLinks = arrayLinks.length;
  let uniqueLinks = [...new Set(allLinks)];
  let brokenLinks = statusLink.toString().match(/FAIL/g);  
  let statsValidateResult = {};
  if(brokenLinks === null) { 
    statsValidateResult = {
      Total: totalLinks,
      Unique: uniqueLinks.length,
      Broken: 0,
    }
  }
  else{
    statsValidateResult = {
      Total: totalLinks,
      Unique: uniqueLinks.length,
      Broken: brokenLinks.length,
  }
}   console.log('VALIDATE STATS: '.result);
    return statsValidateResult
  
}

const mdLinks = (path, options) => {
    return new Promise((res) => {
        resolveAndExist(path)
            .then(resolvePath => {
                return fileOrDirectory(resolvePath)
            })
            .then(arrayFiles => {
                return readingFiles(arrayFiles)
            })
            .then(links => {
                if (!options.stats && !options.validate) {
                    res(links)  
                }
                if (options.stats && !options.validate) {
                    res(StatsOption(links))
                }
                return validationArrayLinks(links)
            })
            .then(linksValidated => {
                if (!options.stats && options.validate) {
                    res(linksValidated);
                }
                if (options.stats && options.validate) {
                    res(validateStatsOption(linksValidated))
                }
            })
            .catch(error => {
                console.log(error)
            })
    })
}

module.exports = {mdLinks, StatsOption, validateStatsOption}