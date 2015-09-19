const TEST_STORAGE = '{"user":{"e9f48ec6-c056-4404-911a-a15e1f0f8196":{"name":"jim","age":23,"$id":"e9f48ec6-c056-4404-911a-a15e1f0f8196","$created":1434580464913,"email":"jim@test.com","$updated":1434580464906,"$deleted":1434580464908,"$type":"user"}}}';
require('fs').writeFileSync('storage.json', TEST_STORAGE);

var debug = require('debug')('dao:test'),
    should = require('chai').should(),
    dao = require('../index');

const TEST_MODEL = {
    name: 'joe',
    age: 23
};

var TEST_ID;
var TEST_EMAIL = 'joe@test.com';

describe("v0 common api tests", function() {
    it('should fail if no implementation is provided', function(done){
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
    it('should validate implementors', function(done){
        try {
            var impl = dao.use(dao.MEMORY);
            //v0 compliant
            impl.should.have.property('create');
            impl.should.have.property('read');
            impl.should.have.property('update');
            impl.should.have.property('delete');
            //v1 compliant
            impl.should.have.property('count');
            impl.should.have.property('find');
            impl.should.have.property('findOne');
            //todo: non v2 compliant
            done();
        } catch(err){
            done(err);
        }
    });
});

describe("v0 api tests - memory implementation", function() {
    it('should return a newly created model using the in-memory adapter', function(done){
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
    it('should return an existing model using the in-memory adapter', function(done){
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
    it('should return a valid updated model using the in-memory adapter', function(done){
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
    it('should return the deleted model using the in-memory adapter', function(done){
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
    it('should allow for model registration', function(done){
        try {
            var impl = dao.use(dao.MEMORY)
            dao.register('user');
            should.exist(impl);
            impl.should.have.property('user');
            impl.user.should.have.property('create');
            impl.user.should.have.property('read');
            impl.user.should.have.property('update');
            impl.user.should.have.property('delete');
            done();
        } catch(err) {
            done(err)
        }
    });    
    it('should have proper model type for registered models', function(done){
        try {
            var impl = dao.use(dao.MEMORY);
            dao.register('user');
            impl.user.create(TEST_MODEL)
            .then(function(newModel){
                should.exist(newModel);
                newModel.should.have.property('$type').and.equal('user');
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

describe("v0 api tests - file implementation", function() {
    it('should return a newly created model using the file adapter', function(done){
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
    it('should return an existing model using the file adapter', function(done){
        try {
            TEST_MODEL.$id = TEST_ID;
            dao
            .use(dao.FILE)
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
    it('should return a valid updated model using the file adapter', function(done){
        try {
            TEST_MODEL.$id = TEST_ID;
            TEST_MODEL.email = TEST_EMAIL;
            dao
            .use(dao.FILE)
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
    it('should return the deleted model using the file adapter', function(done){
        try {
            TEST_MODEL.$id = TEST_ID;
            dao
            .use(dao.FILE)
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
    it('should return the appropiate compliance level', function(done){
        try {
            dao.use(dao.MEMORY);
            var compliance = dao.getComplianceLevel();
            compliance.should.equal('v1');
            done();
        } catch(err) {
            done(err)
        }
    });    
    it('should load existing data if present', function(done){
        try {
            var impl = dao.use(dao.FILE);
            dao.register('user');
            impl.user.count({name:'jim'})
            .then(function(count){
                should.exist(count);
                count.should.be.a.number;
                count.should.equal(1);
            })
            .then(function(){
                impl.user.find({name:'jim'})
                .then(function(foundModels){
                    should.exist(foundModels);
                    foundModels.should.be.an.array;
                    foundModels.length.should.equal(1);
                    foundModels[0].should.have.property('name').and.equal('jim');
                    require('fs').unlinkSync('./storage.json');
                    done();
                })
                .catch(function(err){
                    done(err);
                });
            })
            .catch(function(err){
                require('fs').unlinkSync('./storage.json');
                done(err);
            });
        } catch(err){
            require('fs').unlinkSync('./storage.json');
            done(err);
        }
    });
});

describe("v1 api tests - memory implementation", function() {
    it('should count the records for valid criteria using the in-memory adapter', function(done){
        try {
            var impl = dao.use(dao.MEMORY);
            dao.register('user');
            impl.clear().then(function(){
                impl.user.create(TEST_MODEL)
                .then(function(createdModel){
                    impl.user.count({name:'joe'})
                    .then(function(count){
                        should.exist(count);
                        count.should.be.a.number;
                        count.should.equal(1);
                        done();
                    })
                    .catch(function(err){
                        done(err);
                    })
                })
                .catch(function(err){
                    done(err);
                })
            });
        } catch(err) {
            done(err)
        }
    });
    it('should find at least one record for valid criteria using the in-memory adapter', function(done){
        try {
            var impl = dao.use(dao.MEMORY);
            dao.register('user');
            impl.clear().then(function(){
                impl.user.create(TEST_MODEL)
                .then(function(createdModel){
                    impl.user.find({name:'joe'})
                    .then(function(foundModels){
                        should.exist(foundModels);
                        foundModels.should.be.an.array;
                        foundModels.length.should.equal(1);
                        foundModels[0].should.have.property('name').and.equal(TEST_MODEL.name);
                        done();
                    })
                    .catch(function(err){
                        done(err);
                    });
                });
            });
        } catch(err) {
            done(err)
        }
    });
    it('should find exactly one record for valid criteria using the in-memory adapter', function(done){
        try {
            var impl = dao.use(dao.MEMORY);
            dao.register('user');
            impl.clear().then(function(){
                impl.user.create(TEST_MODEL)
                .then(function(createdModel){
                    impl.user.findOne({name:'joe'})
                    .then(function(foundModel){
                        should.exist(foundModel);
                        foundModel.should.be.an.object;
                        foundModel.should.have.property('name').and.equal(TEST_MODEL.name);
                        done();
                    })
                    .catch(function(err){
                        done(err);
                    });
                });
            });
        } catch(err) {
            done(err)
        }
    });
});

describe("v1 api tests - file implementation", function() {
    it('should count the records for valid criteria using the file adapter', function(done){
        try {
            var impl = dao.use(dao.FILE);
            dao.register('user');
            impl.user.create(TEST_MODEL)
            .then(function(res){
                impl.user.count({name:'joe'})
                .then(function(count){
                    should.exist(count);
                    count.should.be.a.number;
                    count.should.equal(1);
                    done();
                })
                .catch(function(err){
                    done(err);
                })
            })
        } catch(err) {
            done(err)
        }
    });
    it('should find at least one record for valid criteria using the file adapter', function(done){
        try {
            var impl = dao.use(dao.FILE);
            dao.register('user');
            impl.user.find({name:'joe'})
            .then(function(foundModels){
                should.exist(foundModels);
                foundModels.should.be.an.array;
                foundModels.length.should.equal(1);
                foundModels[0].should.have.property('name').and.equal(TEST_MODEL.name);
                done();
            })
            .catch(function(err){
                done(err);
            })
        } catch(err) {
            done(err)
        }
    });
    it('should find exactly one record for valid criteria using the file adapter', function(done){
        try {
            var impl = dao.use(dao.FILE);
            dao.register('user');
            impl.user.findOne({name:'joe'})
            .then(function(foundModel){
                should.exist(foundModel);
                foundModel.should.be.an.object;
                foundModel.should.have.property('name').and.equal(TEST_MODEL.name);
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
