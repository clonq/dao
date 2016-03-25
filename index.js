var EventEmitter = require('events').EventEmitter;
var schemaValidator = require('jsonschema');
var v0Schema = require('./schemas/v0.json');
var v1Schema = require('./schemas/v1.json');
var v2Schema = require('./schemas/v2.json');

function Dao(impl) {
    EventEmitter.call(this);
    this.impl = impl;
    this.complianceLevel = determineComplianceLevel(this.impl);
    createInterface.call(this);
    this.register = register;
}

require('util').inherits(Dao, EventEmitter);

function use(impl) {
    return new Dao(impl);
}

function getComplianceLevel(){
    return this.complianceLevel;
}

function createInterface(){
    var self = this;
    var compliantSchema;
    if(this.complianceLevel == 'v0') compliantSchema = v0Schema;
    else if(this.complianceLevel == 'v1') compliantSchema = v1Schema;
    else if(this.complianceLevel == 'v2') compliantSchema = v2Schema;
    // add compliant methods
    if(compliantSchema) {
        Object.keys(compliantSchema.properties).forEach(function(op){
            self[op] = function(model){
                if(self.registeredType) model.$type = self.registeredType;
                self.impl[op].call(self, model, function(err, res){
                    if(err) self.emit('error', err);
                    else self.emit(op, res);
                });
                return self;
            }
        });
    }
    return this;
}

function register(model){
    if(model.$type) this.registeredType = model.$type;
    return createInterface.call(this);
}

module.exports = {
    use: use,
    getComplianceLevel: getComplianceLevel,
    register: register
}

function determineComplianceLevel(impl) {
    var complianceLevel;
    try {
        validate(impl, v0Schema);
        complianceLevel = 'v0';
        try {
            validate(impl, v1Schema);
            complianceLevel = 'v1';
            try {
                validate(impl, v2Schema);
                complianceLevel = 'v2';
            } catch(err) {
                // v1 compliant
            }
        } catch(err) {
            // v0 compliant
        }
        return complianceLevel;
    } catch(err) {
        throw new Error('Must provide at least a v0 compliant implementation');
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
