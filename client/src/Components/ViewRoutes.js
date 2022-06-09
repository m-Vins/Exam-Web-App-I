import { CourseTable } from "./TableCompontens";
import Navbar from "./NavbarComponents";
import LogInForm from "./LoginFormComponents";
import { Container, Col } from "react-bootstrap";

import "../App.css";
import API from "../API";
import { useEffect, useState } from "react";

function DefaultRoute() {
  return (
    <>
      <h1>Nothing here...</h1>
      <p>This is not the route you are looking for!</p>
    </>
  );
}

function HomeRoute(props) {
  return (
    <>
      <Navbar searchBar logInButton />
      <Container>
        <CourseTable courses={props.courses} />
      </Container>
    </>
  );
}

function PersonalHomeRoute(props) {
  const [studyplan, setStudyplan] = useState([]);

  const getStudyplan = async () => {
    const spcodes = await API.getStudyplan();
    setStudyplan(spcodes);
  };

  const saveStudyplan = async () => {
    await API.saveStudyplan();
    getStudyplan();
  };

  useEffect(() => {
    getStudyplan();
  }, []);

  const addCourseStudyplan = (courseCode) => {
    setStudyplan((sp) => [...sp, courseCode]);
  };

  const deleteCourseStudyplan = (courseCode) => {
    setStudyplan((sp) => sp.filter((c) => c != courseCode));
  };

  return (
    <>
      <Navbar searchBar logOutButton handleLogOut={props.handleLogOut} />
      <Container>
        <h3>Courses</h3>
        <Container className="tableContainer mb-5">
          <CourseTable
            loggedIn
            courses={props.courses}
            spcodes={studyplan}
            addCourseStudyplan={addCourseStudyplan}
          />
        </Container>
        <h3>Study Plan</h3>
        {studyplan.length > 0 ? (
          <Container className="tableContainer">
            <CourseTable
              studyplan
              loggedIn
              courses={props.courses}
              spcodes={studyplan}
              deleteCourseStudyplan={deleteCourseStudyplan}
            />
          </Container>
        ) : (
          <></>
        )}
      </Container>
    </>
  );
}

function LoginRoute(props) {
  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <Col md={{ span: 4, offset: 4 }}>
          <LogInForm handleLogIn={props.handleLogIn} />
        </Col>
      </Container>
    </>
  );
}

export { HomeRoute, DefaultRoute, LoginRoute, PersonalHomeRoute };
