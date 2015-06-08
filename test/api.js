var debug = require('debug')('dao:test'),
    should = require('chai').should(),
    dao = require('../index');

const TEST_MODEL = {
    name: 'joe',
    age: 23
};

var TEST_ID;
var TEST_EMAIL = 'joe@test.com';

describe("v0 api tests", function() {
    it('should fail if there no implementation provided', function(done){
        dao
        .create(TEST_MODEL)
        .then(function(res){
            debug(res)
            done();
        })
        .catch(function(err){
            should.exist(err);
            err.should.have.property('message');
            err.message.should.equal('No DAO implementation available');
            done();
        })
    });
    it('should validate implementations conforming to the dao schema v0', function(done){
        try {
            dao.use(dao.MEMORY);
            done();
        } catch(err) {
            done(err)
        }
    });
    it('should return a newly created model', function(done){
        try {
            dao
            .use(dao.MEMORY)
            .create(TEST_MODEL)
            .then(function(createdModel){
                should.exist(createdModel);
                createdModel.should.have.property('$id');
                TEST_ID = createdModel.$id;
                done();
            })
            .catch(function(err){
                done(err);
            })
        } catch(err) {
            done(err)
        }
    });
    it('should return an existing model', function(done){
        try {
            TEST_MODEL.$id = TEST_ID;
            dao
            .use(dao.MEMORY)
            .read(TEST_MODEL)
            .then(function(foundModel){
                should.exist(foundModel);
                foundModel.should.have.property('$id').and.equal(TEST_ID);
                done();
            })
            .catch(function(err){
                done(err);
            })
        } catch(err) {
            done(err)
        }
    });
    it('should return a valid updated model', function(done){
        try {
            TEST_MODEL.$id = TEST_ID;
            TEST_MODEL.email = TEST_EMAIL;
            dao
            .use(dao.MEMORY)
            .update(TEST_MODEL)
            .then(function(updatedModel){
                should.exist(updatedModel);
                updatedModel.should.have.property('email').and.equal(TEST_EMAIL);
                updatedModel.should.have.property('$updated');
                done();
            })
            .catch(function(err){
                done(err);
            })
        } catch(err) {
            done(err)
        }
    });
    it('should return the deleted model', function(done){
        try {
            TEST_MODEL.$id = TEST_ID;
            dao
            .use(dao.MEMORY)
            .delete(TEST_MODEL)
            .then(function(deletedModel){
                should.exist(deletedModel);
                deletedModel.should.have.property('$deleted');
                done();
            })
            .catch(function(err){
                done(err);
            })
        } catch(err) {
            done(err)
        }
    });
    it('should use file implementation when requested', function(done){
        try {
            dao
            .use(dao.FILE)
            .create(TEST_MODEL)
            .then(function(createdModel){
                should.exist(createdModel);
                createdModel.should.have.property('$id');
                TEST_ID = createdModel.$id;
                done();
            })
            .catch(function(err){
                done(err);
            })
        } catch(err) {
            done(err)
        }
    });
});