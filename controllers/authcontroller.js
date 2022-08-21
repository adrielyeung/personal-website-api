const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signup = (req, res) => {
  const user = new User({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
      if (err) {
          res.status(500)
            .send({
              message: err
            });
          return;
        } else {
          res.status(201)
            .json(user);
        }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    name: req.body.username
  })
  .exec((err, user) => {
    if (err) {
      res.status(500)
        .send({
          message: err
        });
      return;
    }
    if (!user) {
      return res.status(404)
        .send({
          message: "User Not found."
        });
    }

    // comparing passwords
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
      return res.status(401)
        .send({
          accessToken: null,
          message: "Invalid Password."
        });
    }
    
    // signing token with user id
    var token = jwt.sign({
      id: user.id
    }, process.env.API_SECRET, {
      expiresIn: 86400
    });

    // responding to client request with user profile success message and access token.
    res.status(200)
      .send({
        user: {
          id: user._id,
          email: user.email,
          username: user.name,
        },
        message: "Login successful.",
        accessToken: token,
      });
  });
};