const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: `.config.env` });
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

mongoose
  .connect(process.env.DATABASE, {
    authSource: 'admin',
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {});

//READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//IMPORT DATA INTO DB
const importData = async () => {
  console.log(__dirname);
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    process.exit();
  } catch (err) {
    process.exit();
  }
};

//DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    process.exit();
  } catch (err) {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
