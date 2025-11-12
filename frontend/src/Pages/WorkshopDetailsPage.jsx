import React, { useState, useEffect } from 'react'; 
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkshopById, getEnrollmentByWorkshop } from '../services/api';
import { useAuth } from '../Context/AuthContext';
import { FaPlay, FaUser, FaClock, FaTag, FaChevronLeft, FaCheck, FaStickyNote } from 'react-icons/fa';

function WorkshopDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState(new Set());

  useEffect(() => {
    const fetchWorkshopData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        
        const workshopRes = await getWorkshopById(id);
        const workshopData = workshopRes.data?.data;

        if (!workshopData) {
          setError('Workshop not found.');
          setLoading(false);
          return;
        }

        
        const enrollmentRes = await getEnrollmentByWorkshop(id);
        const enrollmentData = enrollmentRes?.data?.data || null;

        if (workshopData.isEnrolled === false && !enrollmentData) {
          alert('You must enroll in this workshop to view its content.');
          navigate('/workshops');
          return;
        }

        setUserNotes(enrollmentData?.notes || '');
        setWorkshop({ ...workshopData, enrollmentInfo: enrollmentData });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load workshop details.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopData();
  }, [id, user, navigate]);

  const handleVideoComplete = (index) => {
    setCompletedVideos(prev => new Set([...prev, index]));
  };

  const handleSaveNotes = () => {
    console.log('Saving notes:', userNotes);
    setShowNotesModal(false);
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" role="status" variant="primary" />
      <p className="mt-3 text-muted">Loading workshop details...</p>
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  if (!workshop) return (
    <Container className="py-5 text-center">
      <Alert variant="warning">Workshop Not Found</Alert>
      <Button variant="outline-primary" onClick={() => navigate('/workshops')}>Browse Workshops</Button>
    </Container>
  );

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/workshops')} className="mb-3">
            <FaChevronLeft className="me-2" /> Back to Courses
          </Button>
          <h1 className="display-6 fw-bold text-primary mb-2">{workshop.title}</h1>
          <div className="d-flex align-items-center gap-3 mb-3">
            <Badge bg="primary" className="d-flex align-items-center gap-1">
              <FaTag size={12} /> {workshop.category}
            </Badge>
            <span className="text-muted d-flex align-items-center gap-1">
              <FaClock size={14} /> {workshop.duration}
            </span>
            <span className="text-muted d-flex align-items-center gap-1">
              <FaUser size={14} /> {workshop.instructor}
            </span>
          </div>
          <p className="lead text-muted">{workshop.description}</p>
        </Col>
      </Row>


      <Row>
        <Col lg={8}>
        <Button variant="outline-primary" onClick={() => setShowNotesModal(true)}className="mb-3"><FaStickyNote className="me-1" /> My Notes</Button>
          <h4 className="fw-bold mb-3">Course Content</h4>
          {workshop.videos?.length > 0 ? (
            workshop.videos.map((video, index) => (
              <Card key={video._id || index} className={`mb-3 border-0 shadow-sm ${index === currentVideoIndex ? 'border-start border-4 border-primary' : ''}`}>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="position-relative">
                        <div className="ratio ratio-16x9">
                          <video
                            src={`http://localhost:5000${video.path}`}
                            controls
                            className="rounded w-100"
                            onEnded={() => handleVideoComplete(index)}
                          />
                        </div>
                        {completedVideos.has(index) && (
                          <div className="position-absolute top-0 end-0 m-2">
                            <Badge bg="success" className="d-flex align-items-center gap-1">
                              <FaCheck size={12} /> Completed
                            </Badge>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={8}>
                      <h6>{index + 1}. {video.filename}</h6>
                      <Button
                        variant={index === currentVideoIndex ? "primary" : "outline-primary"}
                        size="sm"
                        onClick={() => setCurrentVideoIndex(index)}
                      >
                        <FaPlay size={12} className="me-1" /> {index === currentVideoIndex ? 'Playing' : 'Play'}
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No videos uploaded for this workshop yet.</p>
          )}
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h6 className="fw-bold mb-3">Workshop Details</h6>
              <div className="d-flex flex-column gap-2">
                <div><FaUser className="me-2" /> Instructor: {workshop.instructor}</div>
                <div><FaClock className="me-2" /> Duration: {workshop.duration}</div>
                <div><FaTag className="me-2" /> Category: {workshop.category}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showNotesModal} onHide={() => setShowNotesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FaStickyNote className="me-2" />Workshop Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={8}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Add your personal notes here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotesModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveNotes}>Save Notes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default WorkshopDetailsPage;
