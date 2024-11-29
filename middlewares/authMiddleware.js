const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentTime = Date.now();
    if (decoded.sessionExpiry < currentTime) {
      res.clearCookie('token'); // Clear the token if expired
      return res.redirect('/login'); // Redirect to login
    }
    req.user = decoded;
    next();
  } catch (err) {
    
    res.clearCookie('token');
    // if (err.name === 'TokenExpiredError') {
    //         return res.status(401).json({ error: 'Token has expired' });
    //     }
    //         return res.status(401).json({ error: 'Invalid token' });
    res.redirect('/login');
  }

};


exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).send('Access Denied');
    next();
  };
};

