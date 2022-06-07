const express = require('express');
const guestMiddleware = require('../../middlewares/guest.middleware')
const controller = require('../../controllers/timeline.controller')
const groupsRouter = require('./groups.router')
const eventsRouter = require('./events.router')

var router = express.Router();
router.use(guestMiddleware.guestLogin)

router.use('/:timelineId/events', eventsRouter)
router.use('/:timelineId/groups', groupsRouter)

//router.get('/', controller.index);
//router.get('/:timelineId', controller.timeline);

router.all('/list', controller.index);
router.all('/create', controller.create);
router.all('/:timelineId', controller.data);
router.all('/:timelineId/update', controller.update);
router.all('/:timelineId/remove', controller.remove);

module.exports = router;