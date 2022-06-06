import Course from "./Classes/Course";
import Student from "./Classes/Student";

const SERVER_URL = "http://localhost:3001";

const getAllCourses = async () => {
  const response = await fetch(SERVER_URL + "/api/courses");
  const responseJson = await response.json();
  if (response.ok)
    return responseJson.map(
      (course) =>
        new Course(
          course.code,
          course.name,
          course.credits,
          course.preparatoryCourse,
          course.maxStudentsNumber,
          course.incompatibleCourses,
          course.currentStudentsNumber
        )
    );
  else throw responseJson;
};

const API = { getAllCourses };
export default API;
