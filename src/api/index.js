/*
 * @author David Menger
 */
'use strict';

const Auth = require('./Auth');
const config = require('../config');

module.exports = {
    auth: new Auth(config.apiPath)
};
