var Promise = require('bluebird'),
	schemaValidator = require('jsonschema'),
	uuid = require('uuid'),
	userSchema = require('bonsens-models').user,
	buckets = {};

module.exports = {
	create: function (model) {
		return new Promise(function(resolve, reject){
        	var schemaErrors = schemaValidator.validate(model, userSchema).errors;
        	if(schemaErrors.length == 0) {
        		model.$id = uuid.v4();
        		var bucket = model.$type || 'unknown';
        		bucket[model.$id] = model;
        		return resolve(model);
        	} else {
				return reject(new Error(schemaErrors[0].stack));
        	}
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
