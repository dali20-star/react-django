import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Badge } from "react-bootstrap";
import api from "./utils/axiosConfig";
import Home from "./Pages/Home";
import UploadPage from "./Pages/UploadPage";
import FilesList from "./Pages/FilesList";
import EditFilePage from "./Pages/EditFilePage";
import Login from "./Pages/LoginPage";
import Register from "./Pages/RegisterPage";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom-theme.css';

// User Profile Component - BIGGER VERSION
function UserProfile({ user, onLogout }) {
  if (!user) return null;

  return (
    <NavDropdown 
      title={
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
            style={{ 
              width: '45px', 
              height: '45px', 
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
          </div>
          <div className="text-start">
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
              {user.first_name} {user.last_name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {user.email}
            </div>
          </div>
        </div>
      } 
      id="user-dropdown"
      align="end"
      className="user-profile-dropdown"
    >
      <div className="px-3 py-2 border-bottom">
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
            style={{ 
              width: '50px', 
              height: '50px', 
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {user.first_name} {user.last_name}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {user.email}
            </div>
            <Badge bg="success" className="mt-1">Online</Badge>
          </div>
        </div>
      </div>
      
      <NavDropdown.Item as={Link} to="/profile" className="py-2">
        <i className="bi bi-person me-2"></i>
        View Profile
      </NavDropdown.Item>
      
      <NavDropdown.Item as={Link} to="/settings" className="py-2">
        <i className="bi bi-gear me-2"></i>
        Settings
      </NavDropdown.Item>
      
      <NavDropdown.Divider />
      
      <NavDropdown.Item onClick={onLogout} className="py-2 text-danger">
        <i className="bi bi-box-arrow-right me-2"></i>
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
}

// Navigation Component
function Navigation() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in and fetch user data
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          // Fetch user profile
          const response = await api.get('auth/profile/');
          setUser(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Token might be expired, clear storage
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        await api.post('auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4" style={{ minHeight: '80px' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontSize: '24px', fontWeight: 'bold' }}>
          <i className="bi bi-folder-fill me-2"></i>
          KPIT File Manager
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/upload" style={{ fontSize: '16px', padding: '12px 16px' }}>
                  <i className="bi bi-cloud-upload me-2"></i>
                  Upload
                </Nav.Link>
                <Nav.Link as={Link} to="/files" style={{ fontSize: '16px', padding: '12px 16px' }}>
                  <i className="bi bi-files me-2"></i>
                  Files
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isLoggedIn ? (
              <UserProfile user={user} onLogout={handleLogout} />
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{ fontSize: '16px', padding: '12px 16px' }}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" style={{ fontSize: '16px', padding: '12px 16px' }}>
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
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
