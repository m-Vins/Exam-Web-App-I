import {
  Navbar,
  Col,
  Container,
  Button,
  DropdownButton,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";

function NavbarComponent(props) {
  const navigate = useNavigate();
  return (
    <Navbar sticky="top" bg="light" expand="lg" className="mb-2 navbar">
      <Container fluid>
        <Col className="d-flex justify-content-start">
          <Navbar.Brand
            href="#"
            onClick={(event) => {
              event.preventDefault();
              navigate("/");
            }}
          >
            University Courses
          </Navbar.Brand>
          {props.loading && <Spinner animation="grow" />}
        </Col>

        <Col className="d-flex justify-content-end">
          {props.edit && (
            <>
              <Button
                className="me-2"
                variant="success"
                onClick={(event) => {
                  event.preventDefault();
                  props.saveStudyplan();
                }}
              >
                Save
              </Button>
              <Button
                className="me-2"
                variant="warning"
                onClick={(event) => {
                  event.preventDefault();
                  props.resetStudyplan();
                }}
              >
                Back
              </Button>
              <Button
                className="me-5"
                variant="danger"
                onClick={(event) => {
                  event.preventDefault();
                  props.deleteStudyplan();
                  props.setEdit(false);
                }}
              >
                Delete
              </Button>
            </>
          )}
          {props.studyplanButton && props.studyplan && !props.edit && (
            <DropdownButton
              className="me-3"
              id="dropdown-item-button"
              title="Study Plan"
            >
              <Dropdown.Item
                as="button"
                onClick={(event) => {
                  event.preventDefault();
                  props.deleteStudyplan();
                }}
              >
                Delete Studyplan
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={(event) => {
                  event.preventDefault();
                  props.setEdit(true);
                }}
              >
                Edit Studyplan
              </Dropdown.Item>
            </DropdownButton>
          )}
          {props.studyplanButton && !props.studyplan && (
            <DropdownButton
              className="me-3"
              id="dropdown-item-button"
              title="Create Study Plan"
            >
              <Dropdown.Item
                as="button"
                onClick={(event) => {
                  event.preventDefault();
                  props.createStudyplan("full-time");
                  props.setEdit(true);
                }}
              >
                Full-time
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={(event) => {
                  event.preventDefault();
                  props.createStudyplan("part-time");
                  props.setEdit(true);
                }}
              >
                Part-time
              </Dropdown.Item>
            </DropdownButton>
          )}
          {(props.logInButton && (
            <Button
              className="me-2"
              variant="success"
              onClick={(event) => {
                event.preventDefault();
                navigate("/login");
              }}
            >
              Login
            </Button>
          )) ||
            (props.logOutButton && (
              <Button
                className="me-2"
                variant="danger"
                onClick={(event) => {
                  event.preventDefault();
                  props.handleLogOut();
                }}
              >
                Logout
              </Button>
            ))}
        </Col>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
