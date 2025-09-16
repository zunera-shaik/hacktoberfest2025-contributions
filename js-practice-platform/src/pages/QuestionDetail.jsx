import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Lightbulb
} from 'lucide-react';

const QuestionDetail = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { currentQuestion } = useSelector((state) => state.questions);
  const { darkMode } = useSelector((state) => state.theme);
  
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (currentQuestion && currentQuestion.starterCode) {
      setCode(currentQuestion.starterCode);
    }
  }, [currentQuestion]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    try {
      // Create a sandbox to run the code
      const originalConsoleLog = console.log;
      let capturedOutput = [];

      // Override console.log to capture output
      console.log = (...args) => {
        capturedOutput.push(args.join(' '));
      };

      // Execute the code
      const func = new Function(code);
      const result = func();

      // Restore console.log
      console.log = originalConsoleLog;

      // Set the captured output
      if (capturedOutput.length > 0) {
        setOutput(capturedOutput.join('\n'));
      } else if (result !== undefined) {
        setOutput(String(result));
      } else {
        setOutput('Code executed successfully (no output)');
      }

    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (currentQuestion?.starterCode) {
      setCode(currentQuestion.starterCode);
      setOutput('');
      setTestResults([]);
    }
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Question not found or not loaded properly.
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'difficulty-easy';
      case 'medium':
        return 'difficulty-medium';
      case 'hard':
        return 'difficulty-hard';
      default:
        return 'difficulty-medium';
    }
  };

  return (
    <div className="question-detail">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="btn-icon"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentQuestion.title}
            </h1>
            <span className={`difficulty-badge ${getDifficultyColor(currentQuestion.difficulty)} mt-2`}>
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full">
        {/* Left Panel - Problem Description */}
        <div className="xl:w-1/3 space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Problem Description</h2>
            </div>
            <div className="card-body">
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                {currentQuestion.question}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {currentQuestion.description}
              </p>
            </div>
          </div>

          {/* Test Cases */}
          {currentQuestion.testCases && currentQuestion.testCases.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Test Cases</h2>
              </div>
              <div className="card-body space-y-3">
                {currentQuestion.testCases.map((testCase, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Test Case {index + 1}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {testCase.description}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Expected: </span>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                        {testCase.expected}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solution Hint */}
          {showSolution && (
            <div className="card border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Lightbulb size={20} className="text-yellow-600" />
                  <h2 className="card-title text-yellow-800 dark:text-yellow-200">Solution</h2>
                </div>
              </div>
              <div className="card-body">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  This is the solution code. Study it carefully to understand the approach and then try to implement it yourself.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="xl:w-2/3 flex flex-col space-y-4">
          <div className="code-editor-container flex-1">
            <div className="code-editor-header">
              <div className="code-editor-title">JavaScript Code Editor</div>
              <div className="code-editor-actions">
                <button 
                  onClick={toggleSolution}
                  className="btn btn-secondary"
                  title={showSolution ? 'Hide Solution' : 'Show Solution'}
                >
                  {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showSolution ? 'Hide' : 'Solution'}
                </button>
                <button 
                  onClick={resetCode}
                  className="btn btn-secondary"
                  title="Reset to starter code"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button 
                  onClick={runCode}
                  disabled={isRunning}
                  className="btn btn-primary"
                >
                  {isRunning ? (
                    <div className="loading-spinner" />
                  ) : (
                    <Play size={16} />
                  )}
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
              </div>
            </div>
            <div style={{ height: '500px', minHeight: '400px' }}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={showSolution ? currentQuestion.solution : code}
                onChange={showSolution ? undefined : setCode}
                theme={darkMode ? 'vs-dark' : 'vs-light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: showSolution,
                  automaticLayout: true,
                  wordWrap: 'on',
                  tabSize: 2,
                  insertSpaces: true,
                }}
              />
            </div>
          </div>

          {/* Output */}
          {output && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <Play size={16} className="text-green-600" />
                  Output
                </h2>
              </div>
              <div className="card-body">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
