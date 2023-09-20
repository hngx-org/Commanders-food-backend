// is authenticated
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

async function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    const { user_id } = decodedToken;
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = {
      user_id: user.id,
      org_id: user.org_id
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden' });
  }
}

async function isAdmin(req, res, next) {
  const errormessage = 'Not enough permissions to perform this action';
  const user_id = req.user?.user_id; // req.user will be already set by isAuthenticated middleware
  if (!user_id) {
    return res.status(403).json({ message: errormessage });
  }
  try {
    const { isAdmin } = await prisma.user.findFirstOrThrow({
      where: { id: user_id }
    });
    if (!isAdmin) {
      return res.status(403).json({ message: errormessage });
    }
    req.user.isAdmin = true;
    next();
  } catch (err) {
    return res.status(403).json({ message: errormessage });
  }
}

async function verifyOTP(req, res, next) {
  const errormessage = 'Token not provided';
  const { otp_token } = req.body;
  const { org_id } = req?.user;
  if (!otp_token) {
    res.status(400).json({ message: errormessage });
  }
  const matchedOTP = await prisma?.organization_invites.findUnique({
    where: { token: otp_token }
  })?.token;
  if (!matchedOTP) {
    res.status(400).json({ org_id, message: 'The OTP is invalid' });
  }
  req.user = { org_id };
  next();
}

module.exports = {
  isAuthenticated,
  isAdmin,
  verifyOTP
};
