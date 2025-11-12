import React from 'react';
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import herosection from '../assets/hero.jpg';
import aboutsection from '../assets/team.jpeg.png';
import axios from "axios";

function HomePage() {

  const [featuredWorkshops, setFeaturedWorkshops] = useState([]);  // here we have used an empty array because we expect mulitple featured workshops from the backend api.
  const [selectedCategory, setSelectedCategory] = useState(null);  // at the beginning no category is chosen.so it begin as null.
  const [workshops, setWorkshops] = useState([]); // state variable that will hold a list of workshops.


useEffect(() => {
  axios.get("http://localhost:5000/api/workshops/featured")  // Makes an get HTTP request to backend end point.
    .then((response) => {
      if (response.data.success) {   // if the response success is true 
        setFeaturedWorkshops(response.data.data); // response is the entire response from the server
      }
    })
    .catch((err) => console.error("Error fetching featured workshops:", err));  // if not success it will show the error message
}, []);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
       let url = "http://localhost:5000/api/workshops"; 
        if (selectedCategory) {
          url = `http://localhost:5000/api/workshops/category/${selectedCategory}`;
        }
        const res = await axios.get(url);
        setWorkshops(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      }
    };
    fetchWorkshops();
  }, [selectedCategory]);


  const categories = [
    { name: "Technology", icon: "💻", slug: "Technology" },  // array of objects
    { name: "Business", icon: "💼", slug: "Business" },
    { name: "Design", icon: "🎨", slug: "Design" },
    { name: "Marketing", icon: "📈", slug: "Marketing" }
  ];

  return (
    <div className="homepage">
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold">GROW YOUR SKILLS UNLOCK YOUR FUTURE</h1>
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
              <img 
                src={herosection}
                alt="Workshop illustration" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>

   <Container className="my-5">
      <h2 className="text-center mb-5">Featured Workshops</h2>
      <Row xs={1} md={3} className="g-4">
        {featuredWorkshops.map((workshop) => (
          <Col key={workshop._id}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={`http://localhost:5000/uploads/${workshop.image}`}
                alt={workshop.title}
              />
              <Card.Body>
                <Card.Title>{workshop.title}</Card.Title>
                <Card.Text>{workshop.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">By {workshop.instructor}</span>
                  <span className="badge bg-primary">{workshop.duration || "N/A"}</span>
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

     <Container fluid style={{ backgroundColor: '#e8eff6ff' }}className=" py-5 my-5">
        <Container>
          <h2 className="text-center mb-5">Explore Categories</h2>
          <Row xs={2} md={2} lg={4} className="g-4">
            {categories.map((category, index) => (
              <Col key={index}>
                <div  onClick={() => setSelectedCategory(category.slug)} className="text-decoration-none" style={{ cursor: "pointer" }}> 
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

      {selectedCategory && (
        <Container className="my-5">
          <h2 className="text-center mb-4">
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Workshops
          </h2>
          <Row xs={1} md={3} className="g-4">
            {workshops.length > 0 ? (
              workshops.map((workshop) => (
                <Col key={workshop._id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5000/uploads/${workshop.image}`}
                      alt={workshop.title}
                    />
                    <Card.Body>
                      <Card.Title>{workshop.title}</Card.Title>
                      <Card.Text>{workshop.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">By {workshop.instructor}</span>
                        <span className="badge bg-primary">{workshop.duration || "N/A"}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">${workshop.price}</span>
                        <Button as={Link} to={"/login"} variant="primary">
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center">No workshops found in this category.</p>
            )}
          </Row>
        </Container>
      )}
    

      {/* About Section */}
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img 
              src={aboutsection}
              alt="About us" 
              className="img-fluid rounded shadow"
            />
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

      {/* Testimonials Section */}
      <Container fluid className="bg-primary text-white py-5 my-5">
        <Container>
          <h2 className="text-center mb-5">What Our Students Say</h2>
          <Row xs={1} md={3} className="g-4">
            <Col>
              <Card className="bg-white text-dark h-100">
                <Card.Body>
                  <Card.Text>
                    "The web development workshop was exactly what I needed to start my career. 
                    The instructor was knowledgeable and the projects were practical."
                  </Card.Text>
                  <footer className="blockquote-footer mt-3">
                    <strong>Michael Chen</strong> - Web Developer
                  </footer>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="bg-white text-dark h-100">
                <Card.Body>
                  <Card.Text>
                    "I learned more in 6 weeks of the UI/UX workshop than in a semester of college. 
                    The hands-on approach made all the difference."
                  </Card.Text>
                  <footer className="blockquote-footer mt-3">
                    <strong>Emily Rodriguez</strong> - UI Designer
                  </footer>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="bg-white text-dark h-100">
                <Card.Body>
                  <Card.Text>
                    "The digital marketing strategies I learned helped me double my business revenue 
                    in just 3 months. Highly recommended!"
                  </Card.Text>
                  <footer className="blockquote-footer mt-3">
                    <strong>David Kim</strong> - Business Owner
                  </footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* CTA Section */}
      <Container className="my-5 text-center">
        <h2 className="mb-4">Ready to Start Learning?</h2>
        <p className="lead mb-4">
          Join thousands of students advancing their careers with our workshops
        </p>
        <Button as={Link} to="/signup" variant="primary" size="lg" className="px-5">
          Sign Up Now
        </Button>
      </Container>
    </div>
  );
}

export default HomePage;