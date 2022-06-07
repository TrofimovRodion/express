const guestsService = require('../services/guests.service')

async function index(req,res,next) {
    try {
        res.render('index', { title: 'Express' });
    } catch (err) {
        console.error(`Error while rendering main page`, err.message);
        next(err);
    }
}

module.exports = {
    index
}