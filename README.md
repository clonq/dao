# dao

* simple dao factory implementation with support for pluggable implementations
* included basic in-memory and a file-based implementations
* versioned dao specs
* promises-based

###Usage example
```
var dao = require('daoi');

dao
.use(dao.FILE)
.create({name:'joe', email:'joe@test.com'})
.then(function(createdModel){
    createdModel.should.have.property('$id');
})
```

The dao package comes with two v0-compliant in-memory `dao.MEMORY` and file `dao.FILE` implementations.

Other impementation can be plugged in like this:

```
var dao = require('daoi');
var mongodao = require('dao-mongo');
dao.use(mongodao)
```

Below are the operations an concrete dao module needs to implement grouped by compliance level. A dao implemenation should be at least ver 0 compliant. 
####V0 compliant operations
* create
* read
* update
* delete

####V1 compliant operations
* create
* read
* update
* delete
* count
* find
* findOne
* remove

####V2 compliant operations
* create
* read
* update
* delete
* count
* find
* findOne
* remove
* save
* upsert
* bulkCreate
* bulkUpdate
* bulkDelete

Once an implementor is set via `dao.use(...)`, the complicance level can be queried using `dao.getComplianceLevel()`. 

The dao interface is completely model agnostic. An dao concrete implementation should handle any model. An additional `register` method allows for model discrimination via an injected `$type` property in the supplied model:

```
var impl = dao.use(dao.MEMORY)
dao.register('user');
impl.user.create({name:'test'})
.then(function(newModel){
	newModel.should.have.property('$type').and.equal('user');
})
```

Calling `register(modelname)` on a dao instance automatically creates a new `modelname` key in the implementation. Also the model passed as argument in any of the dao operations will contain a `$type` key equal to `modelname` so concrete implementations can place models in the right bucket/table/etc... 

Dao runs a schema validation on the implementation set via `use` and makes available under the `modelname` key only the methods at the determined compliance level.

The supplied un-memory and file-based dao implementations are v0 compliant at this time.

If you write a dao implementation and wish to be listed here, [contact me](https://github.com/clonq).
