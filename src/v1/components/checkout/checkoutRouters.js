const express = require("express");
const router = express.Router();

const CheckoutController = require("./checkoutController");

router.post("/createSession", CheckoutController.createSession);
router.get("/getSharedLink/:sessionId", CheckoutController.getSharedLink);

module.exports = router;
