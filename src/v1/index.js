const express = require("express");
const router = express.Router();

const errorMiddleware = require("./middlewares/error");
const catchAsyncErrors = require("./middlewares/catchAsyncErrors");

const components = require("./components");

/* Creates a route that lists every endpoint of the API */
router.get("/api/v1", (_, response) => {
  response.status(200).json({
    message: "Bienvenue sur Hysoa Music API (v1)",
    endpoints: [
      { POST: "/api/v1/contact" },
    ],
  });
});

/* Allows to use all routes of API V1 */
router.use(
  "/api/v1",
  catchAsyncErrors(async (request, response, next) =>
    components(request, response, next)
  ),
  errorMiddleware
);

module.exports = router;
