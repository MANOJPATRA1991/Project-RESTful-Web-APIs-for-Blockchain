var express = require('express');
var bodyParser = require('body-parser');

// Import models
const blockChain = require('../models/blockChain');

const blockRouter = express.Router();

blockRouter.use(bodyParser.json());

blockRouter.route('/:blockHeight')
.get((req, res) => {
    const height = req.params.blockHeight;
    blockChain.getBlock(height)
    .then(data => res.send(data))
    .catch(err => res.status(400).json(err.message));
});

blockRouter.route('/')
.post((req, res, next) => {
    let body = req.body.body;
    if (!req.body.body || req.body.body == '') {
        res.status(400).json('Cannot create block');
    } else if (req.body.body !== '') {
        blockChain.addBlock(body)
        .then(data => res.send(data))
        .catch(err => res.status(403).json(err.message));
    }
});



module.exports = blockRouter;