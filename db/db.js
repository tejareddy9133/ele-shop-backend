const mongoose = require("mongoose");
const connection = mongoose.connect(
  "mongodb+srv://reddyvaritejeshkumarreddy:reddy9133@cluster0.hpst3qt.mongodb.net/"
);
module.exports = { connection };
