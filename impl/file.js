var Promise = require('bluebird'),
    uuid = require('uuid'),
    _ = require('lodash'),
    fs = Promise.promisifyAll(require('fs')),
    buckets = {};

const STORAGE = 'storage.json';

module.exports = {
    create: function (model) {
        return new Promise(function(resolve, reject){
            model.$id = uuid.v4();
            model.$created = Date.now();
            var bucket = model.$type || 'unknown';
            if(!buckets[bucket]) buckets[bucket] = {};
            buckets[bucket][model.$id] = model;
            return persist(model, resolve, reject);
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
                return persist(updatedModel, resolve, reject);
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
                return persist(deletedModel, resolve, reject);
            } else {
                return reject(new Error('required $id is missing'));
            }
        });
    },
    count: function (model) {
        return new Promise(function(resolve, reject){
            if(model) {
                var bucket = model.$type || 'unknown';
                delete model.$type;
                return resolve(_.size(_.values(buckets[bucket]), model));
            } else {
                return reject(new Error('required criteria missing'));
            }
        });
    },
    find: function (model) {
        return new Promise(function(resolve, reject){
            if(model) {
                var bucket = model.$type || 'unknown';
                delete model.$type;
                return resolve(_.where(_.values(buckets[bucket]), model));
            } else {
                return reject(new Error('required criteria missing'));
            }
        });
    },
    findOne: function (model) {
        return new Promise(function(resolve, reject){
            if(model) {
                var bucket = model.$type || 'unknown';
                delete model.$type;
                return resolve(_.findWhere(_.values(buckets[bucket]), model));
            } else {
                return reject(new Error('required criteria missing'));
            }
        });
    }
}

function persist(model, resolve, reject){
    fs
    .writeFileAsync(STORAGE, JSON.stringify(buckets))
    .then(function(){
        return resolve(model);
    })
    .catch(function(err){
        return reject(err);
    })
}
