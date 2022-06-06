"use strict";

/**
 * Constructor function for new Student objects
 * @param {number} id student id
 * @param {string} username student username
 * @param {string} studyplan
 */

function Student(id, username, studyplan = null) {
  this.id = id;
  this.username = username;
  this.studyplan = studyplan;
}

exports.Student = Student;
