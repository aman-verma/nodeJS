const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.get('/:orderId', function(req, res, next) {
    const id = req.params.productId;
    if(id === 'special'){
        res.status(200).json({
            message: 'You discovered a special id',
            id: id
        });
    }else{
        res.status(200).json({
            message: 'You passed an id',
            id: id
        });
    }
});

router.patch('/:orderId', function(req, res, next) {
    res.status(200).json({
        message: 'Updated order',
        id: req.params.orderId
    });
})

router.delete('/:orderId', function(req, res, next) {
    res.status(200).json({
        message: 'Deleted order',
        id: req.params.orderId
    });
})


router.post('/', function(req, res, next) {
    res.status(201).json({
        message: 'Order was created'
    });
});

module.exports = router;