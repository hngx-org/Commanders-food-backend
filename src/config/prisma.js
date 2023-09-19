const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Test it out to see if everything is working properly
  const allUsers = await prisma.users.create({
    data: {
      email: "tada@gmail.com",
    },
  });
  console.log(allUsers);
}

main().then(console.log).catch(console.log);

module.exports = prisma;
