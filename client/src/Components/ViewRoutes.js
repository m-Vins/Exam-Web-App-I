import CourseTable from "./TableCompontens";
import Navbar from "./NavbarComponents";
import LogInForm from "./LoginFormComponents";
import { Container, Col } from "react-bootstrap";

import "../App.css";

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
      <Navbar searchBar />
      <CourseTable courses={props.courses} />
    </>
  );
}

function PersonalHomeRoute(props) {
  return (
    <>
      <Navbar searchBar loginButton />
      <Container className="tableContainer">
        <CourseTable courses={props.courses} />
      </Container>
    </>
  );
}

function LoginRoute() {
  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <Col md={{ span: 4, offset: 4 }}>
          <LogInForm />
        </Col>
      </Container>
    </>
  );
}

export { HomeRoute, DefaultRoute, LoginRoute, PersonalHomeRoute };
