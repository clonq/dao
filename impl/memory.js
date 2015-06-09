var Promise = require('bluebird'),
    schemaValidator = require('jsonschema'),
    uuid = require('uuid'),
    _ = require('lodash'),
    userSchema = require('bonsens-models').user,
    buckets = {};

module.exports = {
    create: function (model) {
        return new Promise(function(resolve, reject){
            userSchema.required = [];
            var schemaErrors = schemaValidator.validate(model, userSchema).errors;
            if(schemaErrors.length == 0) {
                model.$id = uuid.v4();
                model.$created = Date.now();
                var bucket = model.$type || 'unknown';
                if(!buckets[bucket]) buckets[bucket] = {}
                buckets[bucket][model.$id] = model;
                return resolve(model);
            } else {
                return reject(new Error(schemaErrors[0].stack));
            }
        });
    },
    read: function (model) {
        return new Promise(function(resolve, reject){
            userSchema.required = ['$id'];
            var schemaErrors = schemaValidator.validate(model, userSchema).errors;
            if(schemaErrors.length == 0) {
                var bucket = model.$type || 'unknown';
                return resolve(buckets[bucket][model.$id]);
            } else {
                return reject(new Error(schemaErrors[0].stack));
            }
        });
    },
    update: function (model) {
        return new Promise(function(resolve, reject){
            userSchema.required = ['$id'];
            var schemaErrors = schemaValidator.validate(model, userSchema).errors;
            if(schemaErrors.length == 0) {
                var bucket = model.$type || 'unknown';
                var existingModel = buckets[bucket][model.$id];
                var updatedModel = _.defaults(model, existingModel);
                updatedModel.$updated = Date.now();
                if(!buckets[bucket]) buckets[bucket] = {}
                buckets[bucket][model.$id] = updatedModel;
                return resolve(updatedModel);
            } else {
                return reject(new Error(schemaErrors[0].stack));
            }
        });
    },
    delete: function (model) {
        return new Promise(function(resolve, reject){
            userSchema.required = ['$id'];
            var schemaErrors = schemaValidator.validate(model, userSchema).errors;
            if(schemaErrors.length == 0) {
                var bucket = model.$type || 'unknown';
                var deletedModel = buckets[bucket][model.$id];
                deletedModel.$deleted = Date.now();
                delete buckets[bucket][model.$id];
                return resolve(deletedModel);
            } else {
                return reject(new Error(schemaErrors[0].stack));
            }
        });
    }
}
