const express = require("express");
const router = express.Router();

router.get("/", (_, response) => {
  response.status(200).json({
    endpoints: [
      '/api/v1/contact',
      '/api/v1/checkout',
    ],
  });
});

router.use('/contact', require('./contact'))
router.use('/checkout', require('./checkout'))

module.exports = router;
