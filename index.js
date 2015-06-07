var debug = require('debug')('dao'),
	Promise = require('bluebird'),
	schemaValidator = require('jsonschema'),
    v0Schema = require('./schemas/v0.json'),
	impl;

module.exports = {
	use: function(impl){
		this.impl = impl;
		validate(impl);
	},
	impl: function(){
		return this.impl;
	},
	put: function (model) {
		return new Promise(function(resolve, reject){
			if(impl) resolve(impl.put(model));
			else reject(new Error('No DAO implementation available'));
		});
	}
}

function validate(impl) {
	return new Promise(function(resolve, reject){
		if(impl) {
			var errors = schemaValidator.validate(impl, v0Schema).errors;
			if(errors.length) return reject(new Error(errors[0].stack))
			else return resolve(impl);
		} else {
			return reject(new Error('Must provide an implementation'));
		}
	});
}
