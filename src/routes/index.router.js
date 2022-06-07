var express = require('express');
var controller = require('../controllers/index.controller')
var guestMiddleware = require('../middlewares/guest.middleware')

var router = express.Router();
router.use(guestMiddleware.guestLogin)

/* GET home page. */
router.get('/', controller.index);

module.exports = router;
