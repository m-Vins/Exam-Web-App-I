"use strict";
/* Data Access Object (DAO) module for accessing students */

const { db } = require("./db");
const { Student } = require("../Classes/Student");
const crypto = require("crypto");

/*
 * List all the students within the database
 */
exports.listStudents = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM students";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const student = rows.map(
          (row) => new Student(row.id, row.username, row.studyplan)
        );
        resolve(student);
      }
    });
  });
};

/*
 * return the course codes of the exams within the studyplan
 * of the given student
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

exports.getStudent = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM students WHERE username=?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve(false);
      else {
        const student = new Student(row.id, row.username, row.studyplan);

        crypto.scrypt(password, row.salt, 64, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            crypto.timingSafeEqual(Buffer.from(row.hash, "hex"), hashedPassword)
          )
            resolve(user);
          else resolve(false);
        });
      }
    });
  });
};

/*
exports.studyPlanAddExam = (studentID, courseID) => {
  return new Promise((resolve, reject) => {
    const SQL = "INSERT INTO studyPlans(studentID,courseID) VALUES(?,?)";
    db.run(SQL, [studentID, courseID], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

exports.studyPlanDeleteExam = (studentID, courseID) => {
  return new Promise((resolve, reject) => {
    const SQL = "DELETE FROM studyPlans WHERE studentID=? AND courseID=?";
    db.run(SQL, [studentID, courseID], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};
*/
