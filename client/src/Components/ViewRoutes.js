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
  const [studyplanOption, setStudyplanOption] = useState(props.user.studyplan);
  const [studyplan, setStudyplan] = useState([]);
  const [edit, setEdit] = useState(false);

  const getStudyplan = async () => {
    const spcodes = await API.getStudyplan();
    setStudyplan(spcodes);
  };

  const deleteStudyplan = async () => {
    setStudyplan([]);
    setStudyplanOption(undefined);
    toast.promise(
      API.deleteStudyplan(),
      {
        pending: "Deleting Study Plan",
        success: "Study Plan deleted !",
        error: "Server Error !",
      },
      { position: toast.POSITION.TOP_CENTER }
    );
  };

  const createStudyplan = (spOption) => {
    if (!["part-time", "full-time", undefined].includes(spOption))
      throw "wrong studyplan option !";
    setStudyplanOption(spOption);
  };

  const saveStudyplan = async () => {
    await toast.promise(
      API.saveStudyplan(studyplanOption, studyplan),
      {
        pending: "Saving Study Plan",
        success: "Study Plan saved !",
        error: "Server Error !",
      },
      { position: toast.POSITION.TOP_CENTER }
    );
    setEdit(false);
    getStudyplan();
  };

  const resetStudyplan = async () => {
    toast.promise(
      getStudyplan(),
      {
        pending: "Resetting Study Plan",
        success: "Study Plan resetted",
        error: "Server Error !",
      },
      { position: toast.POSITION.TOP_CENTER }
    );
    setStudyplanOption(props.user.studyplan);
    setEdit(false);
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
        studyplan={studyplanOption}
        saveStudyplan={saveStudyplan}
        deleteStudyplan={deleteStudyplan}
        resetStudyplan={resetStudyplan}
        createStudyplan={createStudyplan}
        setEdit={setEdit}
        edit={edit}
        logOutButton
        handleLogOut={props.handleLogOut}
      />
      <Container>
        <h3>Courses</h3>
        <Container
          className={
            props.user && studyplanOption ? "tableContainer mb-5" : "mb-5"
          }
        >
          <CourseTable
            loggedIn
            edit={edit}
            courses={props.courses}
            spcodes={studyplan}
            addCourseStudyplan={addCourseStudyplan}
          />
        </Container>

        {props.user && studyplanOption && (
          <>
            <h3>Study Plan : {studyplanOption}</h3>
            <Container className="tableContainer">
              <CourseTable
                studyplan
                loggedIn
                edit={edit}
                courses={props.courses}
                spcodes={studyplan}
                deleteCourseStudyplan={deleteCourseStudyplan}
              />
            </Container>
          </>
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
