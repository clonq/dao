var should = require('chai').should();
var dao = require('../index');
var dummyAdapter = require('../impl/dummy');
var notImplementedAdapter = require('../impl/notimplemented');

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
    it('should register a model', function(done){
        try {
            var rDao = dao
            .use(notImplementedAdapter)
            .register({$type:'test'});
            rDao.should.have.property('test');
            rDao.test.should.have.property('create');
            done();
        } catch(err){
            done(err);
        }
    });    
});
