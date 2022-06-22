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
            {min} &le; credits number &le; {max}
          </h4>
        </Col>
      </Row>
      <Row className="ms-1 me-1 mt-1 mb-1">
        <ProgressBar
          now={credits}
          max={max}
          label={"current credits :" + credits}
          striped
          variant={credits >= min ? "success" : "danger"}
        />
      </Row>
    </Container>
  );
}

function PersonalHome(props) {
  const [studyplanOption, setStudyplanOption] = useState();
  const [oldStudyplan, setOldStudyplan] = useState([]);
  const [studyplan, setStudyplan] = useState([]);
  const [edit, setEdit] = useState(false);

  const getStudyplan = async () => {
    try {
      const studyplan = await API.getStudyplan();
      setStudyplanOption(studyplan.option);
      setStudyplan(studyplan.courses);
      setOldStudyplan(studyplan.courses);
    } catch (err) {
      toast.error("Server Error !");
    }
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
      }
    );
  };

  const createStudyplan = (spOption) => {
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
      }
    );
  };

  const resetStudyplan = async () => {
    toast.promise(
      getStudyplan().then(() => {
        setEdit(false);
      }),
      {
        pending: "Resetting Study Plan",
        success: "Study Plan resetted",
        error: "Server Error !",
      }
    );
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
        logOutButton
        studyplanButton
        studyplan={studyplanOption}
        saveStudyplan={saveStudyplan}
        deleteStudyplan={deleteStudyplan}
        resetStudyplan={resetStudyplan}
        createStudyplan={createStudyplan}
        setEdit={setEdit}
        edit={edit}
        handleLogOut={props.handleLogOut}
      />
      <Container>
        <h3>Courses</h3>
        <Container className={studyplanOption ? "tableContainer mb-2" : ""}>
          <CourseTable
            edit={edit}
            courses={props.courses}
            spcodes={studyplan}
            oldspcodes={oldStudyplan}
            addCourseStudyplan={addCourseStudyplan}
          />
        </Container>

        {studyplanOption && (
          <>
            <StudyPlanTitle
              courses={props.courses}
              spcodes={studyplan}
              studyplanOption={studyplanOption}
            />
            <Container className="tableContainer">
              <CourseTable
                studyplan
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
