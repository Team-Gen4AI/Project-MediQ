import { useState } from "react";
import { motion } from "framer-motion";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Paris", "Rome", "Madrid"],
    answer: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1,
  },
];

const TriviaGame: React.FC<{ onComplete: (feedback: string) => void }> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (idx: number) => {
    if (idx === questions[current].answer) setScore(score + 1);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete(`Trivia complete! Score: ${score + (idx === questions[current].answer ? 1 : 0)}/${questions.length}`);
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold mb-2">{questions[current].question}</h3>
      <div className="grid gap-2">
        {questions[current].options.map((opt, idx) => (
          <button
            key={idx}
            className="px-4 py-2 bg-secondary rounded hover:bg-primary/20 transition"
            onClick={() => handleAnswer(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default TriviaGame;
