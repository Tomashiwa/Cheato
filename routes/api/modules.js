const express = require("express");
const router = express.Router();

//Module model
const Module = require("../../models/Module");

// @route GET api/modules
// @descr Get all modules
// @access Public
// By entering into this file, the path is already in "/api/modules". So, only "/" is required
router.get("/", (req, res) => {
    // Mongo query
    Module.find()
        .sort({code: -1})
        .then(modules => res.json(modules));
});

// @route POST api/modules
// @descr Create a module
// @access Public
router.post("/", (req, res) => {
    const newModule = new Module({
        code: req.body.code,
        title: req.body.title

        // name: req.body.name
        //Date left out, as it has default value of Date.now()
    });

    //Save to database
    newModule.save()
        .then(item => res.json(item));
});

// @route DELETE api/modules
// @descr Delete a module
// @access Public
router.delete("/:id", (req, res) => {
    Module.findById(req.params.id)
        .then(module => module.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

//So other files can read what's in this file
module.exports = router;