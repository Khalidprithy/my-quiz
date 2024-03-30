'use client';

import { useCallback, useEffect, useState } from 'react';

const QuizComponent = ({ questions }) => {
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
    return (
      <div className='max-w-md min-w-[300px] lg:min-w-[500px] mx-auto p-6 bg-white rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold mb-4'>Quiz History</h1>
        <p className='text-lg mb-4'>Your score: {score}</p>
        <ul className='mb-4'>
          {quizHistory.map((item, index) => (
            <li
              key={index}
              className={`mb-2 ${
                item.isCorrect ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.question}: {item.answer.join(', ')} -{' '}
              {item.isCorrect ? 'Correct' : 'Wrong'}
            </li>
          ))}
        </ul>
      </div>
    );
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
      <div className='grid grid-cols-12 items-center gap-4'>
        <div className='col-span-10 relative w-full bg-gray-200 rounded-lg h-2'>
          <div
            className={`absolute top-0 left-0 rounded-lg h-2 transition-all duration-500 ease-linear ${getProgressBarColor()}`}
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <div className='col-span-2'>
          <p className='text-lg'> {timeLeft}s</p>
        </div>
      </div>

      <p className='text-lg mb-4'>
        {currentQuestion ? currentQuestion.question : ''}
      </p>

      {(currentQuestion?.type === 'multiple' ||
        currentQuestion?.type === 'trueFalse') && (
        <ul className='mb-4'>
          {currentQuestion &&
            currentQuestion.options.map((option, index) => (
              <li
                key={option._id}
                className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
                  selectedOption.includes(index)
                    ? 'bg-green-400'
                    : 'bg-gray-100'
                } hover:bg-gray-200`}
                onClick={() =>
                  handleOptionSelect(
                    index,
                    currentQuestion.answer.includes(index)
                  )
                }
              >
                {option.title}
              </li>
            ))}
        </ul>
      )}

      {(currentQuestion?.type === 'open' ||
        currentQuestion?.type === 'blank') && (
        <div className='mb-4'>
          <input
            type='text'
            value={userInput}
            onChange={handleInputChange}
            className='w-full p-2 border border-gray-300 rounded-lg'
            placeholder='Type your answer here...'
          />
          <button
            onClick={() => {
              if (currentQuestion.type === 'open') {
                handleAnswer(userInput.trim() !== '');
              } else if (currentQuestion.type === 'blank') {
                checkBlankAnswer();
              }
            }}
            className='mt-2 p-2 bg-blue-500 text-white rounded-lg w-full'
          >
            Submit
          </button>
        </div>
      )}

      {currentQuestion?.type === 'checkbox' && (
        <div className='mb-4'>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li
                key={option._id}
                className={`flex items-center cursor-pointer py-2 px-4 mb-2 rounded-lg ${
                  selectedOptions.includes(index)
                    ? 'bg-green-400'
                    : 'bg-gray-100'
                } hover:bg-gray-200`}
                onClick={() => handleCheckboxSelect(index)}
              >
                <input
                  type='checkbox'
                  checked={selectedOptions.includes(index)}
                  onChange={() => handleCheckboxSelect(index)}
                  className='mr-2'
                />
                {option.title}
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckBoxSubmit}
            className='mt-2 p-2 bg-blue-500 text-white rounded-lg w-full'
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
