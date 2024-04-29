const jwt = require("jsonwebtoken");

const adminauth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, "chaina");
      if (decoded.email === "reddyvaritejeshkumarreddy@gmail.com") {
        console.log(decoded.email);
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
  adminauth,
};
