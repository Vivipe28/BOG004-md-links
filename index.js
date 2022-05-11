#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { access, constants } = require('fs')
const { marked } = require('marked');
const { resolve } = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
readline = require('readline');

const mdLinks = (ruta) => {
  let pathResolve = path.resolve(ruta);
  return new Promise((resolve, reject) => {
    fs.access(pathResolve, constants.F_OK, (err) => {
      const existPath = err ? 'does not exist' : 'exists';
      if (existPath === 'exists') {
        // console.log('Path exists ' + pathResolve)
        resolve(pathResolve.replaceAll(/\\/g, '/'))
      }
      reject('Path does not exist')
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
      reject('Is not or does not exist .md files')
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
        reject('no found links')
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
      reject('¡Something went wrong! no validate links ')
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
      // console.log(result)
      resolve(result)
    })
  })
}

const validateStatsOption = (arrayLinks, option) => {
  return new Promise((resolve, reject) => {
    let allLinks = arrayLinks.map(link => link.href)
    let statusLink = arrayLinks.map(link => link.response)
    let totalLinks = arrayLinks.length;
    let uniqueLinks = [...new Set(allLinks)];
    let brokenLinks = statusLink.toString().match(/FAIL/g);
    if (option.stats && !option.validate) {
      let statsResult = {
        Total: totalLinks,
        Unique: uniqueLinks.length,
      }
      resolve(console.table(statsResult))
    }
    if (option.stats && option.validate) {
      let statsResult = {
        Total: totalLinks,
        Unique: uniqueLinks.length,
        Broken: brokenLinks.length,
      }
      resolve(console.table(statsResult))
    }
    if(option.validate && !option.stats){
      resolve(console.log(arrayLinks))
    }
  })
}

  module.exports = {
  mdLinks,
  fileOrDirectory,
  readingFiles,
  validationArrayLinks,
  validateStatsOption
}
