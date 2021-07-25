const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User');

router.get('/', (req, res) => {
  // res.send('It works!');
  User.find({}, (err, users) => {
    if (err) res.send(err);
    res.json(users);
  });
});

router.post('/', (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save()
    .then(() => { res.send('User Successfully Saved!'); })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});

module.exports = router;