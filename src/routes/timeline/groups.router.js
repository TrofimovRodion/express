var express = require('express');
var controller = require('../../controllers/groups.controller')
var guestMiddleware = require('../../middlewares/guest.middleware')

var router = express.Router({ mergeParams: true });
router.use(guestMiddleware.guestLogin)

router.all('/create', controller.create);
router.all('/:groupId/update', controller.update);
router.all('/:groupId/remove', controller.remove);

module.exports = router;
