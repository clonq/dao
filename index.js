var debug = require('debug')('dao:main'),
	Promise = require('bluebird'),
	schemaValidator = require('jsonschema'),
    v0Schema = require('./schemas/v0.json'),
    v1Schema = require('./schemas/v1.json'),
    v2Schema = require('./schemas/v2.json');

module.exports = {
	MEMORY: require('./impl/memory'),
	FILE: require('./impl/file'),
	use: function(impl){
		this.impl = impl;
		try {
			validate(this.impl, v0Schema);
			this.complianceLevel = 'v0';
			try {
				validate(this.impl, v1Schema);
				this.complianceLevel = 'v1';
				try {
					validate(this.impl, v2Schema);
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
		if(this.impl) this.impl[model] = {};
		var compliantSchema;
		if(this.complianceLevel == 'v0') compliantSchema = v0Schema;
		else if(this.complianceLevel == 'v1') compliantSchema = v1Schema;
		else if(this.complianceLevel == 'v2') compliantSchema = v2Schema;
		if(compliantSchema) {
			var impl = this.impl;
			Object.keys(compliantSchema.properties).forEach(function(op){
				impl[model][op] = function(data){
					data.$type = model;
					return impl[op](data);
				}
			})
		}
	},
	clear: function (model) {
		return new Promise(function(resolve, reject){
			if(this.impl) return resolve(this.impl.clear());
			else return reject(new Error('No DAO implementation available'));
		});
	},
	create: function (model) {
		return new Promise(function(resolve, reject){
			if(this.impl) return resolve(this.impl.create(model));
			else return reject(new Error('No DAO implementation available'));
		});
	},
	read: function (model) {
		return new Promise(function(resolve, reject){
			if(this.impl) resolve(this.impl.read(model));
			else reject(new Error('No DAO implementation available'));
		});
	},
	update: function (model) {
		return new Promise(function(resolve, reject){
			if(this.impl) resolve(this.impl.update(model));
			else reject(new Error('No DAO implementation available'));
		});
	},
	delete: function (model) {
		return new Promise(function(resolve, reject){
			if(this.impl) resolve(this.impl.delete(model));
			else reject(new Error('No DAO implementation available'));
		});
	},
	count: function (model) {
		return new Promise(function(resolve, reject){
			if(this.impl) resolve(this.impl.count(model));
			else reject(new Error('No DAO implementation available'));
		});
	},
	find: function (model) {
		return new Promise(function(resolve, reject){
			if(this.impl) resolve(this.impl.find(model));
			else reject(new Error('No DAO implementation available'));
		});
	},
	findOne: function (model) {
		return new Promise(function(resolve, reject){
			if(this.impl) resolve(this.impl.findOne(model));
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
