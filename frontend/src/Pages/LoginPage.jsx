import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import background from '../assets/background_08.jpg';
import { useAuth } from '../Context/AuthContext'; 
import { login as apiLogin } from '../services/api'; // Import your real API login function

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // ✅ Use real API call instead of fake authentication
        const response = await apiLogin({
          email: formData.email,
          password: formData.password
        });

        // Extract user data from API response
        const userData = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          createdDate: response.data.createdAt
        };

        const token = response.data.token;
        
        // Update auth context with real user and token
        login(userData, token);
        
        // Navigate based on user role
        if (response.data.role === 'ADMIN' || response.data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      } catch (error) {
        console.error('Login error:', error);
        
        // Handle different types of errors
        if (error.response && error.response.status === 401) {
          setErrors({ general: 'Invalid email or password' });
        } else if (error.response && error.response.data && error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: 'Login failed. Please try again.' });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Login</h2>
                  <p className="text-muted">Welcome back to SkillBloom</p>
                </div>
                {errors.general && (
                  <div className="alert alert-danger mb-4">
                    {errors.general}
                  </div>
                )}
                <Form onSubmit={handleSubmit}>
                  {/* Email */}
                  <Form.Group className="mb-3" controlId="email">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  {/* Password */}
                  <Form.Group className="mb-4" controlId="password">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check 
                      type="checkbox" 
                      id="remember-me" 
                      label="Remember me" 
                    />
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                  {/* Login Button */}
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="w-100 mb-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging In...' : 'LOGIN'}
                  </Button>
                  {/* Divider */}
                  <div className="text-center mb-4">
                    <span className="text-muted">Or continue with</span>
                  </div>
                  {/* Social Login */}
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <Button variant="outline-secondary" className="rounded-circle" size="lg">
                      <FaGoogle />
                    </Button>
                    <Button variant="outline-secondary" className="rounded-circle" size="lg">
                      <FaFacebookF />
                    </Button>
                    <Button variant="outline-secondary" className="rounded-circle" size="lg">
                      <FaApple />
                    </Button>
                  </div>
                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-decoration-none fw-bold">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Custom CSS to match Figma design */}
      <style >{`
       .login-page {
          /* Image background */
          background-image: url(${background});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
        }
        
        /* Add an overlay to make text more readable */
        .login-page::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
          z-index: -1;
        }
        
        /* Make the container background semi-transparent */
        .container {
          position: relative;
          z-index: 1;
        }
        
        .card {
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
        }
        
        .input-group-text {
          background-color: rgba(255, 255, 255, 0.8);
          border-right: none;
          color: #495057;
        }
        
        .form-control {
          border-left: none;
          padding: 12px 15px;
          background-color: rgba(255, 255, 255, 0.8);
        }
        
        .form-control:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .form-control::placeholder {
          color: #6c757d;
        }
        
        .form-control.is-invalid {
          border-left: none;
        }
        
        .input-group .form-control.is-invalid {
          z-index: 2;
        }
        
        .btn-primary {
          background-color: #0d6efd;
          border-color: #0d6efd;
          padding: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        .btn-primary:hover {
          background-color: #0b5ed7;
          border-color: #0a58ca;
        }
        
        .btn-outline-light {
          border-color: rgba(255, 255, 255, 0.5);
          color: white;
        }
        
        .btn-outline-light:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: white;
          color: white;
        }
        
        .btn-outline-light:focus {
          box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
        }
        
        .btn-lg {
          width: 50px;
          height: 50px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .form-check-input:checked {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
        
        .alert-danger {
          background-color: rgba(220, 53, 69, 0.9);
          border: none;
          color: white;
        }
        
        @media (max-width: 768px) {
          .card-body {
            padding: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;