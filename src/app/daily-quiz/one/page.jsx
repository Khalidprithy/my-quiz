import Quiz from '../_components/Quiz';

export default function page() {
  const questions = [
    {
      _id: '10',
      question: 'Fill in the blank: The capital of Germany is ________.',
      type: 'blank',
      options: [
        { title: 'Berlin', type: 'exact', _id: '1' },
        { title: 'Paris', type: 'contains', _id: '2' },
        { title: 'London', type: 'contains', _id: '3' },
        { title: 'Rome', type: 'contains', _id: '4' }
      ],
      duration: 30
    },
    {
      _id: '7',
      question: 'What is the largest planet in our solar system?',
      type: 'open',
      answer: [],
      options: [],
      duration: 60
    },
    {
      _id: '3',
      question: 'What is the capital of Japan?',
      type: 'multiple',
      answer: [3],
      options: [
        { title: 'Beijing', _id: '1' },
        { title: 'Seoul', _id: '2' },
        { title: 'Taipei', _id: '3' },
        { title: 'Tokyo', _id: '4' }
      ],
      duration: 18
    },
    {
      _id: '6',
      question: 'What is the chemical symbol for iron?',
      type: 'trueFalse',
      answer: [0],
      options: [
        { title: 'True', _id: '1' },
        { title: 'False', _id: '2' }
      ],
      duration: 45
    },
    {
      _id: '9',
      question: 'Who wrote "The Great Gatsby"?',
      type: 'open',
      answer: [],
      options: [],
      duration: 120
    },
    {
      _id: '4',
      question: 'What is the boiling point of water in Celsius?',
      type: 'multiple',
      answer: [1],
      options: [
        { title: '100°C', _id: '1' },
        { title: '0°C', _id: '2' },
        { title: '50°C', _id: '3' },
        { title: '-10°C', _id: '4' }
      ],
      duration: 12
    },
    {
      _id: '5',
      question: 'What is the capital of Brazil?',
      type: 'trueFalse',
      answer: [1],
      options: [
        { title: 'True', _id: '1' },
        { title: 'False', _id: '2' }
      ],
      duration: 50
    },
    {
      _id: '2',
      question: 'Who wrote "Hamlet"?',
      type: 'multiple',
      answer: [0],
      options: [
        { title: 'William Shakespeare', _id: '1' },
        { title: 'Charles Dickens', _id: '2' },
        { title: 'Jane Austen', _id: '3' },
        { title: 'Mark Twain', _id: '4' }
      ],
      duration: 25
    },
    {
      _id: '8',
      question: 'What is the currency of India?',
      type: 'open',
      answer: [],
      options: [],
      duration: 90
    },
    {
      _id: '1',
      question: 'What is the chemical formula of water?',
      type: 'multiple',
      answer: [2],
      options: [
        { title: 'H2O', _id: '1' },
        { title: 'CO2', _id: '2' },
        { title: 'NaCl', _id: '3' },
        { title: 'O2', _id: '4' }
      ],
      duration: 20
    }
  ];

  return (
    <div className='flex justify-center items-center h-screen p-2 bg-gray-800'>
      <Quiz questions={questions} />
    </div>
  );
}
