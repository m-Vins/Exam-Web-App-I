import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";

import "./App.css";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
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
      //TODO insert pop up
    } catch (err) {
      //TODO pop up error
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await API.getUserInfo();
      setLoggedIn(true);
    }; //TODO insert a catch ?
    checkAuth();
  }, []);

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <Container fluid>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomeRoute courses={courses} />}></Route>
          <Route
            path="/student"
            element={<PersonalHomeRoute courses={courses} />}
          ></Route>
          <Route
            path="/login"
            element={<LoginRoute handleLogIn={handleLogIn} />}
          />
          <Route path="*" element={<DefaultRoute />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
