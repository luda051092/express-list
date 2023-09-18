const express = require('express');
const router = new express.Router();


const expressErr = require('../expressErr');
const items = require('../fakeDb');

router.get('/', (req, res, next) => {
    try {
        return res.json(items)
    } catch (err) {
        next(err);
    }
});

router.post('/', (req, res, next) => {
    try {
        if (req.body.name === undefined || req.body.name.trim().length === 0) {
            throw new expressErr('name is required', 400);
        }

        const newItem = {
            name: req.body.name,
            price: req.body.price || 0
        };

        items.push(newItem);


        return res.status(201).json({ added: newItem })
    } catch (err) {
        next(err);
    }
});



router.get('/:name', (req, res, next) => {
    try {
        const name = req.params.name;

        const item = items.find(item => item.name.toLowerCase() === name.toLowerCase());

        if (item === undefined) {
            throw new expressErr('Item not found', 404);
        }

        if (req.body.name === undefined || req.body.name.trim().length === 0) {
            throw new expressErr('name required', 400);
        }
        item.name = req.body.name;
        item.price = req.body.price || 0;

        return res.json({ updated: item })
    } catch (err) {
        next(err);
    }
});


router.delete('/:name', (req, res, next) => {
    try {
        const name = req.params.name;

        for (let i = 0; i < items.length; i++) {
            if (items[i].name.toLowerCase() === name.toLowerCase()) {
                items.splice(i, 1);
                break;
            }
        }

        return res.json({ message: 'Deleted'});
    } catch (err) {
        next(err);
    }
});

module.exports = router;