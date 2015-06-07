var debug = require('debug')('dao:test'),
	should = require('chai').should()
	dao = require('../index');
	memoryImpl = require('../impl/memory');

const TEST_MODEL = {
	name: 'joe',
	age: 23
};

describe("api tests", function() {
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
		dao.use(memoryImpl);
		done();
	});
	it('should return a model with an id on create', function(done){
		try {
			dao
			.use(memoryImpl)
			.create(TEST_MODEL).
			then(function(createdModel){
				should.exist(createdModel);
				createdModel.should.have.property('$id');
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