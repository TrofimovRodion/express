var timelineService = require('../services/timeline.service');

async function index(req, res, next) {
    try {
        let timelines = await timelineService.findTimelinesByGuestId(res.locals.guest._id);
        res.json(timelines)
    } catch (err) {
        console.error(`Error while getting timelines index`, err.message);
        next(err);
    }
}

async function timeline(req, res, next) {
    try {
        //res.json(await db.find('guests',{}))
        let tline = timelineService.findTimelineByStrId(req.params.timelineId)
        res.render('timeline', { timeline: tline });
    } catch (err) {
        console.error(`Error while getting timeline`, err.message);
        next(err);
    }
}

async function data(req, res, next) {
    try {
        let timelineDetails = await timelineService.getTimelineData(req.params.timelineId)
        res.json(timelineDetails);
    } catch (err) {
        console.error(`Error while getting timeline data`, err.message);
        next(err);
    }
}

async function create(req, res, next) {
    try {
        let newTimeline = await timelineService.createTimeline(res.locals.guest._id,
            {
                title: req.body.title
            })
        res.json(newTimeline);
    } catch (err) {
        console.error(`Error while creating timeline`, err.message);
        next(err);
    }
}

async function update(req, res, next) {
    try {
        res.json(await timelineService.updateTimeline(req.params.timelineId, req.body.changes))
    } catch (err) {
        console.error(`Error while updating timeline`, err.message);
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await timelineService.removeTimeline(req.params.timelineId)
        res.json()
    } catch (err) {
        console.error(`Error while removing timeline`, err.message);
        next(err);
    }
}

module.exports = {
    index,
    timeline,
    data,
    create,
    update,
    remove
}