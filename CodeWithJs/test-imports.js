// Simple test to verify all imports work
try {
  // Test basic question data
  const basicQuestions = require('./src/data/basicQuestions.json');
  console.log('✓ Basic questions loaded:', basicQuestions.length, 'questions');

  const intermediateQuestions = require('./src/data/intermediateQuestions.json');
  console.log('✓ Intermediate questions loaded:', intermediateQuestions.length, 'questions');

  const advancedQuestions = require('./src/data/advancedQuestions.json');
  console.log('✓ Advanced questions loaded:', advancedQuestions.length, 'questions');

  const pseudoCodeQuestions = require('./src/data/pseudoCodeQuestions.json');
  console.log('✓ Pseudo code questions loaded:', pseudoCodeQuestions.length, 'questions');

  const interviewQuestions = require('./src/data/interviewQuestions.json');
  console.log('✓ Interview questions loaded:', interviewQuestions.length, 'questions');

  const total = basicQuestions.length + intermediateQuestions.length + advancedQuestions.length + pseudoCodeQuestions.length + interviewQuestions.length;
  console.log('✓ Total questions:', total);

} catch (error) {
  console.error('❌ Error loading data:', error.message);
}
