import { useState } from "react";
import { Form, Row, Button, Col, Container } from "react-bootstrap";
import "../App.css";

function LogInForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    props.handleLogIn(username, password);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username" className="mb-4">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          required={true}
        />
      </Form.Group>

      <Form.Group controlId="password" className="mb-5">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required={true}
          minLength={6}
        />
      </Form.Group>

      <Button
        variant="outline-success"
        className="mt-3 loginButton"
        type="submit"
      >
        Login
      </Button>
    </Form>
  );
}

export default LogInForm;
