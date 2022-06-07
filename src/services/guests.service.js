var db = require('./db.service');
var ObjectId = require('mongodb').ObjectId;

async function create() {
    let insertedObject = {}
    let result = await db.insertOne('guests',insertedObject);
    let newOne = await findOneByStrId(result.insertedId.toString());
    return newOne
}
async function findOneByStrId(guestId) {
    let guest = await db.findByStrId('guests', guestId);
    if (!guest) throw new Error("no guests found with id "+ guestId);
    return guest;    
}

module.exports = {
    create,
    findOneByStrId
}