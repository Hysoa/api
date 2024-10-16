const { PrismaClient } = require("@prisma/client");
const ClipFactory = require("./clips");

const prisma = new PrismaClient();

async function main() {
  await new ClipFactory().createMany();
  console.log("Seeds created");
  return void 0;
}

main()
  .then(() => {
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
