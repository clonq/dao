# DAO

Simple [Data Access Object](https://en.wikipedia.org/wiki/Data_access_object) factory with support for pluggable implementations based on versioned specs


**Sample code**

```
var dao = require('daoi');
var s3DaoAdapter = require('s3DaoAdapter');

dao
.use(s3DaoAdapter)
.on('create', function(model){
	// persisted model
})
.on('error', function(err){
	// error handler
})
.config({ storage: 'mybucket/users.json' })
.create({ name: 'joe', email: 'joe@test.com' });

```

**Installation**

```
npm install daoi --save
```

**Implementations**

Below are the operations required to be implemented by a concrete dao implementation grouped by the compliance level. A dao implementation should be at least v0 compliant. 

*v0 compliant operations*: create, read, update, delete

*v1 compliant operations*: v0 operations + count, find, findOne, remove

*v2 compliant operations*: v1 operations + save, upsert, bulkCreate, bulkUpdate, bulkDelete


**Helpers**

Once an implementor is set via `dao.use(...)`, the complicance level can be queried using `dao.getComplianceLevel()`. 

The dao interface is completely model agnostic. A dao concrete implementation should handle any model. An additional `register` method allows for model discrimination via an injected `$type` property in the supplied model:

```
var userDao = dao.use(myAdapter).register('user');

userDao
.on('create', function(model){
	// model.$type === 'user' 
})
.create({name:'test'});
```

Known implementations: [dao-s3](https://github.com/clonq/dao-s3) (v0)


