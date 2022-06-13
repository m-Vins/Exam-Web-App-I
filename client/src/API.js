import Course from "./Classes/Course";
import Student from "./Classes/Student";

const SERVER_URL = "http://localhost:3001";

//TODO fix error messages

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

const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return null;
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

const getStudyplan = async () => {
  const response = await fetch(SERVER_URL + "/api/studyplan", {
    credentials: "include",
  });
  const courses = await response.json();
  if (response.ok) {
    return courses;
  } else {
    throw courses;
  }
};

const saveStudyplan = async (studyplanOption, courses) => {
  const response = await fetch(SERVER_URL + "/api/studyplan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ studyplan: studyplanOption, courses: courses }),
  });

  if (response.ok) return;
  const responseJson = await response.json();
  throw responseJson;
};

const deleteStudyplan = async () => {
  const response = await fetch(SERVER_URL + "/api/studyplan", {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) alert("something went wrong!");
};

const API = {
  getAllCourses,
  logIn,
  logOut,
  getUserInfo,
  getStudyplan,
  saveStudyplan,
  deleteStudyplan,
};
export default API;
