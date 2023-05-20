const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const Secret_Key = process.env.TOKEN_SECRET_KEY;

const generateAccessToken = (id, name) => {
  return jwt.sign({ userId: id, name: name }, Secret_Key);
}

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
      let response = await User.create({
        name: name,
        email: email,
        phone: phone,
        password: hash,
      });
      res.status(201).json({ message: "User Created Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Email Already Exists" });
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await User.findOne({ where: { email: email } });
    bcrypt.compare(password, users.password, (err, response) => {
      if (response == true) {
        res
          .status(200)
          .json({
            message: "Logged In Successfully..!",
            token: generateAccessToken(users.id, users.name),
          });
      } else {
        res.status(400).json({ error: "Invalid Email or Password" });
      }
    });
  } catch (error) {
    res.status(404).json({ error: "User Not Found" });
  }
}

exports.dashboard = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await User.findOne({ where: { id: id } });
    const users = await User.findAll();
    res.status(200).json({ response, users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}