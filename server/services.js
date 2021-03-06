"use strict";
const daoCourses = require("./DAO/dao-courses");
const daoStudent = require("./DAO/dao-students");

const limits = {
  "full-time": { min: 60, max: 80 },
  "part-time": { min: 20, max: 40 },
};

function Services() {
  this.getStudent = (username, password) =>
    daoStudent.getStudent(username, password);

  this.listCourses = () =>
    daoCourses.listCourses().then((courses) =>
      Promise.all(
        courses.map(async (course) => {
          const incompatibleCourses = await daoCourses.getIncompatibleCourses(
            course.code
          );

          const currentStudentsNumber =
            await daoCourses.getCourseCurrentStudentsNumber(course.code);

          course.incompatibleCourses = incompatibleCourses;
          course.currentStudentsNumber = currentStudentsNumber;
          return course;
        })
      )
    );

  this.getStudyPlan = (studentID) =>
    daoStudent.getStudyPlan(studentID).then(async (sp) => {
      const spOption = await daoStudent.getStudyPlanOption(studentID);
      return { option: spOption, courses: sp };
    });

  this.deleteStudyPlan = (studentID) => daoStudent.deleteStudyPlan(studentID);

  this.addStudyPlan = async (studentID, studyplan, courseCodes) => {
    /*
     * here the back end double check the validity of the study plan.
     * each time the client need to modify the study plan, it should send a
     * new studyplan
     */
    let errMessage = [];

    /**
     * check duplicated courses
     */
    if ([...new Set(courseCodes)].length != courseCodes.length)
      throw { message: "courseCodes contains duplicated elements", code: 422 };

    /**
     * create an array of the courses of the studyplan with all the info needed
     * to perform the checks
     */
    const courses = await daoCourses
      .listCourses()
      .then((courses) =>
        courses.filter((course) => courseCodes.includes(course.code))
      )
      .then((courses) =>
        Promise.all(
          courses.map(async (course) => {
            const incompatibleCourses = await daoCourses.getIncompatibleCourses(
              course.code
            );

            const currentStudentsNumber =
              await daoCourses.getCourseCurrentStudentsNumberExceptGivenStudent(
                course.code,
                studentID
              );

            return {
              ...course,
              incompatibleCourses: incompatibleCourses,
              currentStudentsNumber: currentStudentsNumber,
            };
          })
        )
      );

    /**
     * check if courseCodes contains invalid codes
     */
    if (courses.length !== courseCodes.length)
      throw { message: "courseCodes contains invalid codes", code: 422 };

    //check constraints
    for (const course of courses) {
      for (const incompatibleCourse of course.incompatibleCourses) {
        if (courseCodes.includes(incompatibleCourse)) {
          errMessage.push([
            "incompatible courses : " +
              incompatibleCourse +
              " & " +
              course.code,
          ]);
        }
      }
      if (
        course.preparatoryCourse &&
        !courseCodes.includes(course.preparatoryCourse)
      )
        errMessage.push([
          "missing preparatory course " +
            course.preparatoryCourse +
            " for " +
            course.code,
        ]);

      if (
        course.maxStudentsNumber &&
        course.currentStudentsNumber + 1 > course.maxStudentsNumber
      )
        errMessage.push([
          "number of student for the course " +
            course.code +
            " exceed the limit",
        ]);
    }

    const credits = courses
      .map((course) => course.credits)
      .reduce((accumulator, curr) => accumulator + curr, 0);

    if (credits > limits[studyplan]["max"])
      errMessage.push([
        "number of credits exceeds max limit for " + studyplan + " option",
      ]);

    if (credits < limits[studyplan]["min"])
      errMessage.push([
        "number of credits below min limit for " + studyplan + " option",
      ]);

    if (errMessage.length > 0) throw { message: errMessage, code: 422 };

    daoStudent.addStudyPlan(studentID, studyplan, courseCodes);
  };
}

module.exports = Services;
