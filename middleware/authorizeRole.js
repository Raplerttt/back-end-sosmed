const authorizeRole = (roles) => {
    return (req, res, next) => {
      // Pastikan pengguna memiliki role yang sesuai
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Akses ditolak. Peran tidak sesuai' });
      }
      next();
    };
  };
  
  module.exports = authorizeRole;
  