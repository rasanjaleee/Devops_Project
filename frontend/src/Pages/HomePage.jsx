import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import herosection from "../assets/hero.jpg";
import aboutsection from "../assets/team.jpeg.png";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Static featured workshops
  const featuredWorkshops = [
    {
      _id: 1,
      title: "React for Beginners",
      description: "Learn React.js from scratch.",
      instructor: "John Doe",
      duration: "4 weeks",
      price: 99,
      //image: "react-workshop.jpg",
    },
    {
      _id: 2,
      title: "Digital Marketing 101",
      description: "Master the basics of digital marketing.",
      instructor: "Jane Smith",
      duration: "3 weeks",
      price: 79,
      //image: "marketing-workshop.jpg",
    },
    {
      _id: 3,
      title: "UI/UX Design Bootcamp",
      description: "Design user-friendly interfaces.",
      instructor: "Emily Lee",
      duration: "6 weeks",
      price: 120,
      //image: "design-workshop.jpg",
    },
  ];

  // Static categories
  const categories = [
    { name: "Technology", icon: "💻", slug: "Technology" },
    { name: "Business", icon: "💼", slug: "Business" },
    { name: "Design", icon: "🎨", slug: "Design" },
    { name: "Marketing", icon: "📈", slug: "Marketing" },
  ];

  // Filtered workshops based on selected category (optional)
  const workshops = selectedCategory
    ? featuredWorkshops.filter((w) =>
        w.title.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : [];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold">
                GROW YOUR SKILLS UNLOCK YOUR FUTURE
              </h1>
              <p className="lead my-4">
                Join thousands of learners in our interactive online workshops.
                Learn from industry experts and advance your career today.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/signup" variant="light" size="lg" className="px-4">
                  Get Started
                </Button>
                <Button as={Link} to="/workshops" variant="outline-light" size="lg" className="px-4">
                  Browse Workshops
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <img src={herosection} alt="Workshop illustration" className="img-fluid rounded shadow" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Workshops */}
      <Container className="my-5">
        <h2 className="text-center mb-5">Featured Workshops</h2>
        <Row xs={1} md={3} className="g-4">
          {featuredWorkshops.map((workshop) => (
            <Col key={workshop._id}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={workshop.image} alt={workshop.title} />
                <Card.Body>
                  <Card.Title>{workshop.title}</Card.Title>
                  <Card.Text>{workshop.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">By {workshop.instructor}</span>
                    <span className="badge bg-primary">{workshop.duration}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">${workshop.price}</span>
                    <Button as={Link} to={"/login"} variant="primary">
                      Enroll Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button as={Link} to="/workshops" variant="outline-primary" size="lg">
            View All Workshops
          </Button>
        </div>
      </Container>

      {/* Categories Section */}
      <Container fluid style={{ backgroundColor: '#e8eff6ff' }} className="py-5 my-5">
        <Container>
          <h2 className="text-center mb-5">Explore Categories</h2>
          <Row xs={2} md={2} lg={4} className="g-4">
            {categories.map((category, index) => (
              <Col key={index}>
                <div
                  onClick={() => setSelectedCategory(category.slug)}
                  style={{ cursor: "pointer" }}
                >
                  <Card className="text-center h-100 border-0 bg-white shadow-sm hover-card">
                    <Card.Body className="py-4">
                      <div className="display-4 mb-3">{category.icon}</div>
                      <Card.Title className="text-dark">{category.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </Container>

      {/* About Section */}
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img src={aboutsection} alt="About us" className="img-fluid rounded shadow" />
          </Col>
          <Col md={6}>
            <h2 className="mb-4">About SkillBloom</h2>
            <p className="lead">
              We're dedicated to providing high-quality, accessible education for everyone. 
              Our platform connects learners with industry experts through interactive workshops.
            </p>
            <p>
              Founded in 2023, SkillBloom has helped over 10,000 students advance their careers 
              through practical, hands-on learning experiences.
            </p>
            <Button as={Link} to="/about" variant="primary" size="lg">
              Learn More About Us
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
