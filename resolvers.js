/*
 * @author David Menger
 */
'use strict';

module.exports = {
    Query: {
        user: (root, args, context) => {
            return { id: '1', apiProjects: [{ id: 'oneapi' }] };
        },
    },
    Mutation: {
        createProject: (root, args, context) => {
            return { id: 'adasdasd' }
        },
    },
    GraphQLAPIProject: {
        id: () => {
            return "twoapi"
        },
        name: (root, args, context) => {
            return "Joe Doe";
        }
    }
};
