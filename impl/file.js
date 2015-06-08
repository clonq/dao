var Promise = require('bluebird');

module.exports = {
    create: function (model) {
        return new Promise(function(resolve, reject){
            return reject(new Error('not implemented'));
        });
    },
    read: function (model) {
        return new Promise(function(resolve, reject){
            return reject(new Error('not implemented'));
        });
    },
    update: function (model) {
        return new Promise(function(resolve, reject){
            return reject(new Error('not implemented'));
        });
    },
    delete: function (model) {
        return new Promise(function(resolve, reject){
            return reject(new Error('not implemented'));
        });
    }
}
