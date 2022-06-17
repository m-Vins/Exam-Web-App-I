import { CourseTable } from "./TableCompontens";
import Navbar from "./NavbarComponents";
import LogInForm from "./LoginFormComponents";
import { Container, Col } from "react-bootstrap";
import { PersonalHome } from "./PersonalHomeComponents";

import "../App.css";

function DefaultRoute() {
  return (
    <>
      <Navbar logInButton />
      <Container>
        <h1>Nothing here...</h1>
      </Container>
    </>
  );
}

function HomeRoute(props) {
  return (
    <>
      <Navbar logInButton />
      <Container>
        <CourseTable courses={props.courses} />
      </Container>
    </>
  );
}

function PersonalHomeRoute(props) {
  return (
    <PersonalHome
      courses={props.courses}
      getCourses={props.getCourses}
      handleLogOut={props.handleLogOut}
    />
  );
}

function LoginRoute(props) {
  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <Col md={{ span: 4, offset: 4 }}>
          <LogInForm handleLogIn={props.handleLogIn} />
        </Col>
      </Container>
    </>
  );
}

export { HomeRoute, DefaultRoute, LoginRoute, PersonalHomeRoute };
