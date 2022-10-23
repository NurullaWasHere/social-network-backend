const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(406).json({
        message: "Проблемами с расшифровкой токена!",
      });
    }
  } else {
    return res.status(406).json({
      message: "No acces to token!",
    });
  }
};

module.exports = checkAuth;
