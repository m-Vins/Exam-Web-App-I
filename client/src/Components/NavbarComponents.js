import {
  Navbar,
  Col,
  Container,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";

function NavbarComponent(props) {
  const navigate = useNavigate();
  return (
    <Navbar sticky="top" bg="light" expand="lg" className="mb-2 navbar">
      <Container fluid>
        <Col className="d-flex justify-content-start">
          <Navbar.Brand href="#">University Courses</Navbar.Brand>
        </Col>
        {props.searchBar && (
          <Col>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-primary">Search</Button>
            </Form>
          </Col>
        )}
        {(props.logInButton && (
          <Col className="d-flex justify-content-end">
            <Button
              className="ms-2 me-2"
              variant="outline-success"
              onClick={(event) => {
                event.preventDefault();
                navigate("/login");
              }}
            >
              Login
            </Button>
          </Col>
        )) ||
          (props.logOutButton && (
            <Col className="d-flex justify-content-end">
              <Button
                className="ms-2 me-2"
                variant="outline-danger"
                onClick={(event) => {
                  event.preventDefault();
                  props.handleLogOut();
                }}
              >
                Logout
              </Button>
            </Col>
          ))}
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
