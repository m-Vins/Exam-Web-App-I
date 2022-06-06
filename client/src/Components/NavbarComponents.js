import {
  Navbar,
  Col,
  Container,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";

function NavbarComponent(props) {
  return (
    <Navbar sticky="top" bg="light" expand="lg" className="mb-2">
      <Container fluid>
        <Col className="d-flex justify-content-start">
          <Navbar.Brand href="#">University Courses</Navbar.Brand>
        </Col>
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
        <Col className="d-flex justify-content-end">
          <Button className="ms-2 me-2" variant="outline-success">
            Login
          </Button>
        </Col>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
