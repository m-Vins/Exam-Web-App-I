"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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

app.get("/api/students/:studentID/studyplan", (req, res) => {
  services
    .getStudyPlan(req.params.studentID)
    .then((courses) => res.status(200).json(courses))
    .catch((err) => res.status(500).json(err));
});

app.post("/api/students/:studentID/studyplan", (req, res) => {
  services
    .addStudyPlan(req.params.studentID, req.body.studyplan, req.body.courses)
    .then(() => res.status(200).end())
    .catch((err) =>
      err.code && err.code <= 500
        ? res.status(err.code).json(err)
        : res.status(500).json(err)
    );
});
