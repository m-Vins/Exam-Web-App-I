"use strict";
/* Data Access Object (DAO) module for accessing courses */

const { db } = require("./db");
const { Course } = require("../Classes/Course");

exports.listCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM courses";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const courses = rows.map(
          (row) =>
            new Course(
              row.code,
              row.name,
              row.credits,
              row.preparatoryCourse,
              row.maxStudentsNumber
            )
        );
        resolve(courses);
      }
    });
  });
};

exports.getIncompatibleCourses = (code) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM incompatibleCourses WHERE code_1=? OR code_2=?";
    db.all(sql, [code, code], (err, rows) => {
      if (err) reject(err);
      else {
        const courses = rows.map((row) => {
          if (row.code_1 == code) return row.code_2;
          if (row.code_2 == code) return row.code_1;
          throw "unexpected row in getIncompatibleCourses";
        });
        resolve(courses);
      }
    });
  });
};

exports.getCourseCurrentStudentsNumber = (code) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS studentNumber FROM studyplans WHERE courseID=?";
    db.all(sql, [code], (err, rows) => {
      if (err) reject(err);
      else {
        resolve(rows[0].studentNumber);
      }
    });
  });
};

exports.getCourseCurrentStudentsNumberExceptGivenStudent = (
  courseID,
  studentID
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS studentNumber FROM studyplans WHERE courseID=? AND studentID != ?";
    db.all(sql, [courseID, studentID], (err, rows) => {
      if (err) reject(err);
      else {
        resolve(rows[0].studentNumber);
      }
    });
  });
};
