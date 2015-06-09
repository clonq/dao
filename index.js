var debug = require('debug')('dao:main'),
	Promise = require('bluebird'),
	schemaValidator = require('jsonschema'),
    v0Schema = require('./schemas/v0.json'),
    v1Schema = require('./schemas/v1.json'),
    v2Schema = require('./schemas/v2.json'),
	impl;

module.exports = {
	MEMORY: require('./impl/memory'),
	FILE: require('./impl/file'),
	use: function(impl){
		this.impl = impl;
		try {
			validate(impl, v0Schema);
			this.complianceLevel = 'v0';
			try {
				validate(impl, v1Schema);
				this.complianceLevel = 'v1';
				try {
					validate(impl, v2Schema);
					this.complianceLevel = 'v2';
				} catch(err) {
					// v1 compliant
				}
			} catch(err) {
				// v0 compliant
			}
			return this.impl;
		} catch(err) {
			throw new Error('Must provide at least a v0 compliant implementation');
		}
	},
	getComplianceLevel: function(){
		return this.complianceLevel;
	},
	register: function(model){

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

function validate(impl, schema) {
	if(impl) {
		var errors = schemaValidator.validate(impl, schema).errors;
		if(errors.length) throw new Error(errors[0].stack);
		else return impl;
	} else {
		throw new Error('Must provide an implementation');
	}
}
