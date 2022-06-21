import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./API";
import {
  DefaultRoute,
  HomeRoute,
  LoginRoute,
  PersonalHomeRoute,
} from "./Components/ViewRoutes";

function App() {
  /**
   * it is enough to use a loggedIn state, not any information about the user
   * are needed as they are not used.
   */
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const getCourses = async () => {
    try {
      const courses = await API.getAllCourses();
      setCourses(courses);
    } catch (err) {
      toast.error(`Server Error !`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleLogIn = async (username, password) => {
    toast.promise(
      API.logIn({ username, password }).then((student) => {
        setLoggedIn(true);
        return student.username;
      }),
      {
        pending: "Logging in",
        success: {
          render({ data }) {
            return `Welcome ${data} !`;
          },
        },
        error: "Wrong Credentials !",
      }
    );
  };

  const handleLogOut = async () => {
    toast.promise(
      API.logOut().then(() => {
        setLoggedIn(false);
      }),
      {
        pending: "Logging out",
        success: "Succesfully logged out",
        error: "Server Error !",
      }
    );
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getUserInfo();
        setLoggedIn(true);
      } catch (e) {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <Container fluid>
      <ToastContainer
        transition={Bounce}
        autoClose={1500}
        position={toast.POSITION.TOP_CENTER}
      />
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              loggedIn ? (
                <PersonalHomeRoute
                  courses={courses}
                  getCourses={getCourses}
                  handleLogOut={handleLogOut}
                />
              ) : (
                <HomeRoute courses={courses} />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate replace to="/" />
              ) : (
                <LoginRoute handleLogIn={handleLogIn} />
              )
            }
          />
          <Route path="*" element={<DefaultRoute />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
