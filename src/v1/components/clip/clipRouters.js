const express = require("express");
const router = express.Router();

const ClipController = require("./clipController");

router.get("/getAll", ClipController.getAll);
router.delete("/delete/:id", ClipController.deleteOne);
router.put("/update/:id", ClipController.updateOne);
router.post("/add", ClipController.addOne);

module.exports = router;
