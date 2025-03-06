const { Sequelize } = require("sequelize");
// const config = require('./config/config');

// const sequelize = new Sequelize(config.development);

// const env = process.env.NODE_ENV || "test";
const config = require("./config/config")[process.env.NODE_ENV || "test"];
const sequelize = new Sequelize(config);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
