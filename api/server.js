const express = require("express");
const AuthRouter = require("./auth/auth-router");
const UserRouter = require("./users/users-router");


const session = require("express-session");
const Store = require("connect-session-knex")(session);//eslint-disable-line


const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(morgan("dev"));

server.use(session({
  name: "chocolatechip",
  secret: "let me walk the dog",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: new Store({
    knex: require("../data/db-config"),
    tablename: "session_storage",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
}))

server.use("/api/auth", AuthRouter)
server.use("/api/users",UserRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
