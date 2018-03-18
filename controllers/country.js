var mongoose = require('mongoose');
const Country = require('../models/countries');
const User = require('../models/user');
const moment = require('moment');
const _ = require('lodash');

exports.getCountries = async (req, res) => {
    const country = await Country.find({}).sort({"name": 1})
    return res.status(200).json({message: 'Countries Found', country: country});
}

exports.addToFavorite = async (req, res) => {
    
    if(!req.body.id && req.body.country !== undefined){
        _.forEach(req.body.country, async (val) => {
            await Country.update({
                'name': val,
                'fans.username': {$ne: req.body.user}
            }, {
                $push: {fans: {
                    username: req.body.user
                }}
            });
        });
        
        await User.update({
            'username': req.body.user,
            'favTeams': {$ne: req.body.country}
        }, {
            $addToSet: { "favTeams": { $each: req.body.country } }
        });
        
        return res.status(200).json({message: `Countries has been added to favorite`});
    }
    
    
    if(req.body.id && req.body.country !== undefined){
        await Country.update({
            '_id': req.body.id,
            'fans.username': {$ne: req.body.user}
        }, {
            $push: {fans: {
                username: req.body.user
            }}
        });

        await User.update({
            'username': req.body.user,
            'favTeams': {$ne: req.body.country}
        }, {
            $push: {favTeams: req.body.country}
        });
        
        return res.status(200).json({message: `${req.body.country} has been added to favorite`});
    }
    
}












