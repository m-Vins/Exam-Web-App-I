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

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    const student = new Student(user.id, user.username, user.studyplan);
    return student;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    credentials: "include",
  });
  const user = await response.json();
  const student = new Student(user.id, user.username, user.studyplan);
  if (response.ok) {
    return student;
  } else {
    throw user;
  }
};

const API = { getAllCourses, logIn, getUserInfo };
export default API;
