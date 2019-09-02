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

router.post('/login', (req, res) => {
  // implement login
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
