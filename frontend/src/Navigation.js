import Navbar from "react-bootstrap/Navbar";

const Navigation = ({ account }) => {
  return (
    <Navbar className="my-3">
      <Navbar.Brand href="#">Hardhat-React Template</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>{account}</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
