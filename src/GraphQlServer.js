/*
 * @author David Menger
 */
'use strict';

const express = require('express');
const expressGraphql = require('express-graphql');

class GraphQlServer {

    constructor (schema, root) {
        this.app = express();

        this.app.use('/graphql', expressGraphql({
            schema,
            root,
            graphiql: true
        }));

        this.server = null;

        this.port = null;
    }

    listen (port) {
        if (this.server !== null) {
            return Promise.reject(new Error('Server is already running'));
        }
        this.port = port;
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

    onClose () {
        if (!this.server) {
            throw new Error('OnClose is allowed to attach only when server is running');
        }
        return new Promise((resolve) => {
            this.server.addListener('close', () => {
                this.server.removeAllListeners();
                resolve();
            });
        });
    }

    close () {
        if (this.server !== null) {
            this.server.close();
        }
    }

}

module.exports = GraphQlServer;
