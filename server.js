const mongoose = require('mongoose');
require('dotenv').config({ path: `${__dirname}/config.env` });
const app = require('./app');

process.on('uncaughtException', (err) => {
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE, {
    authSource: 'admin',
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log(process.env.DATABASE);
  server.close(() => {
    process.exit(1);
  });
});
