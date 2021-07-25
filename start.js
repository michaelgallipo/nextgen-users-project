const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');
// require('./models/User');

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

const server = app.listen(5000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});