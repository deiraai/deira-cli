/*
 * @author David Menger
 */
'use strict';

const path = require('path');
const configReader = require('./configReader');
const SchemaBuilder = require('./SchemaBuilder');
const GraphQlServer = require('./GraphQlServer');

const yamlSchema = module.require('./yamlSchema.json');

function runServer (port) {
    const directory = process.cwd();
    let config;
    let builder;
    return configReader(directory, yamlSchema)
        .then((cfg) => {
            config = cfg;
            try {
                const dynamicImport = path.join(directory, config.resolversRoot);
                const resolvers = module.require(dynamicImport);
                builder = new SchemaBuilder(resolvers, directory, cfg.schemas);
                return builder.schema();
            } catch (e) {
                throw new Error(`Can't find resolversRoot: ${cfg.resolversRoot}`);
            }
        })
        .then((schema) => {
            const server = new GraphQlServer(schema);
            return server.listen(port);
        });
}

module.exports = {
    runServer
};
