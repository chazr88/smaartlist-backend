const { Pool } = require('pg');

const pool = new Pool({
  connectionString:"postgres://admin:scx2lLagzTwORdJqsTdcxvVHQqP0H5IN@dpg-cinl9stph6ei90fatong-a/smart_list"
});

module.exports = pool;