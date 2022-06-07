const express = require('express');
const { db } = require('../configs/db.config');
const ObjectId = require('mongodb').ObjectId;
const config = require('../configs/db.config');
const MongoClient = require('mongodb').MongoClient;

var router = express.Router();
const client = new MongoClient("mongodb://"+config.db.host+":"+config.db.port);

async function find(collection, filter) {
  await client.connect();
  let db = client.db(config.db.db);
  return await db.collection(collection).find(filter).toArray();
}

async function findByStrId(collection, id) {
  await client.connect();
  let db = client.db(config.db.db);
  return await db.collection(collection).findOne({_id:new ObjectId(id)});
}
async function updateOneByStrId(collection, id, changes) {
  await client.connect();
  let db = client.db(config.db.db);
  return await db.collection(collection).updateOne({_id:new ObjectId(id)}, { $set: changes });
}

async function removeByStrId(collection,id) {
  await client.connect();
  let db = client.db(config.db.db);
  return await db.collection(collection).deleteOne({_id:new ObjectId(id)})
}

async function removeBy(collection,filter) {
  await client.connect();
  let db = client.db(config.db.db);
  return await db.collection(collection).deleteMany(filter)
}

async function insertOne(collection, data) {
  await client.connect();
  let db = client.db(config.db.db);
  data.date_created = new Date();
  data.date_updated = new Date();
  return await db.collection(collection).insertOne(data)
}

module.exports = {
  find,
  findByStrId,
  insertOne,
  removeByStrId,
  updateOneByStrId,
  removeBy
}