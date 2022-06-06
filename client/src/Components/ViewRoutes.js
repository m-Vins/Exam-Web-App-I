import CourseTable from "./TableCompontens";
import Navbar from "./NavbarComponents";

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
      <Navbar />
      <CourseTable courses={props.courses} />
    </>
  );
}

function LoginRoute() {}

export { HomeRoute, DefaultRoute, LoginRoute };
