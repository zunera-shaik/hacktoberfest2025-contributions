import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { 
  BsGithub, 
  BsLinkedin, 
  BsTwitter, 
  BsEnvelope, 
  BsHeart, 
  BsCode,
  BsStar,
  BsCurrencyDollar
} from 'react-icons/bs';

const Footer = () => {
  const theme = useSelector((state) => state.theme.mode);

  return (
    <footer
      className={`mt-5 py-5 ${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{
        borderTop: `2px solid ${theme === "dark" ? "#444" : "#dee2e6"}`,
      }}
    >
      <Container>
        <Row>
          {/* Brand Section */}
          <Col lg={4} md={6} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <BsCode className="me-2 fs-3 text-primary" />
              <h5 className="mb-0 text-primary fw-bold">CodeWithJs</h5>
            </div>
            <p
              className={`${
                theme === "dark" ? "text-light" : "text-muted"
              } mb-3`}
            >
              Master JavaScript from basics to advanced concepts. Practice with
              real interview questions and improve your coding skills.
            </p>
            <div className="d-flex gap-2">
              <Button
                variant={theme === "dark" ? "outline-light" : "outline-dark"}
                size="sm"
                className="d-flex align-items-center"
              >
                <BsGithub className="me-1" />
                GitHub
              </Button>
              <Button
                variant={theme === "dark" ? "outline-light" : "outline-dark"}
                size="sm"
                className="d-flex align-items-center"
              >
                <BsStar className="me-1" />
                Star Us
              </Button>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="#basic"
                  className={`text-decoration-none ${
                    theme === "dark" ? "text-light" : "text-muted"
                  }`}
                >
                  Basic Questions
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#intermediate"
                  className={`text-decoration-none ${
                    theme === "dark" ? "text-light" : "text-muted"
                  }`}
                >
                  Intermediate
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#advanced"
                  className={`text-decoration-none ${
                    theme === "dark" ? "text-light" : "text-muted"
                  }`}
                >
                  Advanced
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#pseudo"
                  className={`text-decoration-none ${
                    theme === "dark" ? "text-light" : "text-muted"
                  }`}
                >
                  Pseudo Code
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#interview"
                  className={`text-decoration-none ${
                    theme === "dark" ? "text-light" : "text-muted"
                  }`}
                >
                  Interview
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Section */}
          <Col lg={3} md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Contact</h6>
            <div className="d-flex flex-column gap-2">
              <a
                href="mailto:hello@codewithjs.com"
                className={`text-decoration-none d-flex align-items-center ${
                  theme === "dark" ? "text-light" : "text-muted"
                }`}
              >
                <BsEnvelope className="me-2" />
                hello@codewithjs.com
              </a>
              <a
                href="https://github.com/codewithjs"
                className={`text-decoration-none d-flex align-items-center ${
                  theme === "dark" ? "text-light" : "text-muted"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsGithub className="me-2" />
                GitHub
              </a>
              <a
                href="https://linkedin.com/company/codewithjs"
                className={`text-decoration-none d-flex align-items-center ${
                  theme === "dark" ? "text-light" : "text-muted"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsLinkedin className="me-2" />
                LinkedIn
              </a>
              <a
                href="https://twitter.com/codewithjs"
                className={`text-decoration-none d-flex align-items-center ${
                  theme === "dark" ? "text-light" : "text-muted"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsTwitter className="me-2" />
                Twitter
              </a>
            </div>
          </Col>

          {/* Support Section */}
          <Col lg={3} md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Support</h6>
            <div className="d-flex flex-column gap-3">
              <div>
                <p
                  className={`small mb-2 ${
                    theme === "dark" ? "text-light" : "text-muted"
                  }`}
                >
                  Help us improve and add more content
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="d-flex align-items-center"
                >
                  <BsHeart className="me-1" />
                  Contribute
                </Button>
              </div>

              <div>
                <p
                  className={`small mb-2 ${
                    theme === "dark" ? "text-light" : "text-muted"
                  }`}
                >
                  Buy us a coffee to keep going
                </p>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="d-flex align-items-center text-dark"
                >
                  <BsCurrencyDollar className="me-1" />
                  Donate
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <hr
          className={`my-4 ${
            theme === "dark" ? "border-secondary" : "border-light"
          }`}
        />

        {/* Bottom Section */}
        <Row>
          <Col md={6}>
            <small
              className={`${
                theme === "dark" ? "text-muted" : "text-secondary"
              }`}
            >
              © 2024 CodeWithJs. Made with{" "}
              <BsHeart className="text-danger mx-1" /> for JavaScript
              developers.
            </small>
          </Col>
          <Col md={6} className="text-md-end">
            <small
              className={`${
                theme === "dark" ? "text-muted" : "text-secondary"
              }`}
            >
              Open Source • MIT License • Free to Use
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
