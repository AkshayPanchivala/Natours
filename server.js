// const mongoose = require('mongoose');
const connect=require('./connection/conn')
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
// const DB = process.env.DATABASE;

// mongoose.connect(DB).then(con => {
//   console.log(con.connection);
//   console.log('done');
// });

connect();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
