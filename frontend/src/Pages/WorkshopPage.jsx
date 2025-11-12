import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaClock, FaUser, FaStar, FaBook } from 'react-icons/fa';
import { getWorkshops, enrollWorkshop, cancelEnrollment } from '../services/api';
import { useAuth } from '../Context/AuthContext';

function WorkshopPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingWorkshops, setEnrollingWorkshops] = useState(new Set());
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);

  // Fetch workshops from backend
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const { data } = await getWorkshops();

        // Use backend-provided isEnrolled
        const enrichedWorkshops = data.data.map(w => ({
          ...w,
          isEnrolled: user ? w.isEnrolled : false
        }));

        setWorkshops(enrichedWorkshops);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [user]);


  useEffect(() => {
    let result = workshops;

    if (searchTerm) {
      result = result.filter(
        w =>
          w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(w => w.category === selectedCategory);
    }

    setFilteredWorkshops(result);
  }, [searchTerm, selectedCategory, workshops]);


const handleEnroll = async (workshop) => {
  if (!user) {
    navigate('/login');
    return;
  }

  if (enrollingWorkshops.has(workshop._id)) return;
  setEnrollingWorkshops(prev => new Set([...prev, workshop._id]));

  try {

    await enrollWorkshop(workshop._id);

    setWorkshops(prev =>
      prev.map(w =>
        w._id === workshop._id
          ? { ...w, isEnrolled: true, enrolled: (w.enrolled || 0) + 1 }
          : w
      )
    );

    alert('Successfully enrolled! You can now view the workshop details.');


    navigate(`/workshops/${workshop._id}`, { state: { workshop } });

  } catch (err) {
    console.error('Error enrolling:', err);
    alert(err.response?.data?.message || 'Failed to enroll');
  } finally {
    setEnrollingWorkshops(prev => {
      const newSet = new Set([...prev]);
      newSet.delete(workshop._id);
      return newSet;
    });
  }
};


  
  const handleCancelEnrollment = async (workshop) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (enrollingWorkshops.has(workshop._id)) return;
    setEnrollingWorkshops(prev => new Set([...prev, workshop._id]));

    try {
      const { data } = await cancelEnrollment(workshop._id);

      
      setWorkshops(prev =>
        prev.map(w =>
          w._id === workshop._id
            ? {
                ...w,
                isEnrolled: false,
                enrolled: w.enrolled > 0 ? w.enrolled - 1 : 0
              }
            : w
        )
      );

      alert('Enrollment cancelled successfully.');
    } catch (err) {
      console.error('Error cancelling enrollment:', err);
      alert(err.response?.data?.message || 'Failed to cancel enrollment');
    } finally {
      setEnrollingWorkshops(prev => {
        const newSet = new Set([...prev]);
        newSet.delete(workshop._id);
        return newSet;
      });
    }
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" role="status" />
      <p className="mt-3">Loading workshops...</p>
    </Container>
  );

  const categories = ['All', ...new Set(workshops.map(w => w.category))];

  return (
    <Container className="py-5">
      
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="fw-bold mb-3">Explore Workshops</h1>
          <p className="lead">Discover and enroll in workshops that match your interests</p>
        </Col>
      </Row>

    
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search workshops..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Dropdown onSelect={e => setSelectedCategory(e)}>
            <Dropdown.Toggle variant="outline-secondary" className="w-100">
              <FaFilter className="me-2" />
              {selectedCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {categories.map(category => (
                <Dropdown.Item key={category} eventKey={category}>{category}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredWorkshops.map(workshop => {
          const isEnrolling = enrollingWorkshops.has(workshop._id);

          return (
            <Col key={workshop._id}>
              <Card className="h-100 workshop-card">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/uploads/${workshop.image}`}
                  alt={workshop.title}
                  className="card-img-top"
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="primary">{workshop.category}</Badge>
                    <div className="d-flex align-items-center">
                      <FaStar className="text-warning me-1" />
                      <span className="fw-bold">4.8</span> 
                    </div>
                  </div>

                  <Card.Title className="mb-3">{workshop.title}</Card.Title>
                  <Card.Text className="text-muted mb-3">{workshop.description}</Card.Text>

                  <div className="d-flex align-items-center mb-2">
                    <FaUser className="text-muted me-2" />
                    <span className="small">{workshop.instructor}</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaClock className="text-muted me-2" />
                    <span className="small">{workshop.duration}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold h4 mb-0">${workshop.price || 'Free'}</span>
                    <span className="text-muted small">
                      <FaBook className="me-1" />
                      {workshop.enrolled || 0} enrolled
                    </span>
                  </div>

                  {workshop.isEnrolled ? (
                    <Button variant="success" className="w-100" onClick={() => navigate(`/workshops/${workshop._id}`)}>
                      View Details
                    </Button>
                  ) : (
                    <Button variant="primary" className="w-100" onClick={() => handleEnroll(workshop)} disabled={isEnrolling}>
                      {isEnrolling ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                          Enrolling...
                        </>
                      ) : (
                        'Enroll Now'
                      )}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredWorkshops.length === 0 && (
        <Row className="text-center py-5">
          <Col>
            <h3>No workshops found</h3>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
          </Col>
        </Row>
      )}

      
      <style>{`
        .workshop-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: none;
          border-radius: 10px;
          overflow: hidden;
        }
        .workshop-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .card-img-top {
          height: 180px;
          object-fit: cover;
        }
      `}</style>
    </Container>
  );
}

export default WorkshopPage;
