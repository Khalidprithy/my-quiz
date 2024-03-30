import QuizComponent from '@/components/QuizComponent';

export default function Page() {


  const questions = [
    {
      "_id": "1",
      "question": "What do you call a group of kangaroos jumping in the same direction?",
      "type": "multiple",
      "answer": [0],
      "options": [
        { "title": "A hop", "_id": "1" },
        { "title": "A bounce", "_id": "2" },
        { "title": "A leap", "_id": "3" },
        { "title": "A jump", "_id": "4" }
      ],
      "duration": 20
    },
    {
      "_id": "66082ec8b89ce4cecbd543ab",
      "question": "Virtus subvenio votum derelinquo animus ultio ex amitto voluntarius succurro.",
      "type": "checkbox",
      "answer": [
        2,
        3
      ],
      "options": [
        {

          "title": "totidem",
          "_id": "66082ec8b89ce4cecbd543ac"
        },
        {

          "title": "canis",
          "_id": "66082ec8b89ce4cecbd543ad"
        },
        {

          "title": "amitto",
          "_id": "66082ec8b89ce4cecbd543ae"
        },
        {

          "title": "culpo",
          "_id": "66082ec8b89ce4cecbd543af"
        }
      ],
      "duration": 25,
    },
    {
      "_id": "2",
      "question": "Why don't scientists trust atoms?",
      "type": "multiple",
      "answer": [0],
      "options": [
        { "title": "Because they make up everything", "_id": "1" },
        { "title": "Because they have a lot of electrons", "_id": "2" },
        { "title": "Because they are always ionized", "_id": "3" },
        { "title": "Because they are unstable", "_id": "4" }
      ],
      "duration": 18
    },
    {
      "_id": "3",
      "question": "What do you call a snowman with a six-pack?",
      "type": "multiple",
      "answer": [0],
      "options": [
        { "title": "A cool guy", "_id": "1" },
        { "title": "A hot chocolate", "_id": "2" },
        { "title": "A cold beverage", "_id": "3" },
        { "title": "A hot drink", "_id": "4" }
      ],
      "duration": 12
    },
    {
      "_id": "4",
      "question": "Why did the scarecrow win an award?",
      "type": "trueFalse",
      "answer": [0],
      "options": [
        { "title": "True", "_id": "1" },
        { "title": "False", "_id": "2" }
      ],
      "duration": 50
    },
    {
      "_id": "5",
      "question": "Why don't some fish play piano?",
      "type": "trueFalse",
      "answer": [1],
      "options": [
        { "title": "Yes", "_id": "1" },
        { "title": "No", "_id": "2" }
      ],
      "duration": 45
    },
    {
      "_id": "6",
      "question": "Why was the math book sad?",
      "type": "trueFalse",
      "answer": [0],
      "options": [
        { "title": "True", "_id": "1" },
        { "title": "False", "_id": "2" }
      ],
      "duration": 60
    },
    {
      "_id": "7",
      "question": "What's the best thing about Switzerland?",
      "type": "open",
      "answer": [],
      "options": [],
      "duration": 90
    },
    {
      "_id": "8",
      "question": "Why don't scientists trust atoms?",
      "type": "open",
      "answer": [],
      "options": [],
      "duration": 120
    },
    {
      "_id": "9",
      "question": "What's the best thing about Switzerland?",
      "type": "open",
      "answer": [],
      "options": [],
      "duration": 150
    },
    {
      "_id": "10",
      "question": "Fill in the blank: The capital of France is ________.",
      "type": "blank",
      "options": [
        {
          "title": "Paris",
          "type": "exact",
          "_id": "1"
        },
        {
          "title": "London",
          "type": "contains",
          "_id": "2"
        },
        {
          "title": "Berlin",
          "type": "contains",
          "_id": "3"
        },
        {
          "title": "Madrid",
          "type": "contains",
          "_id": "4"
        }
      ],
      "duration": 30
    },
    {
      "_id": "11",
      "question": "Fill in the blank: The capital of Italy is ________.",
      "type": "blank",
      "options": [
        {
          "title": "Rome",
          "type": "exact",
          "_id": "1"
        },
        {
          "title": "Paris",
          "type": "contains",
          "_id": "2"
        },
        {
          "title": "Berlin",
          "type": "contains",
          "_id": "3"
        },
        {
          "title": "Madrid",
          "type": "contains",
          "_id": "4"
        }
      ],
      "duration": 30
    },
    {
      "_id": "12",
      "question": "Fill in the blank: The currency of Japan is ________.",
      "type": "blank",
      "options": [
        {
          "title": "Yen",
          "type": "exact",
          "_id": "1"
        },
        {
          "title": "Dollar",
          "type": "contains",
          "_id": "2"
        },
        {
          "title": "Euro",
          "type": "contains",
          "_id": "3"
        },
        {
          "title": "Pound",
          "type": "contains",
          "_id": "4"
        }
      ],
      "duration": 30
    }
  ];


  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // shuffleArray(questions)

  return (
    <div className="flex justify-center items-center h-screen p-2 bg-gray-800">
      <div>
        <QuizComponent questions={questions} />
      </div>
    </div>
  )
}
