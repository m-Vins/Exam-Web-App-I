import { CourseTable } from "./TableCompontens";
import Navbar from "./NavbarComponents";
import LogInForm from "./LoginFormComponents";
import { Container, Col } from "react-bootstrap";

import "../App.css";
import API from "../API";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  //NOTE think about adding a useEffect which trigger API.getStudyPlan

  const getStudyplan = async () => {
    const spcodes = await API.getStudyplan();
    setStudyplan(spcodes);
  };

  const deleteStudyPlan = async () => {
    setStudyplan([]);
    toast.promise(API.deleteStudyPlan(), {
      pending: "Promise is pending",
      success: "Promise resolved 👌",
      error: "Promise rejected 🤯",
    });
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
      <Navbar
        searchBar
        studyplanButton
        logOutButton
        handleLogOut={props.handleLogOut}
      />
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

        {props.user && props.user.studyplan != undefined ? (
          <>
            <h3>Study Plan : {props.user.studyplan}</h3>
            <Container className="tableContainer">
              <CourseTable
                studyplan
                loggedIn
                courses={props.courses}
                spcodes={studyplan}
                deleteCourseStudyplan={deleteCourseStudyplan}
              />
            </Container>
          </>
        ) : (
          <>//TODO add something here</>
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
