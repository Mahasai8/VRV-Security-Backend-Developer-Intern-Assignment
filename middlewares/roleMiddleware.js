exports.authorizeRole = (role) => {
  return (req, res, next) => {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    // Check if the user's role matches the required role
    if (req.user.role !== role) {
      return res.status(403).send('Forbidden');
    }

    next(); // Allow access if the role matches
  };
};