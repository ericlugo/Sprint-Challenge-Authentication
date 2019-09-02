const router = require('express').Router();
const db = require('../database/dbConfig.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets.js');

router.post('/register', async (req, res) => {
  const user = req.body;
  (!user.username || !user.password) &&
    res.status(400).json({
      success: false,
      message: `Registration must contain a valid username and password`,
    });

  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  try {
    const newUser = await addUser(user);
    newUser &&
      res.status(201).json({
        success: true,
        message: `User successfully created.`,
        newUser,
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Fatal Error.\n${err}`,
    });
  }
});

router.post('/login', async (req, res) => {
  const loginCredentials = req.body;
  (!loginCredentials.username || !loginCredentials.password) &&
    res.status(400).json({
      success: false,
      message: `All login requests must include a username and a password`,
    });

  try {
    const user = await findUser(loginCredentials.username);
    if (user) {
      if (bcrypt.compareSync(loginCredentials.password, user.password)) {
        const token = genToken(user);
        res.status(200).json({
          success: true,
          message: `Welcome ${user.username}`,
          token,
        });
      } else {
        res.status(401).json({
          success: false,
          message: `Incorrect Password.`,
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: `Invalid Username.`,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Fatal Error.\n${err}`,
    });
  }
});

module.exports = router;

async function addUser(user) {
  const [id] = await db('users').insert(user, 'id');
  return db('users')
    .where('id', id)
    .first();
}

function findUser(username) {
  return db('users')
    .where('username', username)
    .first();
}

function genToken(user) {
  const payload = {
    subject: 'user',
    user_id: user.user_id,
  };
  const secret = secrets.AUTH_SECRET;
  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secret, options);
}
