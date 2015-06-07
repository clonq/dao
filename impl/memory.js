var Promise = require('bluebird');
var buckets = {};
module.exports = {
	put: function (model) {
		return new Promise(function(resolve, reject){
			return reject(new Error('not implemented'));
		});
	}
}
