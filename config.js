const {config} = require("dotenv");
config();

const usr = process.env.usuario;
const pwd = process.env.contra;

module.exports = {usr,pwd};