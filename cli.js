#!/usr/bin/env node

const path = process.argv[2];
const options = {
    validate: false,
    stats: false,
}
if (process.argv.includes('--validate')) {
    options.validate = true
}
if (process.argv.includes('--stats')) {
    options.stats = true
}

const {mdLinks} = require('.');

mdLinks(path, options)
.then(result => {
    console.log(result)
})




