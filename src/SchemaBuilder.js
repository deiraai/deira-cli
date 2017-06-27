/*
 * @author David Menger
 */
'use strict';

const graphql = require('graphql');
const path = require('path');
const fs = require('fs');

class SchemaBuilder {

    constructor (resolvers, directory, schemas) {
        this._directory = directory;
        this._schemas = schemas;
        this._resolvers = resolvers;

        this._schema = '';

        this._loading = null;

        this._cachedSchema = null;
    }

    _loadSchema (file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                this._schema += `\n${res}\n`;
                resolve();
            });
        });
    }

    _loadSchemas () {
        let file;
        const wait = [];
        this._schemas.forEach((schemaFile) => {
            file = path.join(this._directory, schemaFile);
            wait.push(this._loadSchema(file));
        });
        return Promise.all(wait)
            .then(() => this._schema);
    }

    _iterateFields (type, resolvers) {
        if (typeof resolvers !== 'object'
            || typeof type.getFields !== 'function') {

            return;
        }

        const fields = type.getFields();
        let field;
        let resolver;
        Object.keys(fields)
            .forEach((name) => {
                if (typeof resolvers[name] === 'undefined') {
                    return;
                }
                field = fields[name];
                resolver = resolvers[name];
                if (typeof resolver === 'function') {
                    field.resolve = resolver;
                } else {
                    field.resolve = () => resolver;
                }
            });
    }

    _iterateTypes (typeMap, resolvers) {
        Object.keys(typeMap)
            .forEach(name => this._iterateFields(typeMap[name], resolvers[name]));
    }

    schema () {
        if (this._cachedSchema !== null) {
            return Promise.resolve(this._cachedSchema);
        }
        return this.build();
    }

    build () {
        if (this._loading !== null) {
            return this._loading;
        }

        this._schema = '';
        this._cachedSchema = null;
        this._loading = this._loadSchemas()
            .then((schemaString) => {
                const schema = graphql.buildSchema(schemaString);
                this._iterateTypes(schema.getTypeMap(), this._resolvers);
                this._cachedSchema = schema;
                this._loading = null;
                return schema;
            });

        return this._loading;
    }

}

module.exports = SchemaBuilder;
