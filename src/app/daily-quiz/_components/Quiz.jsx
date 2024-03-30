'use client';

import { useCallback, useEffect, useState } from 'react';
import AnswerInput from './AnswerInput';
import CheckBoxQuestion from './CheckBoxQuestion';
import LeaderBoard from './LeaderBoard';
import ProgressBar from './ProgressBar';
import QuestionOptions from './QuestionOptions';

const Quiz = ({ questions }) => {
  const [state, setState] = useState({
    currentQuestionIndex: 0,
    timeLeft: 0,
    selectedOptions: [],
    selectedOption: [],
    isAnswered: false,
    score: 0,
    lastSelectedOption: [],
    questionsAnswered: 0,
    showQuizHistory: false,
    quizStarted: false,
    userInput: ''
  });

  const [quizHistory, setQuizHistory] = useState([]);
  const [cardBackgroundColor, setCardBackgroundColor] = useState('bg-white');

  const {
    currentQuestionIndex,
    timeLeft,
    selectedOption,
    selectedOptions,
    isAnswered,
    score,
    lastSelectedOption,
    questionsAnswered,
    showQuizHistory,
    quizStarted,
    userInput
  } = state;

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (quizStarted) {
      setState(prevState => ({
        ...prevState,
        timeLeft: questions[currentQuestionIndex]?.duration || 0
      }));
    }
  }, [currentQuestionIndex, questions, quizStarted]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setState(prevState => ({
        ...prevState,
        currentQuestionIndex: currentQuestionIndex + 1,
        isAnswered: false,
        selectedOption: [],
        lastSelectedOption: []
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        currentQuestionIndex: currentQuestionIndex + 1,
        showQuizHistory: true
      }));
      console.log('End of quiz');
    }
  }, [currentQuestionIndex, questions.length]);

  const handleAnswer = useCallback(
    isCorrect => {
      if (!isAnswered) {
        setState(prevState => ({
          ...prevState,
          isAnswered: true,
          score: isCorrect ? score + 1 : score,
          lastSelectedOption: selectedOption,
          questionsAnswered: prevState.questionsAnswered + 1,
          userInput: ''
        }));
        setQuizHistory(prevHistory => [
          ...prevHistory,
          {
            question: currentQuestion.question,
            answer: selectedOption.map(
              index => currentQuestion.options[index].title
            ),
            isCorrect
          }
        ]);
        setTimeout(() => setCardBackgroundColor('bg-white'), 1000);
        setTimeout(goToNextQuestion, 1000);
      }
    },
    [isAnswered, score, selectedOption, currentQuestion, goToNextQuestion]
  );

  useEffect(() => {
    if (quizStarted && !showQuizHistory) {
      const timer = setTimeout(() => {
        if (timeLeft > 0 && !isAnswered) {
          setState(prevState => ({ ...prevState, timeLeft: timeLeft - 1 }));
        } else if (!isAnswered) {
          setCardBackgroundColor('bg-red-600');
          handleAnswer(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, isAnswered, quizStarted, showQuizHistory, handleAnswer]);

  useEffect(() => {
    setState(prevState => ({ ...prevState, quizStarted: true }));
  }, []);

  const handleInputChange = useCallback(event => {
    setState(prevState => ({ ...prevState, userInput: event.target.value }));
  }, []);

  const checkBlankAnswer = useCallback(() => {
    if (currentQuestion.type === 'blank') {
      const userAnswer = userInput.trim();
      const isCorrect = currentQuestion.options.some(option => {
        if (option.type === 'exact') {
          return userAnswer === option.title;
        } else if (option.type === 'contains') {
          return userAnswer.includes(option.title);
        }
        return false;
      });
      setCardBackgroundColor(isCorrect ? 'bg-green-400' : 'bg-red-600');
      handleAnswer(isCorrect);
    }
  }, [userInput, currentQuestion, handleAnswer]);

  const handleOptionSelect = useCallback(
    (index, isCorrect) => {
      if (!isAnswered) {
        setState(prevState => ({
          ...prevState,
          selectedOption: [...prevState.selectedOption, index]
        }));
        setCardBackgroundColor(isCorrect ? 'bg-green-400' : 'bg-red-600');
        handleAnswer(isCorrect);
      }
    },
    [isAnswered, handleAnswer]
  );

  const handleCheckboxSelect = useCallback(
    index => {
      if (!isAnswered) {
        const updatedOptions = selectedOptions.includes(index)
          ? selectedOptions.filter(item => item !== index)
          : [...selectedOptions, index];

        setState(prevState => ({
          ...prevState,
          selectedOptions: updatedOptions
        }));
      }
    },
    [isAnswered, selectedOptions]
  );

  const handleCheckBoxSubmit = useCallback(() => {
    if (!isAnswered) {
      const selectedIndexes = selectedOptions.sort((a, b) => a - b);

      console.log('Selected', selectedIndexes);
      const correctIndexes = currentQuestion.answer.sort((a, b) => a - b);

      console.log('Current', correctIndexes);

      const isCorrect =
        JSON.stringify(selectedIndexes) === JSON.stringify(correctIndexes);

      setCardBackgroundColor(isCorrect ? 'bg-green-400' : 'bg-red-600');
      handleAnswer(isCorrect);
    }
  }, [isAnswered, selectedOptions, currentQuestion, handleAnswer]);

  const calculateProgress = useCallback(() => {
    if (currentQuestion && currentQuestion.duration) {
      return ((timeLeft / currentQuestion.duration) * 100).toFixed(2);
    }
    return 0;
  }, [timeLeft, currentQuestion]);

  const getProgressBarColor = useCallback(() => {
    if (currentQuestion && currentQuestion.duration) {
      const timePercentage = (timeLeft / currentQuestion.duration) * 100;

      if (timePercentage > 75) {
        return 'bg-green-500';
      } else if (timePercentage > 25) {
        return 'bg-yellow-500';
      } else {
        return 'bg-red-500';
      }
    }
    return 'bg-gray-500';
  }, [timeLeft, currentQuestion]);

  useEffect(() => {
    if (questionsAnswered % 3 === 0 && quizStarted) {
      setState(prevState => ({ ...prevState, showQuizHistory: true }));
      setTimeout(() => {
        setState(prevState => ({ ...prevState, showQuizHistory: false }));
      }, 3000);
    }
  }, [questionsAnswered, quizStarted]);

  if (showQuizHistory && questionsAnswered !== 0) {
    return <LeaderBoard quizHistory={quizHistory} score={score} />;
  }

  return (
    <div
      className={`max-w-md min-w-[300px] lg:min-w-[500px] mx-auto p-6 rounded-lg shadow-lg ${cardBackgroundColor}`}
    >
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>
          Question {currentQuestionIndex + 1}{' '}
          <span className='text-sm font-light capitalize'>
            ({currentQuestion.type})
          </span>
        </h1>
        <p className='text-2xl'>Score: {score}</p>
      </div>

      <ProgressBar timeLeft={timeLeft} duration={currentQuestion.duration} />

      <p className='text-lg mb-4'>
        {currentQuestion ? currentQuestion.question : ''}
      </p>

      {currentQuestion?.type === 'multiple' ||
      currentQuestion?.type === 'trueFalse' ? (
        <QuestionOptions
          question={currentQuestion}
          options={currentQuestion.options}
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
        />
      ) : null}

      {currentQuestion?.type === 'open' || currentQuestion?.type === 'blank' ? (
        <AnswerInput
          userInput={userInput}
          handleInputChange={handleInputChange}
          handleSubmit={() => {
            if (currentQuestion.type === 'open') {
              handleAnswer(userInput.trim() !== '');
            } else if (currentQuestion.type === 'blank') {
              checkBlankAnswer();
            }
          }}
        />
      ) : null}

      {currentQuestion?.type === 'checkbox' ? (
        <CheckBoxQuestion
          options={currentQuestion.options}
          selectedOptions={selectedOptions}
          handleCheckboxSelect={handleCheckboxSelect}
          handleSubmit={handleCheckBoxSubmit}
        />
      ) : null}
    </div>
  );
};

export default Quiz;
