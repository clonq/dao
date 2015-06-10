var Promise = require('bluebird'),
    uuid = require('uuid'),
    _ = require('lodash'),
    buckets = {};

module.exports = {
    create: function (model) {
        return new Promise(function(resolve, reject){
            model.$id = uuid.v4();
            model.$created = Date.now();
            var bucket = model.$type || 'unknown';
            if(!buckets[bucket]) buckets[bucket] = {};
            buckets[bucket][model.$id] = model;
            return resolve(model);
        });
    },
    read: function (model) {
        return new Promise(function(resolve, reject){
            if(model && model.$id) {
                var bucket = model.$type || 'unknown';
                return resolve(buckets[bucket][model.$id]);
            } else {
                return reject(new Error('required $id is missing'));
            }
        });
    },
    update: function (model) {
        return new Promise(function(resolve, reject){
            if(model && model.$id) {
                var bucket = model.$type || 'unknown';
                var existingModel = buckets[bucket][model.$id];
                var updatedModel = _.defaults(model, existingModel);
                updatedModel.$updated = Date.now();
                if(!buckets[bucket]) buckets[bucket] = {}
                buckets[bucket][model.$id] = updatedModel;
                return resolve(updatedModel);
            } else {
                return reject(new Error('required $id is missing'));
            }
        });
    },
    delete: function (model) {
        return new Promise(function(resolve, reject){
            if(model && model.$id) {
                var bucket = model.$type || 'unknown';
                var deletedModel = buckets[bucket][model.$id];
                deletedModel.$deleted = Date.now();
                delete buckets[bucket][model.$id];
                return resolve(deletedModel);
            } else {
                return reject(new Error('required $id is missing'));
            }
        });
    }
}
