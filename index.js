var debug = require('debug')('dao:main'),
	Promise = require('bluebird'),
	schemaValidator = require('jsonschema'),
    v0Schema = require('./schemas/v0.json'),
	impl;

module.exports = {
	MEMORY: require('./impl/memory'),
	FILE: require('./impl/file'),
	use: function(impl){
		this.impl = impl;
		return validate(impl);
	},
	create: function (model) {
		return new Promise(function(resolve, reject){
			if(impl) return resolve(impl.create(model));
			else return reject(new Error('No DAO implementation available'));
		});
	},
	read: function (model) {
		return new Promise(function(resolve, reject){
			if(impl) resolve(impl.read(model));
			else reject(new Error('No DAO implementation available'));
		});
	},
	update: function (model) {
		return new Promise(function(resolve, reject){
			if(impl) resolve(impl.update(model));
			else reject(new Error('No DAO implementation available'));
		});
	},
	delete: function (model) {
		return new Promise(function(resolve, reject){
			if(impl) resolve(impl.delete(model));
			else reject(new Error('No DAO implementation available'));
		});
	}
}

function validate(impl) {
	if(impl) {
		var errors = schemaValidator.validate(impl, v0Schema).errors;
		if(errors.length) throw new Error(errors[0].stack);
		else return impl;
	} else {
		throw new Error('Must provide an implementation');
	}
}
