import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Table, Button, Tooltip, OverlayTrigger } from "react-bootstrap";

function CourseRow(props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr>
        <td>{props.code}</td>
        <td>{props.name}</td>
        <td>{props.credits}</td>
        <td>{props.currentStudentsNumber}</td>
        <td>{props.maxStudentsNumber}</td>
        {props.loggedIn && (
          <td>
            <IncompatibleExam />
            <Button size="sm" variant="outline-success" className="ms-1">
              <i className="bi bi-plus"></i>
            </Button>
            <Button
              size="sm"
              variant="outline-primary"
              className="ms-1"
              onClick={() => setExpanded((e) => !e)}
            >
              <i
                className={expanded ? "bi bi-caret-up" : "bi bi-caret-down"}
              ></i>
            </Button>
          </td>
        )}
      </tr>
      {expanded && (
        //try with table inside table
        <tr>
          <td colSpan={6}>
            <ul className="ms-4 ">
              {props.incompatibleCourses.length > 0 && (
                <li>
                  incompatible courses :{" "}
                  {props.incompatibleCourses.map(
                    (course, index) =>
                      course +
                      (index == props.incompatibleCourses.length - 1
                        ? ""
                        : ", ")
                  )}
                </li>
              )}
              {props.preparatoryCourse && <li>{props.preparatoryCourse}</li>}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

function IncompatibleExam(props) {
  return (
    <>
      <OverlayTrigger placement="right" overlay={<Tooltip>Tooltip</Tooltip>}>
        {!props.ok ? (
          <Button size="sm" variant="danger">
            <i className="bi bi-exclamation-circle"></i>
          </Button>
        ) : (
          <Button size="sm" variant="outline-succes">
            <i className="bi bi-check2"></i>
          </Button>
        )}
      </OverlayTrigger>
    </>
  );
}

function CourseTable(props) {
  return (
    <Table scrolly="true" striped bordered hover>
      <thead>
        <tr>
          <th>code</th>
          <th>name</th>
          <th>credits</th>
          <th>current students number</th>
          <th>max students number</th>
          {props.loggedIn && <th></th>}
        </tr>
      </thead>

      <tbody>
        {props.courses.map((course) => {
          return (
            <CourseRow
              loggedIn={props.loggedIn}
              key={course.code}
              code={course.code}
              name={course.name}
              credits={course.credits}
              preparatoryCourse={course.preparatoryCourse}
              maxStudentsNumber={course.maxStudentsNumber}
              incompatibleCourses={course.incompatibleCourses}
              currentStudentsNumber={course.currentStudentsNumber}
            />
          );
        })}
      </tbody>
    </Table>
  );
}

export default CourseTable;
