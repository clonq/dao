function create(model, cb){
    cb(new Error('create not implemented'));
}

function read(model, cb){
    cb(new Error('read not implemented'));
}

function update(model, cb){
    cb(new Error('update not implemented'));
}

function remove(model, cb){
    cb(new Error('delete not implemented'));
}

module.exports = {
    create: create,
    read: read,
    update: update,
    delete: remove
}
