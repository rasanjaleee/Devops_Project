import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { 
  FaUserCircle, FaChevronDown, FaGraduationCap, FaCog, 
  FaSignOutAlt, FaUser, FaBookOpen, FaTachometerAlt, FaTools 
} from 'react-icons/fa';

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/home';
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      <BootstrapNavbar expand="lg" className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}fixed="top">

        <Container>

          <BootstrapNavbar.Brand as={Link} to="/home" className="navbar-brand-custom">
            <FaGraduationCap size={28} />
                SkillBloom
          </BootstrapNavbar.Brand>
          
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler-custom"/>
          <BootstrapNavbar.Collapse id="basic-navbar-nav">

            <Nav className="me-auto">

              <Nav.Link as={Link} to="/home" className={`nav-link-custom ${isActiveLink('/home') ? 'active' : ''}`}>
                Home
              </Nav.Link>

              <Nav.Link as={Link} to="/about" className={`nav-link-custom ${isActiveLink('/about') ? 'active' : ''}`}>
                About
              </Nav.Link>

              <Nav.Link as={Link} to="/workshops" className={`nav-link-custom ${isActiveLink('/courses') ? 'active' : ''}`}>
                Workshops
              </Nav.Link>

             {isAdmin && (
              <Nav.Link as={Link} to="/admin/dashboard" className="d-flex align-items-center">
                <FaTachometerAlt className="me-1" />
                  Admin Dashboard
              </Nav.Link>
              )}
            </Nav>
            <Nav>
              {!user ? (
                <>
                  <Nav.Link as={Link} to="/signup" className="btn-signup">
                    Sign Up
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login" className="btn-login">
                    Login
                  </Nav.Link>
                </>
              ) : (
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle size={20} />}
                      </div>
                      <span className="d-none d-md-inline">{user.name}</span>
                      <FaChevronDown size={12} className="ms-1" />
                    </span>
                  }
                  id="profile-nav-dropdown"
                  align="end"
                  className="dropdown-custom"
                >
                  <div className="dropdown-menu-custom">
                    <NavDropdown.Item 
                      as={Link} 
                      to="/profile"
                      className="dropdown-item-custom"
                    >
                      <FaUser />
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/my-workshops"
                      className="dropdown-item-custom"
                    >
                      <FaUser />
                      My Workshops
                    </NavDropdown.Item>
                    
                    <NavDropdown.Item 
                      as={Link} 
                      to="/settings"
                      className="dropdown-item-custom"
                    >
                      <FaCog />
                      Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item 
                      onClick={handleLogout}
                      className="dropdown-item-custom"
                    >
                      <FaSignOutAlt />
                      Logout
                    </NavDropdown.Item>
                  </div>
                </NavDropdown>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Spacer */}
      <div style={{ height: '80px' }}></div>


      <style>{`
        .navbar-custom {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .navbar-scrolled {
          background: #ffffff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .navbar-brand-custom {
          font-weight: 700;
          font-size: 1.8rem;
          color: #1f2937 !important;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .navbar-brand-custom:hover {
          color: #7c3aed !important;
          transform: scale(1.02);
        }

        .navbar-brand-custom svg {
          color: #7c3aed;
        }

        .nav-link-custom {
          color: #374151 !important;
          margin: 0 4px;
          padding: 8px 16px !important;
          border-radius: 4px;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .nav-link-custom:hover {
          background: #f3f4f6;
          color: #1f2937 !important;
        }

        .nav-link-custom.active {
          color: #7c3aed !important;
          font-weight: 600;
        }

        .btn-signup {
          background: transparent !important;
          border: 1px solid #d1d5db !important;
          color: #374151 !important;
          border-radius: 4px;
          padding: 8px 16px;
          font-weight: 600;
          margin-right: 8px;
          transition: all 0.2s ease;
        }

        .btn-signup:hover {
          background: #f9fafb !important;
          border-color: #9ca3af !important;
          color: #1f2937 !important;
        }

        .btn-login {
          background: #7c3aed !important;
          border: none !important;
          color: #ffffff !important;
          border-radius: 4px;
          padding: 8px 16px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-login:hover {
          background: #6d28d9 !important;
          color: #ffffff !important;
        }

        .dropdown-custom .dropdown-toggle {
          background: transparent;
          border-radius: 4px;
          padding: 8px 12px;
          color: #374151 !important;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .dropdown-custom .dropdown-toggle:hover {
          background: #f3f4f6;
          color: #1f2937 !important;
        }

        .dropdown-custom .dropdown-toggle::after { 
          display: none; 
        }

        .dropdown-menu-custom {
          background: #ffffff;
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
          margin-top: 8px;
        }

        .dropdown-item-custom {
          color: #374151 !important;
          padding: 10px 12px;
          border-radius: 4px;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.15s ease;
        }

        .dropdown-item-custom:hover {
          background: #f3f4f6;
          color: #1f2937 !important;
        }

        .dropdown-item-custom svg {
          color: #6b7280;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          margin-right: 8px;
          font-size: 14px;
        }

        .navbar-toggler-custom {
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 6px 10px;
          color: #374151;
        }

        .navbar-toggler-custom:focus {
          box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25);
        }

        .navbar-toggler-custom .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2855, 65, 81, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        @media (max-width: 991.98px) {
          .navbar-nav {
            background: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            border: 1px solid #e5e7eb;
          }
          
          .nav-link-custom { 
            margin: 2px 0; 
          }
          
          .btn-signup, .btn-login {
            text-align: center;
            margin: 4px 0;
            width: 100%;
          }
        }

        /* Clean typography */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </>
  );
}

export default Navbar;