var debug = require('debug')('dao:test'),
	should = require('chai').should()
	dao = require('../index');
	memoryImpl = require('../impl/memory');

const TEST_MODEL = {
	name: 'name',
	age: 23
};

describe("api tests", function() {
	it('should fail if there no implementation provided', function(done){
		dao
		.put(TEST_MODEL)
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
});