// UnauthorizedPage.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-danger mb-4">Access Denied</h2>
                <p>You don't have permission to access this page.</p>
                <Button variant="primary" onClick={() => navigate('/home')}>
                  Go to Home
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UnauthorizedPage;