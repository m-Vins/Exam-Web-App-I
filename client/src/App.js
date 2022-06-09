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
    try {
      const student = await API.logIn({ username, password });
      setLoggedIn(true);
      setUser(student);
      toast.success(`Welcome ${student.username} !`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error("Wrong credentials !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleLogOut = async (credentials) => {
    try {
      await API.logOut();
      setLoggedIn(false);
      setUser(undefined);
      toast.success(`Succesfully logged out!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (e) {
      toast.error("Server Error !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
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
      <ToastContainer transition={Bounce} />
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              loggedIn ? (
                <PersonalHomeRoute
                  user={user}
                  courses={courses}
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
