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
          <RowActions
            studyplan={props.studyplan}
            spcodes={props.spcodes}
            code={props.code}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        )}
      </tr>
      {expanded && (
        <ExpandedRow
          incompatibleCourses={props.incompatibleCourses}
          preparatoryCourse={props.preparatoryCourse}
        />
      )}
    </>
  );
}

function RowActions(props) {
  const ok = props.spcodes && props.spcodes.includes(props.code) ? false : true;
  const msg = ok ? "ok" : "already in studyplan";
  return (
    <td>
      {props.studyplan && (
        <Button size="sm" variant="outline-danger" className="ms-1">
          <i className="bi bi-x-lg"></i>
        </Button>
      )}
      {props.studyplan ||
        (ok ? (
          <Button
            size="sm"
            variant="outline-success"
            className="ms-1"
            disabled={!ok}
          >
            <i className="bi bi-plus"></i>
          </Button>
        ) : (
          <CourseToolTip ok={ok} msg={msg} />
        ))}

      {props.studyplan || (
        <Button
          size="sm"
          variant="outline-primary"
          className="ms-1"
          onClick={() => props.setExpanded((e) => !e)}
        >
          <i
            className={props.expanded ? "bi bi-caret-up" : "bi bi-caret-down"}
          ></i>
        </Button>
      )}
    </td>
  );
}

function ExpandedRow(props) {
  return (
    <tr>
      <td colSpan={6}>
        <ul className="ms-4 ">
          {props.incompatibleCourses.length > 0 && (
            <li>
              incompatible courses :{" "}
              {props.incompatibleCourses.map(
                (course, index) =>
                  course +
                  (index === props.incompatibleCourses.length - 1 ? "" : ", ")
              )}
            </li>
          )}
          {props.preparatoryCourse && <li>{props.preparatoryCourse}</li>}
        </ul>
      </td>
    </tr>
  );
}

function CourseToolTip(props) {
  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip>{props.msg}</Tooltip>}
      >
        {!props.ok ? (
          <Button className="ms-1" size="sm" variant="danger">
            <i className="bi bi-exclamation-circle"></i>
          </Button>
        ) : (
          <Button className="ms-1" size="sm" variant="outline-success">
            <i className="bi bi-check2"></i>
          </Button>
        )}
      </OverlayTrigger>
    </>
  );
}

function CourseTable(props) {
  return (
    <Table scrolly="true" size={props.loggedIn && "sm"} striped bordered hover>
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
              spcodes={props.spcodes}
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

function StudyplanTable(props) {
  return (
    <Table scrolly="true" size={props.loggedIn && "sm"} striped bordered hover>
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
              studyplan
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

export { CourseTable, StudyplanTable };
