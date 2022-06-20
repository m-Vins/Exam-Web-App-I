"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const { body, validationResult } = require("express-validator");

const Services = require("./services");

const services = new Services();
const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const student = await services.getStudent(username, password);
    if (!student) return cb(null, false);
    return cb(null, student);
  })
);

//TODO CHANGE THE INFORMATION SAVED HERE
passport.serializeUser(function (student, cb) {
  cb(null, student);
});

passport.deserializeUser(function (student, cb) {
  return cb(null, student);
});

app.use(
  session({
    secret: `It's a secret`,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Wrong credentials   " });
};

// activate the server
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}.`)
);

app.get("/api/courses", (req, res) => {
  services
    .listCourses()
    .then((courses) => res.status(200).json(courses))
    .catch((err) => res.status(500).json(err));
});

app.get("/api/studyplan", isLoggedIn, (req, res) => {
  services
    .getStudyPlan(req.user.id)
    .then((courses) => res.status(200).json(courses))
    .catch((err) => res.status(500).json(err));
});

//TODO add validation
app.post(
  "/api/studyplan",
  isLoggedIn,
  body("studyplan").isIn(["part-time", "full-time"]),
  body("courses").isArray(),
  body("courses.*").isString().isLength({ min: 7, max: 7 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    services
      .addStudyPlan(req.user.id, req.body.studyplan, req.body.courses)
      .then(() => res.status(200).end())
      .catch((err) =>
        err.code && err.code <= 500
          ? res.status(err.code).json(err)
          : res.status(500).json(err)
      );
  }
);

app.delete("/api/studyplan", isLoggedIn, (req, res) => {
  services
    .deleteStudyPlan(req.user.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json(err));
});

app.post(
  "/api/sessions",
  body("username").isEmail(),
  passport.authenticate("local"),
  body("password").isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    res.status(201).json(req.user);
  }
);

app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });

  // req.logout(() => {
  //   new Promise(() => setTimeout(() => res.end(), 3000));
  // });
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});
