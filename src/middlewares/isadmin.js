// the isAuthenticated middleware should always be called before this
// to ensure that the user id is already loaded on the req object
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function isAdmin(req, res, next) {
  const errormessage = 'Not enough permissions to perform this action'
  const user_id = req.user?.user_id;
  if (!user_id) {
    return res.status(403).json({ message: errormessage });
  }
  try {
    const { isAdmin } = await prisma.user.findFirstOrThrow({ where: { id: user_id } })
    if (!isAdmin) {
      throw new Error(errormessage);
    }
    req.user.isAdmin = true;
    next()
  } catch (err) {
    return res.status(403).json({ message: errormessage });
  }
}

module.exports = {
  isAdmin,
};
