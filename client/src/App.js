import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";

import "./App.css";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DefaultRoute,
  HomeRoute,
  LoginRoute,
  PersonalHomeRoute,
} from "./Components/ViewRoutes";
import API from "./API";

function App() {
  const [user, setUser] = useState(undefined);
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const getCourses = async () => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  };

  const handleLogIn = async (username, password) => {
    toast.promise(
      API.logIn({ username, password }).then((student) => {
        setLoggedIn(true);
        setUser(student);
        return student.username;
      }),
      {
        pending: "logging in",
        success: {
          render({ data }) {
            return `Welcome ${data} !`;
          },
        },
        error: "Wrong Credentials !",
      },
      { position: toast.POSITION.TOP_CENTER }
    );
  };

  const handleLogOut = async (credentials) => {
    toast.promise(
      API.logOut().then(() => {
        setLoggedIn(false);
        setUser(undefined);
      }),
      {
        pending: "Logging out",
        success: "Succesfully logged out",
        error: "Server Error !",
      },
      { position: toast.POSITION.TOP_CENTER }
    );
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const student = await API.getUserInfo();
        setLoggedIn(true);
        setUser(student);
      } catch (e) {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <Container fluid>
      <ToastContainer transition={Bounce} autoClose={1500} />
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              loggedIn ? (
                <PersonalHomeRoute
                  user={user}
                  courses={courses}
                  getCourses={getCourses}
                  handleLogOut={handleLogOut}
                />
              ) : (
                <HomeRoute courses={courses} />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate replace to="/" />
              ) : (
                <LoginRoute handleLogIn={handleLogIn} />
              )
            }
          />
          <Route path="*" element={<DefaultRoute />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
