const express = require("express");
const app = express();
const cors = require("cors");
const v1 = require("./v1");
const Prisma = require('./v1/classes/Prisma');

const corsOptions = {
  // Set the allowed origins to all domains
  origin: "*"
};

/* Calls API that will give different versions available */
const api = () => {
  app.get("/", (_, response) => {
    response.status(200).json({
      endpoints: {
        v1: "/api/v1",
      },
    });
  });

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(v1);

  Prisma.onStart();

  return app;
};

module.exports = api();
