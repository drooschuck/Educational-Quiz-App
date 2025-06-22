import React, { useState, useEffect, useMemo } from 'react';

const YearSelection = ({ years, onYearSelected }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Your Year Group</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => onYearSelected(year)}
            className="year-group-button subject-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            Year {year}
          </button>
        ))}
      </div>
    </div>
  );
};

const SubjectSelection = ({ availableSubjects, onSubjectSelected }) => {
  const scienceSubjects = ['Physics', 'Chemistry', 'Biology'];
  const otherSubjects = availableSubjects.filter((s) => !scienceSubjects.includes(s));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select a Subject</h2>
      <h3 className="text-xl font-medium text-blue-700 mt-6 mb-3">Science Subjects</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {scienceSubjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onSubjectSelected(subject)}
            className="subject-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                {subject === 'Physics' && '⚛️'}
                {subject === 'Chemistry' && '🧪'}
                {subject === 'Biology' && '🧬'}
              </div>
              <span>{subject}</span>
            </div>
          </button>
        ))}
      </div>
      <h3 className="text-xl font-medium text-blue-700 mt-6 mb-3">Other Subjects</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {otherSubjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onSubjectSelected(subject)}
            className="subject-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

const UnitSelection = ({ currentSubject, selectedYear, availableUnits, onUnitSelected, onBackToSubjects }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {currentSubject} - Year {selectedYear}
      </h2>
      <h3 className="text-xl font-medium text-blue-700 mb-3">Select a Unit</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {availableUnits.map((unit) => (
          <button
            key={unit}
            onClick={() => onUnitSelected(unit)}
            className="unit-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            Unit {unit}
          </button>
        ))}
      </div>
      <button onClick={onBackToSubjects} className="bg-gray-500 text-white p-2 rounded-lg">
        Back to Subjects
      </button>
    </div>
  );
};

const Quiz = ({
  quizTitle,
  questions,
  currentQuestionIndex,
  totalQuestions,
  onAnswerSelected,
  onNextQuestion,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const currentQuestion = questions[currentQuestionIndex] || {};

  const optionClass = (option) => {
    if (selectedAnswer === null) return '';
    if (option === currentQuestion.answer) return 'correct';
    if (option === selectedAnswer && option !== currentQuestion.answer) return 'incorrect';
    return '';
  };

  const answerSelected = selectedAnswer !== null;

  const selectAnswer = (option) => {
    if (selectedAnswer !== null) return; // prevent multiple selections
    setSelectedAnswer(option);
    onAnswerSelected(option);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    onNextQuestion();
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{quizTitle}</h2>
          <span className="text-lg">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="mb-2">
          <span className="text-sm text-blue-600">{currentQuestion.topic}</span>
        </div>
        <div className="question-container mb-4">
          <p className="text-lg font-medium">{currentQuestion.question}</p>
          <div className="options mt-4">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(option)}
                className={`option p-2 border rounded-lg mb-2 w-full ${optionClass(option)}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={nextQuestion}
          className="bg-blue-600 text-white p-2 rounded-lg"
          disabled={!answerSelected}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

const Results = ({ score, totalQuestions, onRetryQuiz, onChooseAnotherSubject }) => {
  const percentage = (score / totalQuestions) * 100;
  const resultMessage =
    percentage >= 80
      ? 'Excellent work!'
      : percentage >= 60
      ? 'Good job!'
      : percentage >= 40
      ? 'Not bad!'
      : 'Keep practicing!';

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Results</h2>
      <div className="mb-6">
        <p className="text-xl mb-2">
          Score: {score} / {totalQuestions}
        </p>
        <p className="text-lg">{resultMessage}</p>
      </div>
      <div className="flex justify-center space-x-4">
        <button onClick={onRetryQuiz} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Retry Quiz
        </button>
        <button
          onClick={onChooseAnotherSubject}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Choose Another Subject
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const years = [7, 8, 9, 10, 11];
  const availableSubjects = ['Math', 'English', 'History', 'Physics', 'Chemistry', 'Biology'];
  const availableUnits = [1, 2, 3, 4];

  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('home');
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentUnit, setCurrentUnit] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [score, setScore] = useState(0);

  const progress = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return (currentQuestionIndex / totalQuestions) * 100;
  }, [currentQuestionIndex, totalQuestions]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const selectYear = (year) => {
    setSelectedYear(year);
    setScreen('subject');
  };

  const selectSubject = (subject) => {
    setCurrentSubject(subject);
    setScreen('unit');
  };

  const selectUnit = async (unit) => {
    setCurrentUnit(unit);
    const importPath = `./data/year${selectedYear}/${currentSubject.toLowerCase()}/unit${unit}.js`;
    console.log('Importing questions from:', importPath);
    try {
      const module = await import(/* @vite-ignore */ importPath);
      setQuizTitle(module.default.quizSubject);
      setQuestions(module.default.questions);
      setTotalQuestions(module.default.questions.length);
      setScore(0);
      setCurrentQuestionIndex(0);
      setScreen('quiz');
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
      setScreen('unit');
    }
  };

  const selectAnswer = (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
    setCurrentQuestionIndex((prev) => prev + 1);
    if (currentQuestionIndex + 1 >= totalQuestions) {
      setScreen('results');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setScreen('results');
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setScreen('quiz');
  };

  const returnToSubjects = () => {
    setScreen('subject');
  };

  return (
    <div>
      {loading && (
        <div
          id="loading-screen"
          className="fixed inset-0 bg-white flex items-center justify-center z-50"
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading Quiz App...</p>
          </div>
        </div>
      )}

      {screen === 'home' && (
        <div id="home-screen" className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-800 mb-2">KS3 Quiz Master</h1>
            <p className="text-lg text-gray-600">Test your knowledge across all KS3 subjects</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="progress-bar bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </header>
          <YearSelection years={years} onYearSelected={selectYear} />
        </div>
      )}

      {screen === 'subject' && (
        <div id="subject-screen" className="container mx-auto px-4 py-8">
          <SubjectSelection availableSubjects={availableSubjects} onSubjectSelected={selectSubject} />
        </div>
      )}

      {screen === 'unit' && (
        <div id="unit-screen" className="container mx-auto px-4 py-8">
          <UnitSelection
            currentSubject={currentSubject}
            selectedYear={selectedYear}
            availableUnits={availableUnits}
            onUnitSelected={selectUnit}
            onBackToSubjects={returnToSubjects}
          />
        </div>
      )}

      {screen === 'quiz' && (
        <div id="quiz-screen" className="container mx-auto px-4 py-8">
          <Quiz
            quizTitle={quizTitle}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            onAnswerSelected={selectAnswer}
            onNextQuestion={nextQuestion}
          />
        </div>
      )}

      {screen === 'results' && (
        <div id="results-screen" className="container mx-auto px-4 py-8">
          <Results
            score={score}
            totalQuestions={totalQuestions}
            onRetryQuiz={restartQuiz}
            onChooseAnotherSubject={returnToSubjects}
          />
        </div>
      )}
    </div>
  );
};

export default App;
