const setting = require("./setting_mysql")
const Client = require("mysql-pro");
const client = new Client({
  mysql: {
    user: setting.user,
    password: setting.password,
    database: setting.database,
    host: setting.host,
    timezone: setting.timezone
  }
});

module.exports = client;