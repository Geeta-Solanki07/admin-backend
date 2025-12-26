const isSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Super admin only" });
  }
  next();
};

export default isSuperAdmin;
