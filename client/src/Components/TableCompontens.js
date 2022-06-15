import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Table, Button, Tooltip, OverlayTrigger } from "react-bootstrap";

function CourseRow(props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr>
        <td>{props.course.code}</td>
        <td>{props.course.name}</td>
        <td>{props.course.credits}</td>
        <td>{props.course.currentStudentsNumber}</td>
        <td>{props.course.maxStudentsNumber}</td>
        <RowActions
          edit={props.edit} //true when in editing mode
          studyplan={props.studyplan} //true when called within studyplan table
          courses={props.courses} //all courses
          spcodes={props.spcodes} //studyplan courses codes
          wasIncluded={props.wasIncluded}
          course={props.course}
          deleteCourseStudyplan={props.deleteCourseStudyplan}
          addCourseStudyplan={props.addCourseStudyplan}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </tr>
      {expanded && (
        <ExpandedRow
          incompatibleCourses={props.course.incompatibleCourses}
          preparatoryCourse={props.course.preparatoryCourse}
        />
      )}
    </>
  );
}

/**
 * @param props.studyplan just to know whether we are in the coursetable or studyplantable
 * @param props.spcodes array of the courses codes in the studyplan
 * @param props.courses arra of all the courses
 * @param props.course
 * @param props.addCourseStudyplan
 * @param props.expanded
 * @param props.setExpanded
 * @param props.wasIncluded
 */
function RowActions(props) {
  /**
   * check if the course can be added to or removed from the studyplan.
   *
   * please note: _checkCourseToAdd is called only when props.studyplan is false, this because
   * this function (RowActions) can be called both in CourseTable and StudyplanTable.
   * In the latter case, there is no need to check if the course can be added in the studyplan
   * because is already there.
   * _checkCourseToRemove instead, is called only when props.studyplan in true, in order to check
   * whether a course cannot be removed because it is the preparatory for another one which is in the studyplan.
   */
  const [ok, msg] = (props.edit &&
    (props.studyplan
      ? _checkCourseToRemove(props.course.code, props.courses, props.spcodes)
      : _checkCourseToAdd(
          props.course.code,
          props.course.preparatoryCourse,
          props.course.incompatibleCourses,
          props.spcodes,
          props.course.maxStudentsNumber,
          props.course.currentStudentsNumber,
          props.wasIncluded
        ))) || [undefined, undefined];

  return (
    <td>
      {props.edit &&
        (ok ? (
          props.studyplan ? (
            /**
             * please note : props.studyplan will let us know if we are either in the studyplan or in the course table !!
             */
            <Button
              size="sm"
              variant="danger"
              className="ms-1"
              disabled={!ok}
              onClick={(event) => {
                event.preventDefault();
                props.deleteCourseStudyplan(props.course.code);
              }}
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="success"
              className="ms-1"
              onClick={(event) => {
                event.preventDefault();
                props.addCourseStudyplan(props.course.code);
              }}
            >
              <i className="bi bi-plus"></i>
            </Button>
          )
        ) : (
          /**show the reason why the course cannot be added/removed to/from studyplan */
          <CourseToolTip msg={msg} />
        ))}
      {!props.studyplan && (
        /**expand the button only within the full courses table */
        <Button
          size="sm"
          variant="primary"
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
            (props.preparatoryCourse && (
              <li>Preparatory course : {props.preparatoryCourse}</li>
            )) || <li>This course has not any preparatory course</li>
          }
        </ul>
      </td>
    </tr>
  );
}

/**
 * This component is used both in the logged-in and not logged-in pages
 * and both for all courses table and study plan table.
 *
 * For this reason
 * @param props.loggedIn is needed to let us know whether it is needed to shown the actions column, while
 * @param props.studyplan is true when it is called to render the studyplan table
 *
 */
function CourseTable(props) {
  const coursesToShow = (
    props.studyplan
      ? props.courses.filter((course) => props.spcodes.includes(course.code))
      : props.courses
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Table size="sm" striped borderless hover>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Credits</th>
          <th>Current students number</th>
          <th>Max students number</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {coursesToShow.map((course) => {
          return (
            <CourseRow
              edit={props.edit}
              studyplan={props.studyplan} //true when in studyplan table
              courses={props.courses} //all courses
              spcodes={props.spcodes} //StudyPlan courses codes
              wasIncluded={
                props.oldspcodes && props.oldspcodes.includes(course.code)
              } //true if the course was included in the persistent studyplan
              key={course.code}
              course={course}
              deleteCourseStudyplan={props.deleteCourseStudyplan}
              addCourseStudyplan={props.addCourseStudyplan}
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
  courseCode,
  preparatoryCourse,
  incompatibleCourses,
  spcodes,
  maxStudentsNumber,
  currentStudentsNumber,
  present
) {
  /**
   * SPincompatibleCourses : array of the courses codes incompatible with the given courseCode
   * which are already in the spcodes array
   */
  const SPincompatibleCourses = [];
  let msg = "";

  /**
   * if the course is already present in the studyplan it cannot be inserted again
   */
  if (spcodes.includes(courseCode))
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
      msg += "Missing preparatory course : " + preparatoryCourse + "\n";
    }

  /**
   * in case the current student number + 1 is greater than the max students
   * number (if any) , a quick check if the course is already in the studyplan
   * of the student.
   * It is needed because in case the student already had this course, and delete it
   * temporarly from the studyplan, then during the same editing session it cannot re-insert
   * this course because the current student number is updated only when the studyplan is saved.
   *
   */

  if (
    maxStudentsNumber &&
    currentStudentsNumber + 1 > maxStudentsNumber &&
    !present
  )
    msg += "The course capacity is full";

  return [!msg.length > 0, msg];
}

/**
 * This function check whether an course in the studyplan
 * is the preparatory course of another course in the studyplan.
 *
 * @param courseCode is the code of the given course
 * @param courses is the array of all the courses
 * @param spcodes is the array of the courses codes within the studyplan
 * @returns [true,""] if the course can be removed, [false, explanation message] if the course cannot be removed.
 */
function _checkCourseToRemove(courseCode, courses, spcodes) {
  const course = spcodes
    .map((code) => courses.filter((course) => course.code === code)[0])
    .filter((course) => course.preparatoryCourse === courseCode)[0];

  return course
    ? [false, "this course is the preparatory course for : " + course.code]
    : [true, ""];
}

export { CourseTable };
