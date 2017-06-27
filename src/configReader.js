/*
 * @author David Menger
 */
'use strict';

const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const Ajv = require('ajv');

function promiseRead (filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function configReader (directory, schema) {
    const filename = path.join(directory, 'deira.yaml');
    let config;

    return promiseRead(filename)
        .catch(() => { throw new Error(`Can't read file ${filename}`); })
        .then((yaml) => {
            config = jsYaml.safeLoad(yaml);
            const ajv = new Ajv();
            return ajv.compile(Object.assign({ $async: true }, schema));
        })
        .then(validator => validator(config));
}

module.exports = configReader;
