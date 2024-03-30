// CheckBoxQuestion.js

const CheckBoxQuestion = ({
  options,
  selectedOptions,
  handleCheckboxSelect,
  handleSubmit
}) => {
  return (
    <div className='mb-4'>
      <ul>
        {options.map((option, index) => (
          <li
            key={option._id}
            className={`flex items-center cursor-pointer py-2 px-4 mb-2 rounded-lg ${
              selectedOptions.includes(index) ? 'bg-green-400' : 'bg-gray-100'
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
        onClick={handleSubmit}
        className='mt-2 p-2 bg-blue-500 text-white rounded-lg w-full'
      >
        Submit
      </button>
    </div>
  );
};

export default CheckBoxQuestion;
