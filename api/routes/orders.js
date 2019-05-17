const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get('/', function(req, res, next) {
    Order.find()
    .select("product quantity _id")
    .populate('product', 'name')
    .exec()
    .then(function(docs) {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(function(docs) {
          return {
            _id: docs._id,
            product: docs.product,
            quantity: docs.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + docs._id
            }
          };
        })
      });
    })
    .catch(function(err) {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', function(req, res, next) {
  Product.findById(req.body.productId)
  .then(function(product) {
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    });
    return order.save();
  })
  .then(function(result) {
    console.log(result);
    res.status(201).json({
      message: "Order stored",
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: "GET",
        url: "http://localhost:3000/orders/" + result._id
      }
    });
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json({error: err});
  });
});


router.get('/:orderId', function(req, res, next) {
    
  Order.findById(req.params.orderId)
  .populate('product')
  .exec()
  .then(function(order) {
    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }
    res.status(200).json({
      order: order,
      request: {
        type: "GET",
        url: "http://localhost:3000/orders"
      }
    });
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json({error: err});
  });
});

// router.patch('/:orderId', function(req, res, next) {
//     res.status(200).json({
//         message: 'Updated order',
//         id: req.params.orderId
//     });
// })

router.delete('/:orderId', function(req, res, next) {
  Order.remove({ _id: req.params.orderId })
  .exec()
  .then(function(result) {
    res.status(200).json({
      message: "Order deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/orders",
        body: { productId: "ID", quantity: "Number" }
      }
    });
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json({error: err});
  });
})

module.exports = router;