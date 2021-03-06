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
    let timeline = await findTimelineByStrId(timelineId);
    global.io.to('timeline_'+timelineId).emit('timeline_updated', {timelineId:timelineId, changes:changes});
    return timeline;
}
async function removeTimeline(timelineId) {
    await db.removeByStrId('timelines', timelineId);
    global.io.to('timeline_'+timelineId).emit('timeline_removed');
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
        color: details.color,
        line: details.line,
        date_repeatable_end: details.date_repeatable_end,
        date_start: details.date_start,
        date_end: details.date_end
    }
    let insertData = await db.insertOne('events', data)
    let newOne = await findEventByStrId(insertData.insertedId.toString())
    global.io.to('timeline_'+timelineId).emit('event_appended',newOne);
    return newOne
}

async function connectEvents(guestId, timelineId, eventId, eventRepeatNum, targetEventId, targetEventRepeatNum) {
    let data = {
        guestId: new ObjectId(guestId),
        timelineId: new ObjectId(timelineId),
        eventId: new ObjectId(eventId),
        eventRepeatNum: eventRepeatNum,
        targetEventId: new ObjectId(targetEventId),
        targetEventRepeatNum: targetEventRepeatNum
    }
    let insertData = await db.insertOne('eventsConnections', data)
    global.io.to('timeline_'+timelineId).emit('connection_appended',{
        eventId:eventId,
        eventRepeatNum:eventRepeatNum,
        targetEventId:targetEventId,
        targetEventRepeatNum:targetEventRepeatNum
    });
    return insertData;
}

async function disconnectEvents(timelineId, eventId) {
    await db.removeBy('eventsConnections', {
        eventId:new ObjectId(eventId),
        timelineId:new ObjectId(timelineId),
    });
    global.io.to('timeline_'+timelineId).emit('connection_removed',{eventId:eventId});
}

async function updateEvent(timelineId, eventId, changes) {
    await db.updateOneByStrId('events', eventId, changes)
    let event = await findEventByStrId(eventId);
    global.io.to('timeline_'+timelineId).emit('event_updated',{eventId:eventId, changes:changes});
    return event
}
async function removeEvent(timelineId, eventId) {
    await db.removeBy('events', {_id:new ObjectId(eventId),timelineId:new ObjectId(timelineId)});
    global.io.to('timeline_'+timelineId).emit('event_removed',eventId);
}
async function createGroup(guestId, timelineId, details) {
    let data = {
        guest: new ObjectId(guestId),
        timelineId: new ObjectId(timelineId),
        title: details.title,
        lines: details.lines,
        background: details.background
    }
    let insertData = await db.insertOne('groups', data)
    let newOne = await findGroupByStrId(insertData.insertedId.toString())
    global.io.to('timeline_'+timelineId).emit('group_appended',newOne);
    return newOne
}
async function updateGroup(timelineId, groupId, changes) {
    await db.updateOneByStrId('groups', groupId, changes)
    let group = await findGroupByStrId(groupId);
    global.io.to('timeline_'+timelineId).emit('group_updated',{groupId:groupId,changes:changes});
    return group
}
async function removeGroup(timelineId, groupId) {
    await db.removeBy('events',{groupId:groupId, timelineId:timelineId});
    await db.removeByStrId('groups', groupId);
    global.io.to('timeline_'+timelineId).emit('group_removed',groupId);
}

async function getTimelineData(timelineId) {
    let timeline = await findTimelineByStrId(timelineId)
    if (!timeline) throw new Error('Timeline not Found');
    let result = Object.assign({
        title: '',
        groups: []
    }, timeline)
    result.groups = await findGroupsByTimelineStrId(timelineId);
    result.connections = await findConnectionsByTimelineStrId(timelineId);
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

async function findConnectionsByTimelineStrId(timelineId) {
    return await db.find('eventsConnections', { timelineId: new ObjectId(timelineId) })
}

module.exports = {
    findTimelinesByGuestId,
    findTimelineByStrId,
    findEventByStrId,
    findGroupByStrId,
    createTimeline, updateTimeline, removeTimeline,
    createEvent, updateEvent, removeEvent,
    createGroup, updateGroup, removeGroup,
    getTimelineData,
    connectEvents, disconnectEvents
}