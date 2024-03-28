import QuizComponent from '@/components/QuizComponent'

export default function Page() {


  const questions = [
    {
      "question": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"],
      "answer": "Paris",
      "time_limit_seconds": 15
    },
    {
      "question": "Which planet is known as the Red Planet?",
      "options": ["Mars", "Venus", "Jupiter", "Saturn"],
      "answer": "Mars",
      "time_limit_seconds": 20
    },
    {
      "question": "Who wrote 'To Kill a Mockingbird'?",
      "options": ["Harper Lee", "J.K. Rowling", "Stephen King", "Mark Twain"],
      "answer": "Harper Lee",
      "time_limit_seconds": 18
    },
    {
      "question": "What is the chemical symbol for water?",
      "options": ["H2O", "CO2", "NaCl", "O2"],
      "answer": "H2O",
      "time_limit_seconds": 12
    },
    {
      "question": "What is the largest ocean on Earth?",
      "options": ["Atlantic", "Indian", "Pacific", "Arctic"],
      "answer": "Pacific",
      "time_limit_seconds": 25
    },
    {
      "question": "Who painted the Mona Lisa?",
      "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      "answer": "Leonardo da Vinci",
      "time_limit_seconds": 20
    },
    {
      "question": "What is the main ingredient in guacamole?",
      "options": ["Tomato", "Avocado", "Onion", "Garlic"],
      "answer": "Avocado",
      "time_limit_seconds": 15
    },
    {
      "question": "Which country is home to the kangaroo?",
      "options": ["Australia", "Brazil", "Canada", "South Africa"],
      "answer": "Australia",
      "time_limit_seconds": 18
    },
    {
      "question": "Who is credited with inventing the telephone?",
      "options": ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Albert Einstein"],
      "answer": "Alexander Graham Bell",
      "time_limit_seconds": 20
    },
    {
      "question": "Which famous scientist formulated the theory of relativity?",
      "options": ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Galileo Galilei"],
      "answer": "Albert Einstein",
      "time_limit_seconds": 22
    }
  ]


  return (
    <div className="flex justify-center items-center h-screen p-2 bg-gray-800">
      <div>
        <QuizComponent questions={questions} />
      </div>
    </div>
  )
}
