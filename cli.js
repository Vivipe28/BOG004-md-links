#!/usr/bin/env node
const path = process.argv[2];
const options = {
    validate : false,
    stats : false,
 }
if(process.argv.includes('--validate')){
   options.validate = true 
} 
if(process.argv.includes('--stats')){
    options.stats = true 
 } 

const { resolveAndExist,
    fileOrDirectory,
    readingFiles,
    validationArrayLinks,
    validateStatsOption } = require(".")


    const mdLinks = (path, options) => {
        return new Promise ((res,rej)=> {
            resolveAndExist(path)
            .then(res => {
                // console.log('This is absolute path', res)
                return fileOrDirectory(res)
            })
            .then(response => {
                // console.log('Files found', response)
                return readingFiles(response)
            })
            .then(links => {
                if(options.stats){
                    console.table(validateStatsOption(links))
                }
                    // console.log('Links found', links)
                    res(links)
            })
        })
    }
       
        // .then(ValidLink => {
        //     return validateStatsOption(ValidLink, options)
        // })
        // .then(finalResult => {
        //     return finalResult
        // })
        // .catch(error => {
        //     console.log(error)
        // })

mdLinks(path,options)



