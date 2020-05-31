// require jwt to verify token with secret
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // get token from headers
  const token = req.header('x-auth-token');
  // handle if token doesnt exists
  if (!token) {
    return res.status(400).json({ msg: 'No token, authorization denied.' });
  }
  // verify token against secret
  try {
    // returns decoded payload (token) if verified, else it'll throw an error
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // set user in req to user object from token
    req.user = decodedToken.user;
    // continue with next middleware
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid.' });
  }
};
