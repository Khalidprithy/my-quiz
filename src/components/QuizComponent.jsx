'use client';

import { useCallback, useEffect, useState } from 'react';

const QuizComponent = ({ questions }) => {
  const [state, setState] = useState({
    currentQuestionIndex: 0,
    timeLeft: 0,
    selectedOption: '',
    isAnswered: false,
    score: 0,
    lastSelectedOption: { option: '', isCorrect: null },
    questionsAnswered: 0,
    showQuizHistory: false,
    quizStarted: false
  });
  const [quizHistory, setQuizHistory] = useState([]);
  const [cardBackgroundColor, setCardBackgroundColor] = useState('bg-white');

  const {
    currentQuestionIndex,
    timeLeft,
    selectedOption,
    isAnswered,
    score,
    lastSelectedOption,
    questionsAnswered,
    showQuizHistory,
    quizStarted
  } = state;

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestionIndex < questions.length && quizStarted) {
      setState(prevState => ({
        ...prevState,
        timeLeft: questions[currentQuestionIndex].time_limit_seconds
      }));
    }
  }, [currentQuestionIndex, questions, quizStarted]);

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
  }, [timeLeft, isAnswered, quizStarted, showQuizHistory]);

  useEffect(() => {
    // Start the quiz as soon as the component mounts
    setState(prevState => ({ ...prevState, quizStarted: true }));
  }, []);

  const handleAnswer = useCallback(
    isCorrect => {
      if (!isAnswered) {
        setState(prevState => ({
          ...prevState,
          isAnswered: true,
          score: isCorrect ? score + 1 : score,
          lastSelectedOption: { option: selectedOption, isCorrect },
          questionsAnswered: prevState.questionsAnswered + 1
        }));
        setQuizHistory(prevHistory => [
          ...prevHistory,
          {
            question: currentQuestion.question,
            answer: selectedOption,
            isCorrect
          }
        ]);
        setTimeout(() => setCardBackgroundColor('bg-white'), 1000);
        setTimeout(goToNextQuestion, 1000);
      }
    },
    [isAnswered, score, selectedOption, currentQuestion]
  );

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setState(prevState => ({
        ...prevState,
        currentQuestionIndex: currentQuestionIndex + 1,
        isAnswered: false,
        selectedOption: '',
        lastSelectedOption: { option: '', isCorrect: null }
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

  const handleOptionSelect = useCallback(
    (option, isCorrect) => {
      if (!isAnswered) {
        setState(prevState => ({
          ...prevState,
          selectedOption: option
        }));
        setCardBackgroundColor(isCorrect ? 'bg-green-400' : 'bg-red-600');
        handleAnswer(isCorrect);
      }
    },
    [isAnswered]
  );

  const calculateProgress = useCallback(() => {
    if (currentQuestion && currentQuestion.time_limit_seconds) {
      return ((timeLeft / currentQuestion.time_limit_seconds) * 100).toFixed(2);
    }
    return 0;
  }, [timeLeft, currentQuestion]);

  const getProgressBarColor = () => {
    if (currentQuestion && currentQuestion.time_limit_seconds) {
      const timePercentage =
        (timeLeft / currentQuestion.time_limit_seconds) * 100;

      if (timePercentage > 75) {
        return 'bg-green-500';
      } else if (timePercentage > 25) {
        return 'bg-yellow-500';
      } else {
        return 'bg-red-500';
      }
    }
    return 'bg-gray-500';
  };

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
              {item.question}: {item.answer} -{' '}
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
        <h1 className='text-2xl font-bold '>
          Question {currentQuestionIndex + 1}
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
      <ul className='mb-4'>
        {currentQuestion &&
          currentQuestion.options.map((option, index) => (
            <li
              key={index}
              className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
                lastSelectedOption.option === option
                  ? lastSelectedOption.isCorrect
                    ? 'bg-green-400'
                    : 'bg-red-600'
                  : 'bg-gray-100'
              } hover:bg-gray-200`}
              onClick={() =>
                handleOptionSelect(option, option === currentQuestion.answer)
              }
            >
              {option}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default QuizComponent;

// import { useCallback, useEffect, useState } from 'react';

// const QuizComponent = ({ questions }) => {
//   const [state, setState] = useState({
//     currentQuestionIndex: 0,
//     timeLeft: 0,
//     selectedOption: '',
//     isAnswered: false,
//     score: 0,
//     lastSelectedOption: { option: '', isCorrect: null }
//   });
//   const [quizHistory, setQuizHistory] = useState([]);
//   const [cardBackgroundColor, setCardBackgroundColor] = useState('bg-white');

//   const {
//     currentQuestionIndex,
//     timeLeft,
//     selectedOption,
//     isAnswered,
//     score,
//     lastSelectedOption
//   } = state;
//   const currentQuestion = questions[currentQuestionIndex];

//   useEffect(() => {
//     if (currentQuestionIndex < questions.length) {
//       setState(prevState => ({
//         ...prevState,
//         timeLeft: questions[currentQuestionIndex].time_limit_seconds
//       }));
//     }
//   }, [currentQuestionIndex, questions]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (timeLeft > 0 && !isAnswered) {
//         setState(prevState => ({ ...prevState, timeLeft: timeLeft - 1 }));
//       } else if (!isAnswered) {
//         setCardBackgroundColor('bg-red-600');
//         handleAnswer(false);
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [timeLeft, isAnswered]);

//   const handleAnswer = useCallback(
//     isCorrect => {
//       if (!isAnswered) {
//         setState(prevState => ({
//           ...prevState,
//           isAnswered: true,
//           score: isCorrect ? score + 1 : score,
//           lastSelectedOption: { option: selectedOption, isCorrect }
//         }));
//         setQuizHistory(prevHistory => [
//           ...prevHistory,
//           {
//             question: currentQuestion.question,
//             answer: selectedOption,
//             isCorrect
//           }
//         ]);
//         setTimeout(() => setCardBackgroundColor('bg-white'), 1000);
//         setTimeout(goToNextQuestion, 1000);
//       }
//     },
//     [isAnswered, score, selectedOption, currentQuestion]
//   );

//   const goToNextQuestion = useCallback(() => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setState(prevState => ({
//         ...prevState,
//         currentQuestionIndex: currentQuestionIndex + 1,
//         isAnswered: false,
//         selectedOption: '',
//         lastSelectedOption: { option: '', isCorrect: null }
//       }));
//     } else {
//       setState(prevState => ({
//         ...prevState,
//         currentQuestionIndex: currentQuestionIndex + 1
//       }));
//       console.log('End of quiz');
//     }
//   }, [currentQuestionIndex, questions.length]);

//   const handleOptionSelect = useCallback(
//     (option, isCorrect) => {
//       if (!isAnswered) {
//         setState(prevState => ({
//           ...prevState,
//           selectedOption: option
//         }));
//         setCardBackgroundColor(isCorrect ? 'bg-green-400' : 'bg-red-600');
//         handleAnswer(isCorrect);
//       }
//     },
//     [isAnswered]
//   );

//   const calculateProgress = useCallback(() => {
//     const questionTimeLimit =
//       questions[currentQuestionIndex].time_limit_seconds;
//     return ((timeLeft / questionTimeLimit) * 100).toFixed(2);
//   }, [timeLeft, currentQuestionIndex, questions]);

//   const getProgressBarColor = () => {
//     const questionTimeLimit =
//       questions[currentQuestionIndex].time_limit_seconds;
//     const timePercentage = (timeLeft / questionTimeLimit) * 100;

//     if (timePercentage > 75) {
//       return 'bg-green-500'; // Green for more than 75% remaining
//     } else if (timePercentage > 25) {
//       return 'bg-yellow-500'; // Yellow for more than 25% remaining
//     } else {
//       return 'bg-red-500'; // Red for 25% or less remaining
//     }
//   };

//   if (currentQuestionIndex === questions.length) {
//     return (
//       <div className='max-w-md min-w-[300px] lg:min-w-[500px] mx-auto p-6 bg-white rounded-lg shadow-lg'>
//         <h1 className='text-2xl font-bold mb-4'>Quiz History</h1>
//         <p className='text-lg mb-4'>Your score: {score}</p>
//         <ul className='mb-4'>
//           {quizHistory.map((item, index) => (
//             <li
//               key={index}
//               className={`mb-2 ${
//                 item.isCorrect ? 'text-green-500' : 'text-red-500'
//               }`}
//             >
//               {item.question}: {item.answer} -{' '}
//               {item.isCorrect ? 'Correct' : 'Wrong'}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`max-w-md min-w-[300px] lg:min-w-[500px] mx-auto p-6 rounded-lg shadow-lg ${cardBackgroundColor}`}
//     >
//       <div className='flex items-center justify-between mb-4'>
//         <h1 className='text-2xl font-bold '>
//           Question {currentQuestionIndex + 1}
//         </h1>
//         <p className='text-2xl'>Score: {score}</p>
//       </div>
//       <div className='grid grid-cols-12 items-center gap-4'>
//         <div className='col-span-10 relative w-full bg-gray-200 rounded-lg h-2'>
//           <div
//             className={`absolute top-0 left-0 rounded-lg h-2 transition-all duration-500 ease-linear ${getProgressBarColor()}`}
//             style={{ width: `${calculateProgress()}%` }}
//           ></div>
//         </div>
//         <div className='col-span-2'>
//           <p className='text-lg'> {timeLeft}s</p>
//         </div>
//       </div>

//       <p className='text-lg mb-4'>{currentQuestion.question}</p>
//       <ul className='mb-4'>
//         {currentQuestion.options.map((option, index) => (
//           <li
//             key={index}
//             className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
//               lastSelectedOption.option === option
//                 ? lastSelectedOption.isCorrect
//                   ? 'bg-green-400'
//                   : 'bg-red-600'
//                 : 'bg-gray-100'
//             } hover:bg-gray-200`}
//             onClick={() =>
//               handleOptionSelect(option, option === currentQuestion.answer)
//             }
//           >
//             {option}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default QuizComponent;

// // import { useCallback, useEffect, useState } from 'react';

// // const QuizComponent = ({ questions }) => {
// //   const [state, setState] = useState({
// //     currentQuestionIndex: 0,
// //     timeLeft: 0,
// //     selectedOption: '',
// //     isAnswered: false,
// //     score: 0,
// //     lastSelectedOption: { option: '', isCorrect: null }
// //   });
// //   const [quizHistory, setQuizHistory] = useState([]);
// //   const [cardBackgroundColor, setCardBackgroundColor] = useState('bg-white');

// //   const {
// //     currentQuestionIndex,
// //     timeLeft,
// //     selectedOption,
// //     isAnswered,
// //     score,
// //     lastSelectedOption
// //   } = state;
// //   const currentQuestion = questions[currentQuestionIndex];

// //   useEffect(() => {
// //     if (currentQuestionIndex < questions.length) {
// //       setState(prevState => ({
// //         ...prevState,
// //         timeLeft: questions[currentQuestionIndex].time_limit_seconds
// //       }));
// //     }
// //   }, [currentQuestionIndex, questions]);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       if (timeLeft > 0 && !isAnswered) {
// //         setState(prevState => ({ ...prevState, timeLeft: timeLeft - 1 }));
// //       } else if (!isAnswered) {
// //         setCardBackgroundColor('bg-red-600');
// //         handleAnswer(false);
// //       }
// //     }, 1000);

// //     return () => clearTimeout(timer);
// //   }, [timeLeft, isAnswered]);

// //   const handleAnswer = useCallback(
// //     isCorrect => {
// //       if (!isAnswered) {
// //         setState(prevState => ({
// //           ...prevState,
// //           isAnswered: true,
// //           score: isCorrect ? score + 1 : score,
// //           lastSelectedOption: { option: selectedOption, isCorrect }
// //         }));
// //         setQuizHistory(prevHistory => [
// //           ...prevHistory,
// //           {
// //             question: currentQuestion.question,
// //             answer: selectedOption,
// //             isCorrect
// //           }
// //         ]);
// //         // Reset the card background color after a delay
// //         setTimeout(() => setCardBackgroundColor('bg-white'), 1000);
// //         setTimeout(goToNextQuestion, 1000);
// //       }
// //     },
// //     [isAnswered, score, selectedOption, currentQuestion]
// //   );

// //   const goToNextQuestion = useCallback(() => {
// //     if (currentQuestionIndex < questions.length - 1) {
// //       setState(prevState => ({
// //         ...prevState,
// //         currentQuestionIndex: currentQuestionIndex + 1,
// //         isAnswered: false,
// //         selectedOption: '',
// //         lastSelectedOption: { option: '', isCorrect: null }
// //       }));
// //     } else {
// //       // Increment currentQuestionIndex by one to trigger the rendering of the quiz history
// //       setState(prevState => ({
// //         ...prevState,
// //         currentQuestionIndex: currentQuestionIndex + 1
// //       }));
// //       console.log('End of quiz');
// //     }
// //   }, [currentQuestionIndex, questions.length]);

// //   const handleOptionSelect = useCallback(
// //     (option, isCorrect) => {
// //       if (!isAnswered) {
// //         setState(prevState => ({
// //           ...prevState,
// //           selectedOption: option
// //         }));
// //         // Update the card background color based on the answer
// //         setCardBackgroundColor(isCorrect ? 'bg-green-400' : 'bg-red-600');
// //         handleAnswer(isCorrect);
// //       }
// //     },
// //     [isAnswered]
// //   );

// //   const calculateProgress = useCallback(() => {
// //     const questionTimeLimit =
// //       questions[currentQuestionIndex].time_limit_seconds;
// //     return ((timeLeft / questionTimeLimit) * 100).toFixed(2);
// //   }, [timeLeft, currentQuestionIndex, questions]);

// //   const getProgressBarColor = useCallback(() => {
// //     const questionTimeLimit =
// //       questions[currentQuestionIndex].time_limit_seconds;
// //     const timePercentage = (timeLeft / questionTimeLimit) * 100;

// //     if (timePercentage > 75) {
// //       return 'bg-green-500'; // Green for more than 75% remaining
// //     } else if (timePercentage > 25) {
// //       return 'bg-yellow-500'; // Yellow for more than 25% remaining
// //     } else {
// //       return 'bg-red-500'; // Red for 25% or less remaining
// //     }
// //   }, [timeLeft, currentQuestionIndex, questions]);

// //   if (currentQuestionIndex === questions.length) {
// //     return (
// //       <div className='max-w-md min-w-[300px] lg:min-w-[500px] mx-auto p-6 bg-white rounded-lg shadow-lg'>
// //         <h1 className='text-2xl font-bold mb-4'>Quiz History</h1>
// //         <p className='text-lg mb-4'>Your score: {score}</p>
// //         <ul className='mb-4'>
// //           {quizHistory.map((item, index) => (
// //             <li
// //               key={index}
// //               className={`mb-2 ${
// //                 item.isCorrect ? 'text-green-500' : 'text-red-500'
// //               }`}
// //             >
// //               {item.question}: {item.answer} -{' '}
// //               {item.isCorrect ? 'Correct' : 'Wrong'}
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div
// //       className={`max-w-md min-w-[300px] lg:min-w-[500px] mx-auto p-6 rounded-lg shadow-lg ${cardBackgroundColor}`}
// //     >
// //       <div className='flex items-center justify-between mb-4'>
// //         <h1 className='text-2xl font-bold '>
// //           Question {currentQuestionIndex + 1}
// //         </h1>
// //         <p className='text-2xl'>Score: {score}</p>
// //       </div>
// //       <div className='grid grid-cols-12 items-center gap-4'>
// //         <div className='col-span-10 relative w-full bg-gray-200 rounded-lg h-2'>
// //           <div
// //             className={`absolute top-0 left-0 rounded-lg h-2 transition-all duration-500 ease-linear ${getProgressBarColor()}`}
// //             style={{ width: `${calculateProgress()}%` }}
// //           ></div>
// //         </div>
// //         <div className='col-span-2'>
// //           <p className='text-lg'> {timeLeft}s</p>
// //         </div>
// //       </div>

// //       <p className='text-lg mb-4'>{currentQuestion.question}</p>
// //       <ul className='mb-4'>
// //         {currentQuestion.options.map((option, index) => (
// //           <li
// //             key={index}
// //             className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
// //               lastSelectedOption.option === option
// //                 ? lastSelectedOption.isCorrect
// //                   ? 'bg-green-400'
// //                   : 'bg-red-600'
// //                 : 'bg-gray-100'
// //             } hover:bg-gray-200`}
// //             onClick={() =>
// //               handleOptionSelect(option, option === currentQuestion.answer)
// //             }
// //           >
// //             {option}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default QuizComponent;

// // // import { useState, useEffect, useCallback } from 'react';

// // // const QuizComponent = ({ questions }) => {
// // //  const [state, setState] = useState({
// // //     currentQuestionIndex: 0,
// // //     timeLeft: 0,
// // //     selectedOption: '',
// // //     isAnswered: false,
// // //     score: 0,
// // //     lastSelectedOption: { option: '', isCorrect: null },
// // //  });

// // //  const { currentQuestionIndex, timeLeft, selectedOption, isAnswered, score, lastSelectedOption } = state;

// // //  useEffect(() => {
// // //     if (currentQuestionIndex < questions.length) {
// // //       setState(prevState => ({
// // //         ...prevState,
// // //         timeLeft: questions[currentQuestionIndex].time_limit_seconds,
// // //       }));
// // //     }
// // //  }, [currentQuestionIndex, questions]);

// // //  useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       if (timeLeft > 0 && !isAnswered) {
// // //         setState(prevState => ({ ...prevState, timeLeft: timeLeft - 1 }));
// // //       } else if (!isAnswered) {
// // //         handleAnswer(false);
// // //       }
// // //     }, 1000);

// // //     return () => clearTimeout(timer);
// // //  }, [timeLeft, isAnswered]);

// // //  const handleAnswer = useCallback((isCorrect) => {
// // //     if (!isAnswered) {
// // //       setState(prevState => ({
// // //         ...prevState,
// // //         isAnswered: true,
// // //         score: isCorrect ? score + 1 : score,
// // //         lastSelectedOption: { option: selectedOption, isCorrect },
// // //       }));
// // //       setTimeout(goToNextQuestion, 1000);
// // //     }
// // //  }, [isAnswered, score, selectedOption]);

// // //  const goToNextQuestion = useCallback(() => {
// // //     if (currentQuestionIndex < questions.length - 1) {
// // //       setState(prevState => ({
// // //         ...prevState,
// // //         currentQuestionIndex: currentQuestionIndex + 1,
// // //         isAnswered: false,
// // //         selectedOption: '',
// // //         lastSelectedOption: { option: '', isCorrect: null },
// // //       }));
// // //     } else {
// // //       console.log('End of quiz');
// // //     }
// // //  }, [currentQuestionIndex, questions.length]);

// // //  const handleOptionSelect = useCallback((option, isCorrect) => {
// // //     if (!isAnswered) {
// // //       setState(prevState => ({
// // //         ...prevState,
// // //         selectedOption: option,
// // //       }));
// // //       handleAnswer(isCorrect);
// // //     }
// // //  }, [isAnswered]);

// // //  const currentQuestion = questions[currentQuestionIndex];

// // //  const calculateProgress = useCallback(() => {
// // //     const questionTimeLimit = questions[currentQuestionIndex].time_limit_seconds;
// // //     return ((timeLeft / questionTimeLimit) * 100).toFixed(2);
// // //  }, [timeLeft, currentQuestionIndex, questions]);

// // //  return (
// // //     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
// // //       <h1 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1}</h1>
// // //       <p className="text-lg mb-4">{currentQuestion.question}</p>
// // //       <ul className="mb-4">
// // //         {currentQuestion.options.map((option, index) => (
// // //           <li key={index}
// // //               className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${lastSelectedOption.option === option ? (lastSelectedOption.isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-100'} hover:bg-gray-200`}
// // //               onClick={() => handleOptionSelect(option, option === currentQuestion.answer)}>
// // //             {option}
// // //           </li>
// // //         ))}
// // //       </ul>
// // //       <div className="relative w-full bg-gray-200 rounded-lg h-4">
// // //         <div className="absolute top-0 left-0 bg-blue-500 rounded-lg h-4" style={{ width: `${calculateProgress()}%` }}></div>
// // //       </div>
// // //       <p className="text-lg">Time Left: {timeLeft} seconds</p>
// // //       <p className="text-lg">Score: {score}</p>
// // //     </div>
// // //  );
// // // };

// // // export default QuizComponent;

// // // // import { useState, useEffect, useCallback } from 'react';

// // // // const QuizComponent = ({ questions }) => {
// // // //  const [state, setState] = useState({
// // // //     currentQuestionIndex: 0,
// // // //     timeLeft: 0,
// // // //     selectedOption: '',
// // // //     isAnswered: false,
// // // //     score: 0,
// // // //  });

// // // //  const { currentQuestionIndex, timeLeft, selectedOption, isAnswered, score } = state;

// // // //  useEffect(() => {
// // // //     if (currentQuestionIndex < questions.length) {
// // // //       setState(prevState => ({
// // // //         ...prevState,
// // // //         timeLeft: questions[currentQuestionIndex].time_limit_seconds,
// // // //       }));
// // // //     }
// // // //  }, [currentQuestionIndex, questions]);

// // // //  useEffect(() => {
// // // //     const timer = setTimeout(() => {
// // // //       if (timeLeft > 0 && !isAnswered) {
// // // //         setState(prevState => ({ ...prevState, timeLeft: timeLeft - 1 }));
// // // //       } else if (!isAnswered) {
// // // //         handleAnswer(false);
// // // //       }
// // // //     }, 1000);

// // // //     return () => clearTimeout(timer);
// // // //  }, [timeLeft, isAnswered]);

// // // //  const handleAnswer = useCallback((isCorrect) => {
// // // //     if (!isAnswered) {
// // // //       setState(prevState => ({
// // // //         ...prevState,
// // // //         isAnswered: true,
// // // //         score: isCorrect ? score + 1 : score,
// // // //       }));
// // // //       setTimeout(goToNextQuestion, 1000);
// // // //     }
// // // //  }, [isAnswered, score]);

// // // //  const goToNextQuestion = useCallback(() => {
// // // //     if (currentQuestionIndex < questions.length - 1) {
// // // //       setState(prevState => ({
// // // //         ...prevState,
// // // //         currentQuestionIndex: currentQuestionIndex + 1,
// // // //         isAnswered: false,
// // // //         selectedOption: '',
// // // //       }));
// // // //     } else {
// // // //       console.log('End of quiz');
// // // //     }
// // // //  }, [currentQuestionIndex, questions.length]);

// // // //  const handleOptionSelect = useCallback((option, isCorrect) => {
// // // //     if (!isAnswered) {
// // // //       setState(prevState => ({
// // // //         ...prevState,
// // // //         selectedOption: option,
// // // //       }));
// // // //       handleAnswer(isCorrect);
// // // //     }
// // // //  }, [isAnswered]);

// // // //  const currentQuestion = questions[currentQuestionIndex];

// // // //  const calculateProgress = useCallback(() => {
// // // //     const questionTimeLimit = questions[currentQuestionIndex].time_limit_seconds;
// // // //     return ((timeLeft / questionTimeLimit) * 100).toFixed(2);
// // // //  }, [timeLeft, currentQuestionIndex, questions]);

// // // //  return (
// // // //     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
// // // //       <h1 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1}</h1>
// // // //       <p className="text-lg mb-4">{currentQuestion.question}</p>
// // // //       <ul className="mb-4">
// // // //         {currentQuestion.options.map((option, index) => (
// // // //           <li key={index} className="cursor-pointer py-2 px-4 mb-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => handleOptionSelect(option, option === currentQuestion.answer)}>
// // // //             {option}
// // // //           </li>
// // // //         ))}
// // // //       </ul>
// // // //       <div className="relative w-full bg-gray-200 rounded-lg h-4">
// // // //         <div className="absolute top-0 left-0 bg-blue-500 rounded-lg h-4" style={{ width: `${calculateProgress()}%` }}></div>
// // // //       </div>
// // // //       <p className="text-lg">Time Left: {timeLeft} seconds</p>
// // // //       <p className="text-lg">Score: {score}</p>
// // // //     </div>
// // // //  );
// // // // };

// // // // export default QuizComponent;

// // // // // import { useState, useEffect } from 'react';

// // // // // const QuizComponent = ({ questions }) => {
// // // // //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// // // // //   const [timeLeft, setTimeLeft] = useState(0);
// // // // //   const [selectedOption, setSelectedOption] = useState('');
// // // // //   const [isAnswered, setIsAnswered] = useState(false);
// // // // //   const [score, setScore] = useState(0);

// // // // //   useEffect(() => {
// // // // //     if (currentQuestionIndex < questions.length) {
// // // // //       setTimeLeft(questions[currentQuestionIndex].time_limit_seconds);
// // // // //     }
// // // // //   }, [currentQuestionIndex, questions]);

// // // // //   useEffect(() => {
// // // // //     const timer = setTimeout(() => {
// // // // //       if (timeLeft > 0 && !isAnswered) {
// // // // //         setTimeLeft(timeLeft - 1);
// // // // //       } else {
// // // // //         if (!isAnswered) {
// // // // //           handleAnswer(false);
// // // // //         }
// // // // //       }
// // // // //     }, 1000);

// // // // //     return () => clearTimeout(timer);
// // // // //   }, [timeLeft, isAnswered]);

// // // // //   const handleAnswer = (isCorrect) => {
// // // // //     if (!isAnswered) {
// // // // //       setIsAnswered(true);
// // // // //       if (isCorrect) {
// // // // //         setScore(score + 1);
// // // // //       }
// // // // //       setTimeout(goToNextQuestion, 1000); // Wait for 1 second before moving to the next question
// // // // //     }
// // // // //   };

// // // // //   const goToNextQuestion = () => {
// // // // //     if (currentQuestionIndex < questions.length - 1) {
// // // // //       setCurrentQuestionIndex(currentQuestionIndex + 1);
// // // // //       setIsAnswered(false);
// // // // //       setSelectedOption('');
// // // // //     } else {
// // // // //       // End of quiz
// // // // //       // You can handle what to do when the quiz ends
// // // // //       console.log('End of quiz');
// // // // //     }
// // // // //   };

// // // // //   const handleOptionSelect = (option, isCorrect) => {
// // // // //     if (!isAnswered) {
// // // // //       setSelectedOption(option);
// // // // //       handleAnswer(isCorrect);
// // // // //     }
// // // // //   };

// // // // //   const currentQuestion = questions[currentQuestionIndex];

// // // // //   const calculateProgress = () => {
// // // // //     return ((timeLeft / questions[currentQuestionIndex].time_limit_seconds) * 100).toFixed(2);
// // // // //   };

// // // // //   return (
// // // // //     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
// // // // //     <h1 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1}</h1>
// // // // //     <p className="text-lg mb-4">{currentQuestion.question}</p>
// // // // //     <ul className="mb-4">
// // // // //       {currentQuestion.options.map((option, index) => (
// // // // //         <li key={index} className="cursor-pointer py-2 px-4 mb-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => handleOptionSelect(option, option === currentQuestion.answer)}>
// // // // //           {option}
// // // // //         </li>
// // // // //       ))}
// // // // //     </ul>
// // // // //     <div className="relative w-full bg-gray-200 rounded-lg h-4">
// // // // //         <div className="absolute top-0 left-0 bg-blue-500 rounded-lg h-4" style={{ width: `${calculateProgress()}%` }}></div>
// // // // //       </div>
// // // // //     <p className="text-lg">Time Left: {timeLeft} seconds</p>
// // // // //     <p className="text-lg">Score: {score}</p>
// // // // //   </div>
// // // // //   );
// // // // // };

// // // // // export default QuizComponent;
