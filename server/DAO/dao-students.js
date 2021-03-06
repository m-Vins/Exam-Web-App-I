"use strict";
/* Data Access Object (DAO) module for accessing students */

const { db } = require("./db");
const { Student } = require("../Classes/Student");
const crypto = require("crypto");

/*
 * return the course codes of the courses within the studyplan
 * of the student with given the studentID
 */
exports.getStudyPlan = (studentID) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM studyPlans WHERE studentID=?";
    db.all(sql, [studentID], (err, rows) => {
      if (err) reject(err);
      else {
        const student = rows.map((row) => row.courseID);
        resolve(student);
      }
    });
  });
};

/*
 * add the study plan for the given student.
 *
 * this function will completely overwrite the previous studyplan if present.
 * 1. the old studyplan is completely deleted
 * 2. the new studyplan is added
 * 3. student studyplan option is set
 */
exports.addStudyPlan = (studentID, studyplan, courseCodes) => {
  //check the validity of the study plan option
  if (["part-time", "full-time"].includes(studyplan)) {
    return new Promise((resolve, reject) => {
      db.serialize(function () {
        const SQL1 = "DELETE FROM studyPlans WHERE studentID=?";
        const SQL2 = "INSERT INTO studyPlans(studentID,courseID) VALUES(?,?)";
        const SQL3 = "UPDATE students SET studyplan=? WHERE id=?";

        // 1. delete old study plan
        db.run(SQL1, [studentID], function (err) {
          if (err) reject(err);
        });

        // 2. add each course code of the new studyplan
        for (const courseCode of courseCodes) {
          db.run(SQL2, [studentID, courseCode], function (err) {
            if (err) reject(err);
          });
        }

        // 3. set the studyplan option for the student
        db.run(SQL3, [studyplan, studentID], function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });
    });
  } else throw { message: "wrong studyplan option", code: 422 };
};

/*
 * delete the study plan for the given student
 *
 * 1. the studyplan is deleted
 * 2. the student studyplan option is set to NULL
 */
exports.deleteStudyPlan = (studentID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      const SQL1 = "DELETE FROM studyPlans WHERE studentID=?";
      const SQL2 = "UPDATE students SET studyplan=NULL WHERE id=?";
      db.run(SQL1, [studentID], function (err) {
        if (err) reject(err);
      });
      db.run(SQL2, [studentID], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  });
};

/*
 * get the Studyplan option fo the student with the given studentID
 */
exports.getStudyPlanOption = (studentID) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT studyplan FROM students WHERE id=?";
    db.get(sql, [studentID], (err, row) => {
      if (err) reject(err);
      else {
        resolve(row.studyplan);
      }
    });
  });
};

/*
 * get the student with the given username and password
 */
exports.getStudent = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM students WHERE username=?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve(false);
      else {
        const student = new Student(row.id, row.username);
        crypto.scrypt(password, row.salt, 64, function (err, hashedPassword) {
          /**
           * uncomment next line to generate the hash and read from the console
           */
          //console.log(hashedPassword.toString("hex"));
          if (err) reject(err);
          if (
            crypto.timingSafeEqual(Buffer.from(row.hash, "hex"), hashedPassword)
          )
            resolve(student);
          else resolve(false);
        });
      }
    });
  });
};
