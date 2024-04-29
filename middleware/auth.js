const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, "chaina");
      console.log(decoded);
      if (decoded) {
        next();
      } else {
        res.json({ msg: "Not authourized" });
      }
    } catch (error) {
      res.json({ msg: error.message });
    }
  } else {
    res.json({ msg: "please login" });
  }
};

module.exports = {
  auth,
};
