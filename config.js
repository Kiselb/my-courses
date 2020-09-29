const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  FE_PORT: process.env.FE_PORT,
  API_PORT: process.env.API_PORT,
  API_PATH: process.env.API_PATH,
  DB_PATH: process.env.DB_PATH
};
