const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class SeedFactory {
  constructor() {
    this.prisma = prisma;
  }

  async createMany() {
    console.log("Not implemented");
  }
}

module.exports = SeedFactory;