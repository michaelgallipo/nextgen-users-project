const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User');

exports.listAllUsers = (req, res) => {
  console.log(req.query);
  let filter = req.query || {};
  User.find(filter, (err, users) => {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.createUser = (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(() => { res.send('User Successfully Saved!'); })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
};

exports.findUser = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
};

exports.deleteUser = (req, res) => {
  User.deleteOne({_id: req.params.userId}, (err) => {
    if (err) res.send(err);
    res.json({
      message: 'User Successfully Deleted',
      _id: req.params.userId
    });
  });
}