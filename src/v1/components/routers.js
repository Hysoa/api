const express = require("express");
const router = express.Router();

router.get("/", (_, response) => {
  response.status(200).json({
    endpoints: [
      '/api/v1/contact',
    ],
  });
});

router.use('/contact', require('./contact'))

module.exports = router;
