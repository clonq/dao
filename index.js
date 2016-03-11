var EventEmitter = require('events');
var util = require('util');
var schemaValidator = require('jsonschema');
var v0Schema = require('./schemas/v0.json');
var v1Schema = require('./schemas/v1.json');
var v2Schema = require('./schemas/v2.json');

function Dao(impl) {
    EventEmitter.call(this);
    this.impl = impl;
    this.config = config;
    this.create = create;
    this.read = read;
    this.update = update;
    this.delete = daoDelete;
    this.count = count;
    this.find = find;
    this.findOne = findOne;
    this.remove = remove;
    this.save = save;
    this.upsert = upsert;
    this.bulkCreate = bulkCreate;
    this.bulkUpdate = bulkUpdate;
    this.bulkDelete = bulkDelete;
    this.complianceLevel = determineComplianceLevel(this.impl);
    this.register = register;
}

util.inherits(Dao, EventEmitter);

function use(impl) {
    return new Dao(impl);
}

function config(opts) {
    if(this.impl.config) {
        this.impl.config.call(this, opts);
        this.emit('config', opts);
    }
    return this;
}

function create(model) {
    var self = this;
    if(this.impl.create) {
        this.impl.create.call(this, model, function(err, model){
            if(err) self.emit('error', err);
            else self.emit('create', model);
        });
    }
    return this;
}

function read(model) {
    var self = this;
    if(this.impl.read) {
        this.impl.read.call(this, model, function(err, model){
            if(err) self.emit('error', err);
            else self.emit('read', model);
        });
    }
    return this;
}

function update(model) {
    var self = this;
    if(this.impl.update) {
        this.impl.update.call(this, model, function(err, model){
            if(err) self.emit('error', err);
            else self.emit('update', model);
        });
    }
    return this;
}

function daoDelete(model) {
    var self = this;
    if(this.impl.delete) {
        this.impl.delete.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('delete', model);
        });
    }
    return this;
}

function count(model) {
    var self = this;
    if(this.impl.count) {
        this.impl.count.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('count', model);
        });
    }
    return this;
}

function find(model) {
    var self = this;
    if(this.impl.find) {
        this.impl.find.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('find', model);
        });
    }
    return this;
}

function findOne(model) {
    var self = this;
    if(this.impl.findOne) {
        this.impl.findOne.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('findOne', model);
        });
    }
    return this;
}

function clear(model) {
    var self = this;
    if(this.impl.clear) {
        this.impl.clear.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('clear', model);
        });
    }
    return this;
}

function remove(model) {
    var self = this;
    if(this.impl.remove) {
        this.impl.remove.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('remove', model);
        });
    }
    return this;
}

function save(model) {
    var self = this;
    if(this.impl.save) {
        this.impl.save.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('save', model);
        });
    }
    return this;
}

function upsert(model) {
    var self = this;
    if(this.impl.upsert) {
        this.impl.upsert.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('upsert', model);
        });
    }
    return this;
}

function bulkCreate(model) {
    var self = this;
    if(this.impl.bulkCreate) {
        this.impl.bulkCreate.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('bulkCreate', model);
        });
    }
    return this;
}

function bulkUpdate(model) {
    var self = this;
    if(this.impl.bulkUpdate) {
        this.impl.bulkUpdate.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('bulkUpdate', model);
        });
    }
    return this;
}

function bulkDelete(model) {
    var self = this;
    if(this.impl.bulkDelete) {
        this.impl.bulkDelete.call(this, model, function(err){
            if(err) self.emit('error', err);
            else self.emit('bulkDelete', model);
        });
    }
    return this;
}

function getComplianceLevel(){
    return this.complianceLevel;
}

function register(model){
    var self = this;
    if(model.$type) self[model.$type] = {};
    var compliantSchema;
    if(this.complianceLevel == 'v0') compliantSchema = v0Schema;
    else if(this.complianceLevel == 'v1') compliantSchema = v1Schema;
    else if(this.complianceLevel == 'v2') compliantSchema = v2Schema;
    if(compliantSchema) {
        Object.keys(compliantSchema.properties).forEach(function(op){
            if(model.$type) {
                self[model.$type][op] = function(data){
                    data.$type = model;
                    return self[op](data);
                }
            }
        })
    }
    return this;
}

module.exports = {
    use: use,
    getComplianceLevel: getComplianceLevel
}

function determineComplianceLevel(impl) {
    var complianceLevel;
    try {
        validate(impl, v0Schema);
        complianceLevel = 'v0';
        try {
            validate(this.impl, v1Schema);
            complianceLevel = 'v1';
            try {
                validate(this.impl, v2Schema);
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
