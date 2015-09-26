var Promise = require('bluebird'),
    uuid = require('uuid'),
    _ = require('lodash'),
    path = require('path'),
    fs = Promise.promisifyAll(require('fs'));

var storage = 'storage.json';
var flags = {};

module.exports = {
    config: function (opts) {
        opts = opts || {};
        if(!!opts) flags = opts;
        storage = opts.storage;
        buckets = loadData(storage);
    },
    clear: function () {
        return new Promise(function(resolve, reject){
            buckets = {};
            return resolve(buckets);
        });
    },
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
                return resolve(_.size(_.where(_.values(buckets[bucket]), model)));
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
    if(!!storage) {
        fs
        .writeFileAsync(storage, JSON.stringify(buckets))
        .then(function(){
            return resolve(model);
        })
        .catch(function(err){
            return reject(err);
        });
    } else {
        return reject(new Error('storage not configured'));
    }
}

function loadData(storageFilename) {
    var ret = {};
    storageFilename = path.normalize(storageFilename);
    if(fs.existsSync(storageFilename)) {
        ret = JSON.parse(fs.readFileSync(storageFilename, 'utf8'));
        if(!!flags.verbose) console.log('storage initialized from', storageFilename);
        return ret;
    } else {
        if(!!flags.verbose) console.log('warn:', storageFilename, 'not found');
        return ret;
    }
}
