const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.listAllUsers = (req, res) => {
  // allows filtering by multiple criteria, starts with default of none
  // Filtering is 'OR' and name and email allow partial matches
  const filter = [];
  if (req.query.permission) {
    filter.push({'permission': req.query.permission});
  };
  if (req.query.name) {
    filter.push({'name': new RegExp(req.query.name)})
  }
  if (req.query.email) {
    filter.push({'email': new RegExp(req.query.email)})
  }
  const filterObj = filter.length > 0 ? {$or: filter} : {};
  User.find(filterObj, (err, users) => {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  user.password = await bcrypt.hash(user.password, saltRounds);
  user.save()
    .then(() => { res.send('User Successfully Saved!'); })
    .catch((err) => {
      if (err.errors.permission) {
        res.send(err.errors.permission.message);
      }
      else {
        res.send('Sorry! Something went wrong.');
      }
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

exports.updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  }
  User.findOneAndUpdate(
    {_id: req.params.userId},
    req.body,
    {new: true},
    (err, user) => {
      if (err) res.send(err);
      res.json(user);
    }
  );
};

