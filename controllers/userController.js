const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const permissions = ['administrator', 'content creator', 'community moderator', 'unprivileged'];

exports.listAllUsers = (req, res) => {
  let filter = [{'permission': {$in: permissions}}];
  if (req.query.permission) {
    filter[0].permission = req.query.permission
  };
  if (req.query.name) {
    filter.push({'name': new RegExp(req.query.name)})
  }
  if (req.query.email) {
    filter.push({'email': new RegExp(req.query.email)})
  }
  console.log(filter);
  User.find({$or: filter}, (err, users) => {
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
      console.log(err);
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

exports.login = async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if (user) {
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (validPassword) {
      res.status(200).json({message: 'Valid Password'});
    } else {
      res.status(400).json({message: 'Invalid Password'});
    }
  } else {
    res.status(401).json({message: 'User Does Not Exist'})
  }
};
