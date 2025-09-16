import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Accordion, Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { BsCode, BsLightbulb, BsGear, BsBug, BsBriefcase } from 'react-icons/bs';

const QuestionAccordion = ({ questions, title, icon: IconComponent, badgeColor, sectionId }) => {
  const theme = useSelector((state) => state.theme.mode);
  const [activeKey, setActiveKey] = useState(null);

  const handleSelect = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  const formatAnswer = (answer) => {
    // Split answer by code blocks and regular text
    const parts = answer.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract language and code
        const codeMatch = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (codeMatch) {
          const [, language, code] = codeMatch;
          return (
            <div key={index} className="my-4">
              <div className="position-relative">
                {language && (
                  <div 
                    className={`position-absolute top-0 end-0 px-2 py-1 rounded-bottom-start text-white`}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      zIndex: 10
                    }}
                  >
                    {language.toUpperCase()}
                  </div>
                )}
                <pre 
                  className={`p-4 position-relative ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
                  style={{ 
                    fontSize: '0.875rem',
                    overflowX: 'auto',
                    lineHeight: '1.6',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: theme === 'dark' 
                      ? 'inset 0 2px 10px rgba(255, 255, 255, 0.03)' 
                      : 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <code className={`language-${language || 'javascript'}`}>
                    {code.trim()}
                  </code>
                </pre>
              </div>
            </div>
          );
        }
      } else {
        // Regular text with markdown-style formatting
        return (
          <div 
            key={index} 
            className="question-text"
            dangerouslySetInnerHTML={{
              __html: part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n/g, '<br>')
            }}
          />
        );
      }
    });
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Container className="my-5" id={sectionId}>
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <IconComponent className={`me-3 fs-2 text-${badgeColor}`} />
            <div>
              <h2 className={`mb-1 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
                {title}
              </h2>
              <Badge bg={badgeColor} className="fs-6">
                {questions.length} Questions
              </Badge>
            </div>
          </div>

          <Accordion 
            activeKey={activeKey} 
            onSelect={handleSelect}
            className="accordion-enhanced"
          >
            {questions.map((question, index) => (
              <Accordion.Item 
                key={question.id} 
                eventKey={question.id}
                className={`card-enhanced ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`}
              >
                <Accordion.Header 
                  className={`${theme === 'dark' ? 'text-light' : 'text-dark'}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <div 
                      className={`badge bg-${badgeColor} me-3 rounded-pill d-flex align-items-center justify-content-center`}
                      style={{ 
                        minWidth: '35px', 
                        height: '35px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      {index + 1}
                    </div>
                    <span className="fw-semibold fs-6">{question.question}</span>
                  </div>
                </Accordion.Header>
                
                <Accordion.Body 
                  className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-white text-dark'}`}
                  style={{ 
                    borderTop: `1px solid ${theme === 'dark' ? '#444' : '#dee2e6'}`,
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}
                >
                  <div className="answer-content">
                    {formatAnswer(question.answer)}
                  </div>
                  
                  {/* Question metadata */}
                  <div className={`mt-4 pt-3 border-top ${theme === 'dark' ? 'border-secondary' : 'border-light'}`}>
                    <small className={`${theme === 'dark' ? 'text-muted' : 'text-secondary'}`}>
                      Question ID: {question.id} | 
                      Category: {title} |
                      <span className="ms-1">
                        💡 Tip: Practice implementing this code yourself for better understanding
                      </span>
                    </small>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionAccordion;
