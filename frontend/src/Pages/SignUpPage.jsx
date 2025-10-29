import React, { useState } from "react";
import { Form, Button, Alert, Card, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import background from '../assets/background_06.jpg';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { register } from '../services/api'; // Import the register function from your API service

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {

        const { confirmPassword, ...signupData } = formData;
  
        const response = await register(signupData);
        
 
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
   
        alert('Account created successfully! Please login.');
      
        navigate("/login");
      } catch (error) {
        console.error("Signup error:", error);
        
 
        if (error.response) {
     
          if (error.response.status === 400) {
            setErrors({ general: error.response.data.message || "Email already exists" });
          } else {
            setErrors({ general: "Server error. Please try again later." });
          }
        } else if (error.request) {

          setErrors({ general: "Network error. Please check your connection." });
        } else {
 
          setErrors({ general: "An unexpected error occurred." });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="signup-page min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Create An Account</h2>
                  <p className="text-muted">Join SkillBloom and start learning today</p>
                </div>
                
                {errors.general && (
                  <Alert variant="danger" className="mb-4">
                    {errors.general}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
              
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>
                      <FaUser className="me-2" />
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
               
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>
                      <FaEnvelope className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
           
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create a password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label>
                      <FaLock className="me-2" />
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm your password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
            
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="w-100 mb-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </Button>
                  
                  <div className="text-center mb-4">
                    <span className="text-muted">Or signup with</span>
                  </div>
                  
                 
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
                  
                  
                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{" "}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        Log In
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style >{`
        .signup-page {
          /* Option 3: Image background */
          background-image: url(${background});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
        }
        
        /* Add an overlay to make text more readable */
        .signup-page::before {
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
        
        .form-label {
          font-weight: 500;
          color: #495057;
        }
        
        .form-control:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .btn-primary {
          background-color: #0d6efd;
          border-color: #0d6efd;
          padding: 10px;
          font-weight: 500;
        }
        
        .btn-primary:hover {
          background-color: #0b5ed7;
          border-color: #0a58ca;
        }
        
        .btn-outline-secondary {
          border-color: rgba(255, 255, 255, 0.5);
          color: white;
        }
        
        .btn-outline-secondary:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: white;
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

export default SignupPage;