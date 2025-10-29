import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer-custom">
      <Container>
        <Row className="g-4">
          
          <Col md={4} lg={3}>
            <h3 className="brand-title">SkillBloom</h3>
            <p className="brand-description">
              Empowering learners worldwide with expert-led workshops and training
              programs. Grow your skills and unlock your future with us.
            </p>
            <div className="social-links">
              <a
                href="https://facebook.com"
                className="social-link"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="social-link"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                className="social-link"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </div>

            
            <div className="newsletter-section">
              <h6 className="newsletter-title">Subscribe to our Newsletter</h6>
              <form
                className="newsletter-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing!');
                }}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="newsletter-input"
                  aria-label="Email address"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
            </div>
          </Col>

          
          <Col md={4} lg={3}>
            <h5 className="section-title">Quick Links</h5>
            <ul className="link-list">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="footer-link">
                  Careers
                </Link>
              </li>
            </ul>
          </Col>

         
          <Col md={4} lg={3}>
            <h5 className="section-title">Categories</h5>
            <ul className="link-list">
              <li>
                <Link
                  to="/categories/technology"
                  className="footer-link"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/business"
                  className="footer-link"
                >
                  Business
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/design"
                  className="footer-link"
                >
                  Design
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/marketing"
                  className="footer-link"
                >
                  Marketing
                </Link>
              </li>
            </ul>
          </Col>

         
          <Col md={4} lg={3}>
            <h5 className="section-title">Contact Us</h5>
            <ul className="contact-list">
              <li className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Education Street, Learning City, LC 12345</span>
              </li>
              <li className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>info@skillbloom.com</span>
              </li>
            </ul>
          </Col>
        </Row>

       
        <Row className="copyright-section">
          <Col md={6} className="text-center text-md-start">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} SkillBloom. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <ul className="legal-links">
              <li>
                <Link to="/privacy" className="legal-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="legal-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="legal-link">
                  FAQ
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      
      <style>{`
        .footer-custom {
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: #ffffff;
          padding: 3rem 0 1.5rem;
         
        }

        .brand-title {
          font-weight: 700;
          font-size: 1.8rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .brand-description {
          color: #d1d5db;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #374151;
          color: #d1d5db;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: #7c3aed;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .newsletter-section {
          margin-top: 1rem;
        }

        .newsletter-title {
          color: #ffffff;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .newsletter-form {
          display: flex;
          gap: 0.5rem;
        }

        .newsletter-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #4b5563;
          border-radius: 4px;
          background: #374151;
          color: #ffffff;
          font-size: 0.875rem;
        }

        .newsletter-input::placeholder {
          color: #9ca3af;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
        }

        .newsletter-btn {
          padding: 0.5rem 1rem;
          background: #7c3aed;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .newsletter-btn:hover {
          background: #6d28d9;
        }

        .section-title {
          color: #ffffff;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .link-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .link-list li {
          margin-bottom: 0.5rem;
        }

        .footer-link {
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 0.9rem;
        }

        .footer-link:hover {
          color: #7c3aed;
        }

        .contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          color: #d1d5db;
          font-size: 0.9rem;
        }

        .contact-icon {
          color: #7c3aed;
          margin-right: 0.75rem;
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        .copyright-section {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #4b5563;
        }

        .copyright-text {
          color: #9ca3af;
          margin: 0;
          font-size: 0.875rem;
        }

        .legal-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .legal-link {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .legal-link:hover {
          color: #7c3aed;
        }

        @media (max-width: 767.98px) {
          .legal-links {
            justify-content: center;
            margin-top: 1rem;
          }
          
          .newsletter-form {
            flex-direction: column;
          }
          
          .newsletter-btn {
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;