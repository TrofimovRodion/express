
const timelineService = require('../services/timeline.service')

async function create(req, res, next) {
    try {
        let newGroup = await timelineService.createGroup(
            res.locals.guest._id,
            req.params.timelineId,
            {
                title: req.body.title,
                background: req.body.background,
                lines: req.body.lines
            })
        res.json(newGroup);
    } catch (err) {
        console.error(`Error while creating group`, err.message);
        next(err);
    }
}

async function update(req, res, next) {
    try {
        res.json(await timelineService.updateGroup(req.params.groupId, req.body.changes))
    } catch (err) {
        console.error(`Error while updating group`, err.message);
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await timelineService.removeGroup(req.params.groupId)
        res.json()
    } catch (err) {
        console.error(`Error while removing group `, err.message);
        next(err);
    }
}

module.exports = {
    create,
    update,
    remove
}