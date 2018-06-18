function isAuthenticated (req, res, next) {
  if (req.user === undefined) {
    return res.redirect('/user/login');
  }
  next();
}

function isUser (req, res, next) {
  if (!req.user) {
    return res.redirect('/user/login');
  }
  next();
}

function isAdmin (req, res, next) {
  if (req.user) {
    if (req.user.role === 'Admin') {
      return next();
    }
    return res.redirect('/forbidden');
  }
  return res.redirect('/forbidden');
}

function getRoles (req) {
  let isAdmin = false;
  let isUser = false;

  if (req.user) {
    isAdmin = req.user.role === 'Admin';
    isUser = req.user.role === 'Admin' || req.user.role === 'User';
  }

  return [isAdmin, isUser];
}

module.exports = {
  isAuthenticated: (req, res, next) => isAuthenticated(req, res, next),
  isUser: (req, res, next) => isUser(req, res, next),
  isAdmin: (req, res, next) => isAdmin(req, res, next),
  roles: (req) => getRoles(req)
};
