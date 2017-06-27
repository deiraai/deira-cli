/*
 * @author David Menger
 */
'use strict';

const Store = require('./Store');
const os = require('os');
const path = require('path');

const DEIRA_FOLDER = '.deira';
const CONFIG_FILE = 'config.json';

const homeDir = os.homedir();
const deiraFolder = path.join(homeDir, DEIRA_FOLDER);

module.exports = new Store(deiraFolder, CONFIG_FILE);
