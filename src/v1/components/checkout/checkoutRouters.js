const express = require("express");
const router = express.Router();

const Checkout = require("./checkoutController");

router.get("/", (_, response) => {
  response.status(200).json({
    endpoints: {
      GET: ["/api/v1/checkout/getSharedLink/:sessionId"],
      POST: ["/api/v1/checkout/createSession"],
    }
  })
});
router.get("/getSharedLink/:sessionId", Checkout.getSharedLink);

router.post("/createSession", Checkout.createSession);

module.exports = router;
