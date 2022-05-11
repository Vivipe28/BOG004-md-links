#!/usr/bin/env node

const { mdLinks,
    fileOrDirectory,
    readingFiles,
    validationArrayLinks,
    validateStatsOption } = require(".")

const validateOptions = () => {
    const validate = process.argv.toString().match(/--validate/g);
    const stats = process.argv.toString().match(/--stats/g);
    return {
        validate,
        stats,
    };
}

const commands = () => {
    const path = process.argv[2];
    const options = validateOptions();
    mdLinks(path, options)
        .then(res => {
            // console.log('This is absolute path', res)
            return fileOrDirectory(res)
        })
        .then(response => {
            // console.log('Files found', response)
            return readingFiles(response, options)
        })
        .then(links => {
            if (!options.stats && !options.validate) {
                console.log('Links found', links)
            }
            return validationArrayLinks(links)
        })
        .then(ValidLink => {
            return validateStatsOption(ValidLink, options)
        })
        .then(finalResult => {
            return finalResult
        })
        .catch(error => {
            console.log(error)
        })
};

commands();


