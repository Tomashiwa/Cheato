const express = require("express");
const router = express.Router();

//Cheatsheet model
const Cheatsheet = require("../../models/Cheatsheet");
const ObjectId = require('mongoose').Types.ObjectId;
// @route GET api/cheatsheets
// @descr Get all cheatsheets
// @access Public
// By entering into this file, the path is already in "/api/cheatsheets". So, only "/" is required
router.get("/", (req, res) => {
    // Mongo query
    Cheatsheet.find()
        .sort({datetime: -1})
        .then(cheatsheets => res.json(cheatsheets));
});

// @route POST api/cheatsheets/
// @descr Get cheatsheets viewable by the user
// @access Public
router.post("/", (req, res) => {
    if(!req.body.id) {
        Cheatsheet.find({isPublic: true})
            .sort({datetime: -1})
            .then(cheatsheets => res.json(cheatsheets));
    } else {
        const {id, isAdmin} = req.body
    
        if(isAdmin) {
            Cheatsheet.find()
                .sort({datetime: -1})
                .then(cheatsheets => res.json(cheatsheets));
        } else {
            Cheatsheet.find({$or: [{user: new ObjectId(id)}, {isPublic: true}]})
                .sort({datetime: -1})
                .then(cheatsheets => res.json(cheatsheets));
        }
    }
})

// @route POST api/cheatsheets
// @descr Create a cheatsheet
// @access Public
router.post("/add", (req, res) => {
    const newCheatsheet = new Cheatsheet({
        file: req.body.file,
        user: req.body.user,
        name: req.body.name,
        school: req.body.school,
        module: req.body.module,
        description: req.body.description,
        datetime: req.body.datetime,
        rating: req.body.rating,
        comments: req.body.comments,
        isPublic: req.body.isPublic
    });

    //Save to database
    newCheatsheet.save()
        .then(item => res.json(item));
});

// @route POST api/cheatsheets/:id
// @descr Retrieving a specific cheatsheet with authentication
// @access Public
router.post("/:id", (req, res) => {
    const ObjectId = require('mongoose').Types.ObjectId;

    // req.body.id - User's id
    // req.params.id - Cheatsheet's id

    // When no authentication is given, the retrieved sheet must be public
    // If its given,
    //      User w/ admin right -> Retrieve the given sheet
    //      User w/o admin right -> Retrieve the given sheet if the user id matches or it is public
    if(!req.body.id) {
        Cheatsheet.findById(req.params.id)
            .then(cheatsheet => {
                if(cheatsheet.isPublic) {
                    res.json(cheatsheet);
                } else {
                    res.status(404).json({msg: `Cheatsheet is not avaliable for public`});
                }
            })
            .catch(err => res.status(404).json({msg: `No cheatsheet found.`}));
    } else {
        const {id, isAdmin} = req.body;

        if(isAdmin) {
            Cheatsheet.findById(req.params.id)
                .then(cheatsheet => res.json(cheatsheet))
                .catch(err => res.status(404).json({msg: `No cheatsheet found.`}));
        } else {
            Cheatsheet.findById(req.params.id)
                .then(cheatsheet => {
                    if(cheatsheet.user === id || cheatsheet.isPublic) {
                        res.json(cheatsheet);
                    } else {
                        res.status(404).json({msg: `Cheatsheet is not accessible by this user`});
                    }
                })
                .catch(err => res.status(404).json({msg: `No cheatsheet found.`}));
        }
    }
})

// @route DELETE api/cheatsheets
// @descr Delete a cheatsheet
// @access Public
router.delete("/:id", (req, res) => {
    Cheatsheet.findById(req.params.id)
        .then(cheatsheet => cheatsheet.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

// @route GET api/cheatsheets/searchTerm/limit
// @descr Retrieve a set amount of cheatsheets that matches the search term
// @access Public
router.get("/search/:searchTerm/:limit", (req,res) => {
    Cheatsheet
        .find({$or: [
            {name: {$regex: req.params.searchTerm, $options: "i"}}
        ]})
        .limit(parseInt(req.params.limit))
        .sort({name: -1})
        .then(cheatsheets => res.json(cheatsheets))
        .catch(err => res.status(404).json({success: false}));
})

//So other files can read what's in this file
module.exports = router;