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
  if (!validateEmail(user.email)) {
    return res.status(400).send('Invalid Email')
  }
  user.password = user.password ? user.password : ""
  let passwordErrors = validatePassword(user.password);
  if (passwordErrors.length > 0) {
    return res.status(400).send(passwordErrors);
  }
  user.password = await bcrypt.hash(user.password, saltRounds);
  user.save()
    .then(() => { res.send('User Successfully Saved!'); })
    .catch((err) => {
      if (err.errors) {
        // res.status(400).send(err.errors.permission.message);
        let errArray = Object.entries(err.errors);
        let errMessage = errArray.map(error => error[1].message);
        res.status(400).send(errMessage);        
      }
      else {
        res.status(400).send('Sorry! Something went wrong.');
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
  if (req.body.email) {
    if (!validateEmail(req.body.email)) {
      return res.status(400).send('Invalid Email')
    }
  };
  if (req.body.password) {
    let passwordErrors = validatePassword(req.body.password);
    if (passwordErrors.length > 0) {
      return res.status(400).send(passwordErrors);
    }
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  };
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

const validateEmail = (email) => {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
  {
    return true
  }
    return false
};

const validatePassword = (password) => {
  const errors = [];
  // could chain tests together but would generate more generic error message
  if (password.length < 8) {
    errors.push("Password must contain at least 8 charachters");
  }
  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one digit");
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lower case letter")
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one upper case letter")
  }
  if (!/(?=.*[!@#$%^&*])/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return errors;
};