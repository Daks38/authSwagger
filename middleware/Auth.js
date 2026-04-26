const jwt = require("jsonwebtoken");
const secertkey = process.env.SECRET_KEY;
const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Vous n'êtes pas connecté token manquant" });
  }
  try {
    const decode = jwt.verify(token, secertkey);
    req.user = decode;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalide" });
  }
};
module.exports = authToken;
