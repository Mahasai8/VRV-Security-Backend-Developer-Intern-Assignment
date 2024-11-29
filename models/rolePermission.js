const rolePermissions = {
  Admin: ['create', 'read', 'update', 'delete'],
  User: ['read'],
  Moderator: ['read', 'update']
};

module.exports = rolePermissions;
