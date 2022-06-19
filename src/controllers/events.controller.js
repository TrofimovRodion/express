
const { ObjectId } = require('mongodb');
const { db } = require('../configs/db.config');
const timelineService = require('../services/timeline.service');

async function create(req, res, next) {
    try {
        let newEvent = await timelineService.createEvent(
            res.locals.guest._id,
            req.params.timelineId,
            req.body.groupId,
            {
                title: req.body.title,
                date_start: req.body.date_start,
                duration: req.body.duration,
                period: req.body.period ? req.body.period : 0,
                color: req.body.color ? req.body.color : 0,
                line: req.body.line? req.body.line : 0,
                date_repeatable_end: req.body.date_repeatable_end ? req.body.date_repeatable_end : null,
            })
        res.json(newEvent);
    } catch (err) {
        console.error(`Error while creating event`, err.message);
        next(err);
    }
}

async function update(req, res, next) {
    try {
        res.json(await timelineService.updateEvent(req.params.eventId, req.body.changes))
    } catch (err) {
        console.error(`Error while updating event`, err.message);
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await timelineService.removeEvent(req.params.eventId)
        res.json()
    } catch (err) {
        console.error(`Error while removing event`, err.message);
        next(err);
    }
}

module.exports = {
    create,
    update,
    remove
}