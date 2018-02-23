const Club = require('../models/club');
const express = require("express");
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

router.post('/dashboard', (req, res) => {
    const newClub = new Club();
    newClub.name = req.body.club;
    newClub.country = req.body.country;
    newClub.image = req.body.upload;
    newClub.save((err) => {
        res.render('dashboard');
    });
});

module.exports = router;