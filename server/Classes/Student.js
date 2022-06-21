"use strict";

/**
 * Constructor function for new Student objects
 * @param {number} id student id
 * @param {string} username student username
 * @param {string} studyplan
 */

function Student(id, username) {
  this.id = id;
  this.username = username;
}

exports.Student = Student;
