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
            incompatibleCourses={props.incompatibleCourses}
            preparatoryCourse={props.preparatoryCourse}
            deleteCourseStudyplan={props.deleteCourseStudyplan}
            addCourseStudyplan={props.addCourseStudyplan}
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

/**
 * @param props.studyplan just to know whether we are in the coursetable or studyplantable
 * @param props.spcodes array of the courses codes in the studyplan
 * @param props.code code of the given course
 * @param props.preparatoryCourse preparatory course coude of the given course
 * @param props.incompatibleCourses array of incompatible courses codes of the given course
 * @param props.deleteCourseStudyplan
 * @param props.addCourseStudyplan
 * @param props.expanded
 * @returns
 */
function RowActions(props) {
  /**
   * check if the course can be added to the studyplan
   *
   * please note: _checkCourseToAdd is called only when props.spcodes is not falsy, this because
   * this function (RowActions) can be called both in CourseTable and StudyplanTable.
   * In the latter case, there is no need to check if the exam can be added in the studyplan
   * because is already there, thus it is assigned [true, ""] to [ok, msg] which anyway in this case
   * wont be used.
   */
  const [ok, msg] = (props.spcodes &&
    _checkCourseToAdd(
      props.code,
      props.preparatoryCourse,
      props.incompatibleCourses,
      props.spcodes
    )) || [true, ""];

  return (
    <td>
      {
        /**
         * The remove button is shown if we are in the studyplan table.
         *
         * please note : props.studyplan will let us know if we are either in the studyplan or in the course table !!
         */
        (props.studyplan && (
          <Button
            size="sm"
            variant="outline-danger"
            className="ms-1"
            onClick={(event) => {
              event.preventDefault();
              props.deleteCourseStudyplan(props.code);
            }}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        )) || (
          /**
           * Here we are in the course table, thus based on the result of _checkCourseToAdd
           * either the add button or the danger button with the tooltip is shown
           */
          <>
            {ok ? (
              /**
               * can this course can be added to the studyplan? well, let's choose the right button
               */
              <Button
                size="sm"
                variant="outline-success"
                className="ms-1"
                onClick={(event) => {
                  event.preventDefault();
                  props.addCourseStudyplan(props.code);
                }}
              >
                <i className="bi bi-plus"></i>
              </Button>
            ) : (
              <CourseToolTip msg={msg} />
            )}
            <Button
              size="sm"
              variant="outline-primary"
              className="ms-1"
              onClick={() => props.setExpanded((e) => !e)}
            >
              <i
                className={
                  props.expanded ? "bi bi-caret-up" : "bi bi-caret-down"
                }
              ></i>
            </Button>{" "}
          </>
        )
      }
    </td>
  );
}

function CourseToolTip(props) {
  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip>{props.msg}</Tooltip>}
      >
        {
          <Button className="ms-1" size="sm" variant="danger">
            <i className="bi bi-exclamation-circle"></i>
          </Button>
        }
      </OverlayTrigger>
    </>
  );
}

/**
 * This function will be called whenever a row is expanded
 *
 * @param  props.incompatibleCourses
 * @param  props.preparatoryCourse
 */
function ExpandedRow(props) {
  return (
    <tr>
      <td colSpan={6}>
        <ul className="ms-4 ">
          {
            /**
             * display incompatible courses if any
             */
            (props.incompatibleCourses.length > 0 && (
              <li>
                incompatible courses :{" "}
                {props.incompatibleCourses.map(
                  (course, index) =>
                    course +
                    (index === props.incompatibleCourses.length - 1 ? "" : ", ")
                )}
              </li>
            )) || <li>This course has not any incompatible courses</li>
          }
          {
            /**
             * display preparatory courses if present
             */
            (props.preparatoryCourse && <li>{props.preparatoryCourse}</li>) || (
              <li>This course has not any preparatory course</li>
            )
          }
        </ul>
      </td>
    </tr>
  );
}

/**
 * This component is used both in the logged-in and not logged-in pages.
 *
 * For this reason @param props.loggedIn is needed to let us know whether it is
 * needed to shown the actions column.
 *
 */
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
              addCourseStudyplan={props.addCourseStudyplan}
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
              deleteCourseStudyplan={props.deleteCourseStudyplan}
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

/**
 *
 * @param  coursecode the code of the course to be checked
 * @param  preparatoryCourse preparatory course
 * @param  incompatibleCourses array of the incompatible courses codes
 * @param  spcodes the codes of the courses alredy in the studyplan
 *
 * @returns an array of two variables : [error, message] where error is false when the course cannot be inserted in the studyplan and the relative message
 */
function _checkCourseToAdd(
  coursecode,
  preparatoryCourse,
  incompatibleCourses,
  spcodes
) {
  /**
   * SPincompatibleCourses : array of the courses codes incompatible with the given coursecode
   * which are already in the spcodes array
   */
  const SPincompatibleCourses = [];
  let msg = "";

  /**
   * if the course is already present in the studyplan it cannot be inserted again
   */
  if (spcodes.includes(coursecode))
    return [false, "course already present in studyplan"];

  /**
   * checking the presence of incompatible courses with the given course
   * which are already present in the studyplan
   */
  if (incompatibleCourses) {
    for (const c of spcodes) {
      if (incompatibleCourses.includes(c)) SPincompatibleCourses.push(c);
    }
  }

  /**
   * here the message is built whenever there are
   * more than zero incompatible course in the studyplan
   */
  if (SPincompatibleCourses.length > 0) {
    msg += "Incompatible courses : ";
    for (const incompatibleCourse of SPincompatibleCourses)
      msg += incompatibleCourse;
    msg += "\n";
  }

  /**
   * in case preparatory course for the given course is present
   * here it is checked its presence in the studyplan
   */
  if (preparatoryCourse && !spcodes.includes(preparatoryCourse))
    if (preparatoryCourse !== "") {
      msg += "Missing preparatory course : " + preparatoryCourse;
    }

  return [!msg.length > 0, msg];
}

export { CourseTable, StudyplanTable };
