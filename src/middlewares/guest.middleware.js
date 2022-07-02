var guestsService = require('../services/guests.service')

async function guestLogin(req,res,next) {
    let guestId = req.cookies.guest_id;
    let guest = null;
    if (guestId) {
        guest = await guestsService.findOneByStrId(guestId);
    }
    if (!guest) {
        guest = await guestsService.create();
        res.cookie('guest_id',guest._id,{expires:new Date(Date.now() + (50 * 365 * 24 * 60 * 60))});
    }
    res.locals.guest = guest;
    next();
}

module.exports = {
    guestLogin
}