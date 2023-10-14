// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require("express");
const bcrypt = require("bcryptjs");
const { checkPasswordLength, checkUsernameExists, checkUsernameFree } = require("./auth-middleware");
const UserData = require("../users/users-model");

const router = express.Router();

router.post("/register", checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 16);
    const newUser = {
      username: username,
      password: hash,
    }
    const result = await UserData.add(newUser);
    res.status(200).json(result);
  } catch (err) { next(err) }
})
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

router.post("/login", checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [userFound] = await UserData.findBy({ username: username });
    if (userFound && bcrypt.compareSync(password, userFound.password)) {
      req.session.user = userFound;
      res.status(200).json({ message: `Welcome ${userFound.username}` })
    }
  } catch (err) { next(err) }
})
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

router.get("/logout",async(req,res,next)=> {
  try {
    if (req.session && req.session.user) {
      req.session.destroy(err=> {
        if (err) {
          res.json({message : "cannot leave"}) 
        } else {
          res.json({message : "logged out"})
        }
      })
    } else {
      res.status(200).json({message : "no session"})
    }
  } catch (err) {next(err)}
})
/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;