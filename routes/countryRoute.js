'use strict';

const express = require("express");
const router = express.Router();


const countryCtrl = require('../controllers/country');


router.get('/countries', countryCtrl.getCountries);

router.post('/countries', countryCtrl.addToFavorite);




module.exports = router;

