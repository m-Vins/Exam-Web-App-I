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

  const getCourses = async () => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  };

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
          <Route path="/login" element={<LoginRoute />} />
          <Route path="*" element={<DefaultRoute />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
