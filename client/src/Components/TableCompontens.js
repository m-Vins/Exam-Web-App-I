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
        {props.loggedIn && (props.edit || !props.studyplan) && (
          <RowActions
            edit={props.edit} //true when in editing mode
            studyplan={props.studyplan} //true when called within studyplan table
            courses={props.courses} //all courses
            code={props.code} //code of this course
            spcodes={props.spcodes} //studyplan courses codes
            incompatibleCourses={props.incompatibleCourses}
            preparatoryCourse={props.preparatoryCourse}
            deleteCourseStudyplan={props.deleteCourseStudyplan}
            addCourseStudyplan={props.addCourseStudyplan}
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
 * @param props.courses arra of all the courses
 * @param props.code code of the given course
 * @param props.preparatoryCourse
 * @param props.incompatibleCourses
 * @param props.deleteCourseStudyplan
 * @param props.addCourseStudyplan
 * @param props.expanded
 * @param props.setExpanded
 * @returns
 */
function RowActions(props) {
  /**
   * check if the course can be added to or removed from the studyplan.
   *
   * please note: _checkCourseToAdd is called only when props.studyplan is false, this because
   * this function (RowActions) can be called both in CourseTable and StudyplanTable.
   * In the latter case, there is no need to check if the course can be added in the studyplan
   * because is already there, thus it is assigned [true, ""] to [ok, msg] which anyway in this case
   * wont be used.
   * _checkCourseToRemove instead, is called only when props.studyplan in true, in order to check
   * whether a course cannot be removed because it is preparatory for another one which is in the studyplan.
   */
  const [ok, msg] = (props.studyplan &&
    props.edit &&
    _checkCourseToRemove(props.code, props.courses, props.spcodes)) ||
    _checkCourseToAdd(
      props.code,
      props.preparatoryCourse,
      props.incompatibleCourses,
      props.spcodes
    ) || [undefined, undefined];

  return (
    <td>
      {props.edit &&
        /**
         * can this course be removed from or added to the studyplan? well, let's choose the right button.
         */
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
                props.deleteCourseStudyplan(props.code);
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
                props.addCourseStudyplan(props.code);
              }}
            >
              <i className="bi bi-plus"></i>
            </Button>
          )
        ) : (
          <CourseToolTip msg={msg} />
        ))}
      {!props.studyplan && (
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
 * This component is used both in the logged-in and not logged-in pages
 * and both for all courses table and study plan table.
 *
 * For this reason
 * @param props.loggedIn is needed to let us know whether it is needed to shown the actions column, while
 * @param props.studyplan is true when it is called to render the studyplan table
 *
 */
function CourseTable(props) {
  const coursesToShow = props.studyplan
    ? props.courses.filter((course) => props.spcodes.includes(course.code))
    : props.courses;

  return (
    <Table scrolly="true" size={props.loggedIn && "sm"} striped bordered hover>
      <thead>
        <tr>
          <th>code</th>
          <th>name</th>
          <th>credits</th>
          <th>current students number</th>
          <th>max students number</th>
          {
            /**
             * Add another row for the action when logged in
             */
            props.loggedIn && (props.edit || !props.studyplan) && <th></th>
          }
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
              loggedIn={props.loggedIn}
              key={course.code}
              code={course.code}
              name={course.name}
              credits={course.credits}
              preparatoryCourse={course.preparatoryCourse}
              maxStudentsNumber={course.maxStudentsNumber}
              incompatibleCourses={course.incompatibleCourses}
              currentStudentsNumber={course.currentStudentsNumber}
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
  spcodes
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
      msg += "Missing preparatory course : " + preparatoryCourse;
    }

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
