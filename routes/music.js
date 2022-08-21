const express = require('express');
const router = express.Router();
const verifyJWTToken = require('../middlewares/authJWT');

// Schema class
const Music = require('../models/music');

// Getting all
router.get('/', verifyJWTToken, checkUserExists, async (req, res) => {
    try {
        const courses = await Music.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Getting one
router.get('/:id', verifyJWTToken, checkUserExists, getMusic, (req, res) => {
    if (!req.user) {
        res.status(403)
        .send({
            message: "Unauthorised access, please login and try again with token."
        });
        return;
    }
    res.json(res.music);
});

// GET by name
router.get('/name/:name', verifyJWTToken, checkUserExists, getMusicByName, (req, res) => {
    if (!req.user) {
        res.status(403)
        .send({
            message: "Unauthorised access, please login and try again with token."
        });
        return;
    }
    res.json(res.music);
});

// GET by Instagram Id
router.get('/ig/:instagramId', verifyJWTToken, checkUserExists, getMusicByIgId, (req, res) => {
    if (!req.user) {
        res.status(403)
        .send({
            message: "Unauthorised access, please login and try again with token."
        });
        return;
    }
    res.json(res.music);
});

// Creating one
router.post('/', verifyJWTToken, checkUserIsAdmin, async (req, res) => {
    const music = new Music({
        name: req.body.name,
        createDate: req.body.createDate,
        youtubeEmbedId: req.body.youtubeEmbedId,
        instagramId: req.body.instagramId
    });

    try {
        const newMusic = await music.save();
        // 201 Successfully created
        res.status(201).json(newMusic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Updating one (need full object)
router.put('/:id', verifyJWTToken, checkUserIsAdmin, getMusic, async (req, res) => {
    // Validate object fields by creating new music
    const music = new Music({
        name: req.body.name,
        youtubeEmbedId: req.body.youtubeEmbedId,
        instagramId: req.body.instagramId
    });

    try {
        res.music.name = music.name;
        res.music.youtubeEmbedId = music.youtubeEmbedId;
        res.music.instagramId = music.instagramId;
        const updatedMusic = await res.music.save();
        res.json(updatedMusic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Partial updating one
router.patch('/:id', verifyJWTToken, checkUserIsAdmin, getMusic, async (req, res) => {
    if (req.body.name !== null) {
        res.music.name = req.body.name;
    }
    if (req.body.youtubeEmbedId !== null) {
        res.music.youtubeEmbedId = req.body.youtubeEmbedId;
    }
    if (req.body.instagramId !== null) {
        res.music.instagramId = req.body.instagramId;
    }

    try {
        const updatedMusic = await res.music.save();
        res.json(updatedMusic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Deleting one
router.delete('/:id', verifyJWTToken, checkUserIsAdmin, getMusic, async (req, res) => {
    try {
        await res.music.remove();
        res.json({ message: 'Deleted music' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to check if user exists
function checkUserExists(req, res, next) {
    if (!req.user) {
        return res.status(403)
        .send({
            message: "Unauthorised access, please login and try again with token."
        });
    }
    next();
}

// Middleware function to check if user is admin
function checkUserIsAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403)
        .send({
            message: "Unauthorised access, please login as admin and try again with token."
        });
    }
    next();
}

// Middleware function to get music object
// next is another middleware function triggered if this is successful
// which for above requests, is the lambda function which returns response
async function getMusic(req, res, next) {
    let music;
    try {
        music = await Music.findById(req.params.id);
        if (music == null) {
            return res.status(404).json({ message: 'Cannot find music' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.music = music;
    next();
}

async function getMusicByName(req, res, next) {
    let music;
    try {
        music = await Music.findOne({ name: req.params.name });
        if (music == null) {
            return res.status(404).json({ message: 'Cannot find music' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.music = music;
    next();
}

async function getMusicByIgId(req, res, next) {
    let music;
    try {
        music = await Music.findOne({ instagramId: req.params.instagramId });
        if (music == null) {
            return res.status(404).json({ message: 'Cannot find music' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.music = music;
    next();
}

module.exports = router;