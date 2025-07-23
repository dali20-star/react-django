import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import Home from "./Pages/Home";
import UploadPage from "./Pages/UploadPage";
import FilesList from "./Pages/FilesList";
import EditFilePage from "./Pages/EditFilePage";
import Login from "./Pages/LoginPage";
import Register from "./Pages/RegisterPage";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom-theme.css'; // ton thème ici

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">KPIT File Manager</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/upload">Upload</Nav.Link>
            <Nav.Link as={Link} to="/files">Files</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/files" element={<FilesList />} />
          <Route path="/edit/:id" element={<EditFilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>

      <Footer />
    </Router>
  );
}

export default App;
