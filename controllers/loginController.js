const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('../models/User');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if (user) {
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (validPassword) {
      const token = jwt.sign({ user: user.email }, process.env.JWTSECRET);
      res.status(200).json({jwt: token, id: user.id, user: user.email});
    } else {
      res.status(400).json({message: 'Invalid Password'});
    }
  } else {
    res.status(401).json({message: 'User Does Not Exist'})
  }
};
