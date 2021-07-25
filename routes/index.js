const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User');

router.get('/', (req, res) => {
  console.log(req.query);
  let filter = req.query || {};
  User.find(filter, (err, users) => {
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

router.get('/:userId', (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
})

router.delete('/:userId', (req, res) => {
  User.deleteOne({_id: req.params.userId}, (err) => {
    if (err) res.send(err);
    res.json({
      message: 'User Successfully Deleted',
      _id: req.params.userId
    });
  });
})

module.exports = router;