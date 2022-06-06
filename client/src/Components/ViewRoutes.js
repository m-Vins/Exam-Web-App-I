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
      <Navbar searchBar logInButton />
      <Container>
        <CourseTable courses={props.courses} />
      </Container>
    </>
  );
}

function PersonalHomeRoute(props) {
  return (
    <>
      <Navbar searchBar logOutButton />
      <Container className="tableContainer">
        <CourseTable courses={props.courses} loggedIn />
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
