var express = require('express');
var controller = require('../../controllers/events.controller')
var guestMiddleware = require('../../middlewares/guest.middleware')

var router = express.Router({ mergeParams: true });
router.use(guestMiddleware.guestLogin)

router.all('/create', controller.create);
router.all('/:eventId/update', controller.update);
router.all('/:eventId/remove', controller.remove);
router.all('/:eventId/connect', controller.connect);
router.all('/:eventId/disconnect', controller.disconnect);

module.exports = router;
