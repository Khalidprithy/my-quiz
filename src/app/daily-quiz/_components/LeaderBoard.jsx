// LeaderBoard.js

const LeaderBoard = ({ quizHistory, score }) => {
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
};

export default LeaderBoard;
