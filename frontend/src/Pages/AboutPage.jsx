import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaUsers, FaAward, FaLightbulb, FaChartLine, FaHandshake } from 'react-icons/fa';
import Carousel from 'react-bootstrap/Carousel';
import instructor_01 from '../assets/instructor_girl.avif';
import instructor_02 from '../assets/instructor_02.jpeg';
import instructor_03 from '../assets/instructor_03.jpeg';
import instructor_04 from '../assets/instructor_04.jpeg';
import teamImage from '../assets/team.jpeg.png';
import hero_03 from '../assets/hero_03.jpg';
import hero_05 from '../assets/hero_05.jpg';
import hero_02 from '../assets/hero_02.jpg';

function AboutPage() {
  const [index, setIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Team members data
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Education enthusiast with 15+ years in e-learning",
      image: instructor_01,
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Michael Chen",
      role: "Head of Curriculum",
      bio: "Tech industry veteran and learning experience designer",
      image: instructor_02,
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Emily Rodriguez",
      role: "Community Manager",
      bio: "Building bridges between learners and instructors",
      image: instructor_03,
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "David Kim",
      role: "Technical Director",
      bio: "Full-stack developer and platform architect",
      image: instructor_04,
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];
  
  // Values data
  const values = [
    {
      icon: <FaGraduationCap className="text-primary fs-1 mb-3" />,
      title: "Quality Education",
      description: "We partner with industry experts to deliver high-quality, practical learning experiences."
    },
    {
      icon: <FaUsers className="text-primary fs-1 mb-3" />,
      title: "Community Focused",
      description: "Building a supportive community where learners can grow together."
    },
    {
      icon: <FaAward className="text-primary fs-1 mb-3" />,
      title: "Excellence",
      description: "Committed to maintaining the highest standards in all our workshops."
    },
    {
      icon: <FaLightbulb className="text-primary fs-1 mb-3" />,
      title: "Innovation",
      description: "Continuously improving our platform and teaching methodologies."
    },
    {
      icon: <FaChartLine className="text-primary fs-1 mb-3" />,
      title: "Growth",
      description: "Helping learners advance their careers and achieve their goals."
    },
    {
      icon: <FaHandshake className="text-primary fs-1 mb-3" />,
      title: "Integrity",
      description: "Operating with transparency and honesty in all we do."
    }
  ];
  
  const heroData = [
    {
      id: 1,
      title: "Learn Anytime, Anywhere",
      image: hero_03, 
      description: "Access top-quality workshops and training programs from the comfort of your home."
    },
    {
      id: 2,
      title: "Expert Instructors",
      image: hero_05, 
      description: "Learn from industry leaders who bring real-world experience to every lesson."
    },
    {
      id: 3,
      title: "Join Our Global Community",
      image: hero_02, 
      description: "Collaborate, network, and grow with thousands of learners worldwide."
    }
  ];
  
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="about-page">
      {/* Hero Section with Carousel */}
      <section id="home" className={`hero-block ${isScrolled ? 'scrolled' : ''}`}>
        <Carousel activeIndex={index} onSelect={handleSelect} fade interval={5000}>
          {heroData.map(hero => (
            <Carousel.Item key={hero.id}>
              <div className="carousel-image-wrapper">
                <img 
                  className='d-block w-100'
                  src={hero.image}
                  alt={`slide ${hero.id}`}
                />
                <div className="carousel-overlay"></div>
              </div>
              <Carousel.Caption>
                <div className="caption-content">
                  <h3 className="animate__animated animate__fadeInDown">{hero.title}</h3>
                  <p className="animate__animated animate__fadeInUp">{hero.description}</p>
                  <div className="d-flex justify-content-center gap-3 animate__animated animate__fadeInUp animate__delay-1s">
                    <Button 
                      as={Link} 
                      to="/workshops" 
                      variant="primary" 
                      size="lg"
                      className="px-4"
                    >
                      Explore Workshops
                    </Button>
                    <Button 
                      as={Link} 
                      to="/signup" 
                      variant="outline-light" 
                      size="lg"
                      className="px-4"
                    >
                      Sign Up Free
                    </Button>
                  </div>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>
      
      {/* Mission Section */}
      <Container className="mission-section my-5 py-5">
        <Row className="align-items-center">
          <Col md={6} className="mission-image">
            <div className="image-container">
              <img 
                src={teamImage}
                alt="Our mission" 
                className="img-fluid rounded shadow"
              />
              <div className="image-overlay"></div>
            </div>
          </Col>
          <Col md={6} className="mission-content">
            <div className="section-header">
              <h2 className="mb-4">Our Mission</h2>
              <div className="divider"></div>
            </div>
            <p className="lead">
              To democratize education by providing affordable, high-quality learning opportunities 
              that empower individuals to advance their careers and achieve their full potential.
            </p>
            <p>
              Our platform is designed to make learning engaging, practical, and relevant to 
              today's job market. We focus on skills that employers are looking for, ensuring 
              that our students are prepared for real-world challenges.
            </p>
            <p>
              We believe that education should be a lifelong journey, and we're committed to 
              supporting our learners every step of the way.
            </p>
            <Button as={Link} to="/courses" variant="primary" size="lg" className="mt-3">
              Explore Our Workshops
            </Button>
          </Col>
        </Row>
      </Container>
      
      {/* Values Section */}
      <Container fluid className="values-section bg-light py-5 my-5">
        <Container>
          <div className="section-header text-center mb-5">
            <h2>Our Values</h2>
            <div className="divider mx-auto"></div>
            <p className="text-muted">The principles that guide everything we do</p>
          </div>
          <Row xs={1} md={2} lg={3} className="g-4">
            {values.map((value, index) => (
              <Col key={index}>
                <Card className="h-100 border-0 bg-white shadow-sm text-center value-card">
                  <Card.Body className="py-4">
                    {value.icon}
                    <Card.Title>{value.title}</Card.Title>
                    <Card.Text>{value.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Container>
      
     {/* Team Section */}
<Container className="team-section my-5 py-5">
  <div className="section-header text-center mb-5">
    <h2>Meet Our Team</h2>
    <div className="divider mx-auto"></div>
    <p className="text-muted">The passionate people behind SkillBloom</p>
  </div>
  <Row xs={1} md={2} lg={4} className="g-4">
    {teamMembers.map((member, index) => (
      <Col key={index}>
        <Card className="h-100 text-center team-card">
          <div className="team-image-container position-relative">
            <Card.Img
              variant="top"
              src={member.image}
              className="rounded-circle mx-auto mt-4 team-image"
              alt={member.name}
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
           
          </div>
          <Card.Body>
            <Card.Title>{member.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
            <Card.Text>{member.bio}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
</Container>

      
      {/* Stats Section */}
      <Container fluid className="stats-section bg-primary text-white py-5 my-5">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4 mb-md-0 stat-item">
              <h2 className="display-4 fw-bold counter" data-target="10000">+10000</h2>
              <p className="lead">Active Learners</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0 stat-item">
              <h2 className="display-4 fw-bold counter" data-target="500">500</h2>
              <p className="lead">Expert Instructors</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0 stat-item">
              <h2 className="display-4 fw-bold counter" data-target="200">200</h2>
              <p className="lead">Workshop Courses</p>
            </Col>
            <Col md={3} className="stat-item">
              <h2 className="display-4 fw-bold counter" data-target="95">95%</h2>
              <p className="lead">Success Rate</p>
            </Col>
          </Row>
        </Container>
      </Container>
      
      {/* CTA Section */}
      <Container className="cta-section my-5 py-5 text-center">
        <div className="cta-content">
          <h2 className="mb-4">Join Our Learning Community</h2>
          <p className="lead mb-4">
            Start your learning journey today and unlock new opportunities
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/signup" variant="primary" size="lg" className="px-4">
              Sign Up Now
            </Button>
            <Button as={Link} to="/contact" variant="outline-primary" size="lg" className="px-4">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Custom CSS for animations and effects */}
      <style >{`
        .hero-block {
          position: relative;
          height: 80vh;
          min-height: 500px;
        }
        
        .carousel-image-wrapper {
          position: relative;
          height: 80vh;
          min-height: 500px;
        }
        
        .carousel-image-wrapper img {
          object-fit: cover;
          height: 100%;
        }
        
        .carousel-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .carousel-caption {
          bottom: 100px;
          z-index: 10;
        }
        
        .caption-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .carousel-caption h3 {
          font-size: 3rem;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .carousel-caption p {
          font-size: 1.5rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .carousel-caption .btn {
          margin: 0 5px;
          padding: 10px 25px;
        }
        
        .mission-section .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
        }
        
        .mission-section .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(0, 123, 255, 0.3), rgba(0, 123, 255, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .mission-section .image-container:hover .image-overlay {
          opacity: 1;
        }
        
        .section-header h2 {
          font-weight: 700;
          position: relative;
          display: inline-block;
        }
        
        .divider {
          width: 80px;
          height: 4px;
          background-color: #007bff;
          margin: 15px auto;
        }
        
        .value-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .team-card {
          transition: transform 0.3s ease;
        }
        
        .team-card:hover {
          transform: translateY(-10px);
        }
        
        .team-image-container {
          position: relative;
          margin-bottom: 15px;
        }
        
        .team-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(0, 123, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          margin: 0 auto;
          left: 0;
          right: 0;
        }
        
        .team-card:hover .team-overlay {
          opacity: 1;
        }
        
        .social-links {
          display: flex;
          gap: 15px;
        }
        
        .social-link {
          color: white;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }
        
        .social-link:hover {
          transform: scale(1.2);
        }
        
        .stat-item {
          position: relative;
        }
        
        .stat-item:after {
          content: '';
          position: absolute;
          right: 0;
          top: 10%;
          height: 80%;
          width: 1px;
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .stat-item:last-child:after {
          display: none;
        }
        
        .cta-section {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          border-radius: 10px;
        }
        
        .cta-content {
          max-width: 700px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .carousel-caption h3 {
            font-size: 2rem;
          }
          
          .carousel-caption p {
            font-size: 1.2rem;
          }
          
          .carousel-caption {
            bottom: 50px;
          }
          
          .hero-block {
            height: 60vh;
          }
          
          .carousel-image-wrapper {
            height: 60vh;
          }
          
          .carousel-caption .btn {
            margin: 5px 0;
            padding: 8px 15px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AboutPage;