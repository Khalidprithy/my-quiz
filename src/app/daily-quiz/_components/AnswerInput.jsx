const AnswerInput = ({ userInput, handleInputChange, handleSubmit }) => {
  return (
    <div className='mb-4'>
      <input
        type='text'
        value={userInput}
        onChange={handleInputChange}
        className='w-full p-2 border border-gray-300 rounded-lg'
        placeholder='Type your answer here...'
      />
      <button
        onClick={handleSubmit}
        className='mt-2 p-2 bg-blue-500 text-white rounded-lg w-full'
      >
        Submit
      </button>
    </div>
  );
};

export default AnswerInput;
