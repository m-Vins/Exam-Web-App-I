import { Table } from "react-bootstrap";

function CourseRow(props) {
  return (
    <tr>
      <td>{props.code}</td>
      <td>{props.name}</td>
      <td>{props.credits}</td>
      <td>{props.currentStudentsNumber}</td>
      <td>{props.maxStudentsNumber}</td>
    </tr>
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
        </tr>
      </thead>

      <tbody>
        {props.courses.map((course) => {
          return (
            <CourseRow
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
