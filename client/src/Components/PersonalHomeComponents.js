import { CourseTable } from "./TableCompontens";
import Navbar from "./NavbarComponents";
import { Container, Col, Row, ProgressBar } from "react-bootstrap";

import "../App.css";
import API from "../API";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function StudyPlanTitle(props) {
  const max = { "part-time": 40, "full-time": 80 }[props.studyplanOption];
  const min = { "part-time": 20, "full-time": 60 }[props.studyplanOption];
  const credits = props.courses
    .filter((course) => props.spcodes.includes(course.code))
    .map((course) => course.credits)
    .reduce((accumulator, curr) => accumulator + curr, 0);

  return (
    <Container>
      <Row>
        <Col>
          <h3>Study Plan : {props.studyplanOption}</h3>
        </Col>
        <Col md={{ span: 4, offset: 1 }}>
          <h4>
            {min} &ge; credits number &ge; {max}
          </h4>
        </Col>
      </Row>
      <Row className="ms-1 me-1 mt-1 mb-1">
        <ProgressBar
          now={credits}
          max={max}
          label={"current credits :" + credits}
          striped
          variant={credits > min ? "success" : "danger"}
        />
      </Row>
    </Container>
  );
}

function PersonalHome(props) {
  const [studyplanOption, setStudyplanOption] = useState(props.user.studyplan);
  const [oldStudyplan, setOldStudyplan] = useState([]);
  const [studyplan, setStudyplan] = useState([]);
  const [edit, setEdit] = useState(false);

  const getStudyplan = async () => {
    const spcodes = await API.getStudyplan();
    setStudyplan(spcodes);
    setOldStudyplan(spcodes);
  };

  const deleteStudyplan = () => {
    toast.promise(
      API.deleteStudyplan()
        .then(() => props.getCourses())
        .then(() => {
          setStudyplan([]);
          setOldStudyplan([]);
          setStudyplanOption(undefined);
        }),
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
      throw new Error("wrong studyplan option !");
    setStudyplanOption(spOption);
  };

  const saveStudyplan = () => {
    toast.promise(
      API.saveStudyplan(studyplanOption, studyplan)
        .then(() => props.getCourses())
        .then(() => {
          setEdit(false);
          getStudyplan();
        })
        .catch((err) => {
          throw err.message;
        }),
      {
        pending: "Saving Study Plan",
        success: "Study Plan saved !",
        error: {
          render({ data }) {
            return `Error : ${data} !`;
          },
        },
      },
      { position: toast.POSITION.TOP_CENTER }
    );
  };

  // const resetStudyplan = async () => {
  //   toast.promise(
  //     getStudyplan().then(() => {
  //       setStudyplanOption(props.user.studyplan);
  //       setEdit(false);
  //     }),
  //     {
  //       pending: "Resetting Study Plan",
  //       success: "Study Plan resetted",
  //       error: "Server Error !",
  //     },
  //     { position: toast.POSITION.TOP_CENTER }
  //   );
  // };

  const resetStudyplan = () => {
    setStudyplan([...oldStudyplan]);
  };

  useEffect(() => {
    getStudyplan();
  }, []);

  const addCourseStudyplan = (courseCode) => {
    setStudyplan((sp) => [...sp, courseCode]);
  };

  const deleteCourseStudyplan = (courseCode) => {
    setStudyplan((sp) => sp.filter((c) => c !== courseCode));
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
          //TODO can props.user be removed here?
          className={props.user && studyplanOption ? "tableContainer mb-2" : ""}
        >
          <CourseTable
            loggedIn
            edit={edit}
            courses={props.courses}
            spcodes={studyplan}
            oldspcodes={oldStudyplan}
            addCourseStudyplan={addCourseStudyplan}
          />
        </Container>

        {props.user && studyplanOption && (
          <>
            <StudyPlanTitle
              courses={props.courses}
              spcodes={studyplan}
              studyplanOption={studyplanOption}
            />
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

export { PersonalHome };
