const QuestionOptions = ({
  question,
  options,
  selectedOption,
  handleOptionSelect
}) => {
  return (
    <ul className='mb-4'>
      {options.map((option, index) => (
        <li
          key={option._id}
          className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
            selectedOption.includes(index) ? 'bg-green-400' : 'bg-gray-100'
          } hover:bg-gray-200`}
          onClick={() => handleOptionSelect(index, option)}
        >
          {option.title}
        </li>
      ))}
    </ul>
  );
};

export default QuestionOptions;
