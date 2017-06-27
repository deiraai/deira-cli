/*
 * @author David Menger
 */
'use strict';

const CATS = [
    { id: '1', name: 'Nyan cat' },
    { id: '2', name: 'Grumpy cat' },
    { id: '3', name: 'Kittler' }
];

module.exports = {
    Query: {
        cat (obj, { id }) {
            const intId = parseInt(id, 10);
            if (!intId || intId > CATS.length) {
                return null;
            }
            return CATS[intId - 1];
        },
        catsList () {
            return CATS;
        }
    }
};
