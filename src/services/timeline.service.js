const db = require("./db.service")
const ObjectId = require("mongodb").ObjectId

async function findTimelinesByGuestId(guestId) {
    let result = await db.find('timelines', { guest: new ObjectId(guestId) });
    if (!result) throw new Error("no timelines found for guest " + guestId);
    return result;
}

async function findTimelineByStrId(timelineId) {
    let result = await db.findByStrId('timelines', timelineId);
    if (!result) throw new Error("no timelines found with id " + timelineId);
    return result;
}

async function createTimeline(guestId, details) {
    let data = {
        guest: new ObjectId(guestId),
        title: details.title
    }
    let insertData = await db.insertOne('timelines', data)
    let newOne = await findTimelineByStrId(insertData.insertedId.toString())
    return newOne
}
async function updateTimeline(timelineId, changes) {
    await db.updateOneByStrId('timelines', timelineId, changes)
    return await findTimelineByStrId(timelineId);
}
async function removeTimeline(timelineId) {
    await db.removeByStrId('timelines', timelineId);
}

async function findEventByStrId(id) {
    let result = await db.findByStrId('events', id);
    if (!result) throw new Error("no events found with id " + id);
    return result;
}

async function findGroupByStrId(id) {
    let result = await db.findByStrId('groups', id);
    if (!result) throw new Error("no group found with id " + id);
    return result;
}

async function createEvent(guestId, timelineId, groupId, details) {
    let data = {
        guestId: new ObjectId(guestId),
        timelineId : new ObjectId(timelineId),
        groupId: new ObjectId(groupId),
        title: details.title,
        duration: details.duration,
        period: details.period,
        date_repeatable_end: details.date_repeatable_end,
        date_start: details.date_start,
        date_end: details.date_end
    }
    let insertData = await db.insertOne('events', data)
    let newOne = await findEventByStrId(insertData.insertedId.toString())
    return newOne
}

async function updateEvent(eventId, changes) {
    await db.updateOneByStrId('events', eventId, changes)
    return await findEventByStrId(eventId);
}
async function removeEvent(eventId) {
    await db.removeByStrId('events', eventId);
}
async function createGroup(guestId, timelineId, details) {
    let data = {
        guest: new ObjectId(guestId),
        timelineId: new ObjectId(timelineId),
        title: details.title,
        background: details.background
    }
    let insertData = await db.insertOne('groups', data)
    let newOne = await findGroupByStrId(insertData.insertedId.toString())
    return newOne
}
async function updateGroup(groupId, changes) {
    await db.updateOneByStrId('groups', groupId, changes)
    return await findGroupByStrId(groupId);
}
async function removeGroup(groupId) {
    await db.removeBy('events',{groupId:groupId});
    await db.removeByStrId('groups', groupId);
}

async function getTimelineData(timelineId) {
    let timeline = await findTimelineByStrId(timelineId)
    if (!timeline) throw new Error('Timeline not Found');
    let result = Object.assign({
        title: '',
        groups: []
    }, timeline)
    result.groups = await findGroupsByTimelineStrId(timelineId);
    if (result.groups.length) {
        let events = await findEventsByTimelineStrId(timelineId);
        for (let i = 0; i < result.groups.length; i++) {
            result.groups[i].events = events.filter(event => event.groupId.toString() == result.groups[i]._id.toString())
        }
    }
    return result;
}

async function findGroupsByTimelineStrId(timelineId) {
    return await db.find('groups', { timelineId: new ObjectId(timelineId) })
}

async function findEventsByTimelineStrId(timelineId) {
    return await db.find('events', { timelineId: new ObjectId(timelineId) })
}

module.exports = {
    findTimelinesByGuestId,
    findTimelineByStrId,
    findEventByStrId,
    findGroupByStrId,
    createTimeline, updateTimeline, removeTimeline,
    createEvent, updateEvent, removeEvent,
    createGroup, updateGroup, removeGroup,
    getTimelineData
}