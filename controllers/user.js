const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        });
        user.save()
          .then(result => {
            res.status(201).json({
              message: 'User created!',
              result: result
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
      });
  }

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ 
            message: 'Auth failed'
          });
        }
        fetchedUser = user;
        // user found, check right password
        return bcrypt.compare(req.body.password, user.password)
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({ 
            message: 'Auth failed'
          });
        }
  
        // valid password, now use json web token
        const token = jwt.sign(
          { email: fetchedUser.email, first_name: fetchedUser.first_name, last_name: fetchedUser.last_name, userId: fetchedUser._id }, 
          '23YS8deU3%n2958cs12*Un328NJJ8*&823HIi234$8LcoWn3rn', 
          { expiresIn: '2h'}
        );
        res.status(200).json({
          token: token,
          expiresIn: 7200,
          first_name: fetchedUser.first_name, 
          last_name: fetchedUser.last_name
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }