/**
 * Constructor function for new Course objects
 * @param {string} code course code
 * @param {string} name course name
 * @param {number} credits number of credits (e.g., 6)
 * @param {string} preparatoryCourse
 * @param {number} maxStudentsNumber
 */
function Course(
  code,
  name,
  credits,
  preparatoryCourse = undefined,
  maxStudentsNumber = undefined,
  incompatibleCourses = undefined,
  currentStudentsNumber = undefined
) {
  this.code = code;
  this.name = name;
  this.credits = credits;
  this.preparatoryCourse = preparatoryCourse;
  this.maxStudentsNumber = maxStudentsNumber;
  this.incompatibleCourses = incompatibleCourses;
  this.currentStudentsNumber = currentStudentsNumber;
}

export default Course;
