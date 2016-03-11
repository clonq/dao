var should = require('chai').should();
var dao = require('../index');
var dummyAdapter = require('./fixtures/dummy');
var notImplementedAdapter = require('./fixtures//notimplemented');

describe("common api tests", function() {
    it('should fail for invalid adapters', function(done){
        try {
            dao.use(dummyAdapter);
        } catch(err){
            should.exist(err);
            err.message.should.equal('Must provide at least a v0 compliant implementation')
            done();
        }
    });
    it('should accept v0 adapters', function(done){
        try {
            dao.use(notImplementedAdapter);
            done();
        } catch(err){
            done(err);
        }
    });    
    it('should expose CRUD methods when a concrete implementation is available', function(){
        var testDao = dao.use(notImplementedAdapter);
        testDao.should.have.property('create');
        testDao.should.have.property('read');
        testDao.should.have.property('update');
        testDao.should.have.property('delete');
    });
    it('should expose CRUD methods when registering a model with a concrete implementation', function(){
        var testModel = { $type: 'test' };
        var testDao = dao.use(notImplementedAdapter).register(testModel);
        testDao.should.have.property('create');
        testDao.should.have.property('read');
        testDao.should.have.property('update');
        testDao.should.have.property('delete');
    });
    it('should expose CRUD methods when registering a model before using a concrete implementation', function(done){
        var testModel = { key: 'value' };
        var testDao = dao.register({$type: 'test'}).use(notImplementedAdapter)
        testDao.should.have.property('create');
        testDao.should.have.property('read');
        testDao.should.have.property('update');
        testDao.should.have.property('delete');
        testDao
        .on('create', function(model){
            should.exist(model);
            model.should.have.property('key');
            model.should.not.have.property('$type');
            done();
        })
        .on('error', function(err){
            done(err);
        })
        .create(testModel);
    });
    it('should not expose any methods when registering a model with no implementation available', function(){
        var testModel = { $type: 'test' };
        var testDao = dao.register(testModel);
        should.exist(testDao);
        testDao.should.not.have.property('create');
    });
    it('should invoke adapter methods', function(done){
        var testModel = { key: 'value' };
        dao
        .use(notImplementedAdapter)
        .on('create', function(model){
            should.exist(model);
            model.should.have.property('key');
            model.should.not.have.property('$type');
            done();
        })
        .on('error', function(err){
            done(err);
        })
        .create(testModel);
    });
    it('should augment registered models', function(done){
        var testModel = { key: 'value' };
        dao
        .use(notImplementedAdapter)
        .register({$type:'test'})
        .on('create', function(model){
            should.exist(model);
            model.should.have.property('key');
            model.should.have.property('$type');
            done();
        })
        .on('error', function(err){
            done(err);
        })
        .create(testModel);
    });
});
