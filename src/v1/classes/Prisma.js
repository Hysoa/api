const { PrismaClient } = require('@prisma/client');

class Prisma extends PrismaClient {
  constructor() {
    super({
      log: ['warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      }
  })
  }

  async onStart() {
    this.$connect()
      .then(() => {
        console.log('Database connected');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

module.exports = new Prisma();