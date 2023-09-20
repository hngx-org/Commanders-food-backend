// is authenticated
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

async function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    const { user_id } = decodedToken;
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = {
      user_id: user.id,
      org_id: user.org_id,
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
}

module.exports = {
  isAuthenticated,
};
