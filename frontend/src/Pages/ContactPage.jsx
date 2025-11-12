import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div
  style={{
background: "linear-gradient(135deg, #3a86ff, #6fb1fc, #a0d8ff)",
    minHeight: "100vh",
    paddingTop: "60px",
    paddingBottom: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
      <Container>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "40px 30px",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ color: "#0d3b66", fontWeight: "600", fontSize: "2rem" }}
          >
            Contact Us
          </h2>

          {status === "success" && (
            <Alert variant="success" onClose={() => setStatus(null)} dismissible>
              Your message was sent successfully!
            </Alert>
          )}
          {status === "error" && (
            <Alert variant="danger" onClose={() => setStatus(null)} dismissible>
              Something went wrong. Please try again.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label style={{ fontWeight: "500" }}>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  borderColor: "#0d3b66",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label style={{ fontWeight: "500" }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  borderColor: "#0d3b66",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="message">
              <Form.Label style={{ fontWeight: "500" }}>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message"
                required
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  borderColor: "#0d3b66",
                }}
              />
            </Form.Group>

            <div className="text-center">
              <Button
                type="submit"
                style={{
                  background: "linear-gradient(90deg, #0d3b66, #1e6091)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 35px",
                  fontWeight: "500",
                  fontSize: "1rem",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.opacity = "0.85")}
                onMouseOut={(e) => (e.target.style.opacity = "1")}
              >
                Send Message
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default ContactPage;
