import React, { useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Add useEffect to redirect if user is null (not logged in)
  useEffect(() => {
    if (!user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    // Call logout function
    logout();
    // Navigate to home page after logout
    navigate('/home');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // If user is null, don't render the profile content
  if (!user) {
    return (
      <div className="profile-page py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow-sm">
                <Card.Body className="p-4 text-center">
                  <p>Redirecting to home page...</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="profile-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="profile-avatar">
                      <FaUser size={80} className="text-primary" />
                    </div>
                  </div>
                  <h2 className="fw-bold">My Profile</h2>
                  <p className="text-muted">Manage your account information</p>
                </div>
                <Row className="mb-4">
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Name:</strong> {user.name}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Email:</strong> {user.email}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Role:</strong> {user.role}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Member Since:</strong> {formatDate(user.createdAt || user.createdDate || user.joinedDate)}
                    </p>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="outline-primary">
                    <FaEdit className="me-2" />
                    Edit Profile
                  </Button>
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <style >{`
        .profile-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        
        .card {
          border-radius: 10px;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;