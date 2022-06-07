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
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const getCourses = async () => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  };

  const handleLogIn = async (username, password) => {
    try {
      const Student = await API.logIn({ username, password });
      setLoggedIn(true);
      toast.success("Successfully logged in !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error("Wrong credentials !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleLogOut = async (credentials) => {
    await API.logOut();
    setLoggedIn(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getUserInfo();
        setLoggedIn(true);
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
