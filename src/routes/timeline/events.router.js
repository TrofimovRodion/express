var express = require('express');
var controller = require('../../controllers/events.controller')
var guestMiddleware = require('../../middlewares/guest.middleware')

var router = express.Router({ mergeParams: true });
router.use(guestMiddleware.guestLogin)

router.all('/create', controller.create);
router.all('/:eventId/update', controller.update);
router.all('/:eventId/remove', controller.remove);

module.exports = router;
