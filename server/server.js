"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");

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
  return res.status(401).end();
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

app.get("/api/students", (req, res) => {
  services
    .listStudents()
    .then((courses) => res.status(200).json(courses))
    .catch((err) => res.status(500).json(err));
});

app.get("/api/studyplan", isLoggedIn, (req, res) => {
  services
    .getStudyPlan(req.user.id)
    .then((courses) => res.status(200).json(courses))
    .catch((err) => res.status(500).json(err));
});

app.post("/api/studyplan", (req, res) => {
  services
    .addStudyPlan(req.user.id, req.body.studyplan, req.body.courses)
    .then(() => res.status(200).end())
    .catch((err) =>
      err.code && err.code <= 500
        ? res.status(err.code).json(err)
        : res.status(500).json(err)
    );
});

app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  console.log(req.user);
  res.status(201).json(req.user);
});

app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});
