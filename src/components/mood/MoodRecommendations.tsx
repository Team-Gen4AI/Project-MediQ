import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MoodRecommendationsProps {
  mood: string;
  feedback: string;
}

const getRecommendations = async (mood: string, feedback: string) => {
  // Replace with Gemini API or rule-based logic
  // For demo, use static recommendations
  if (mood === "Very Bad" || mood === "Bad") {
    return ["Try a 5-minute mindfulness exercise", "Listen to calming music"];
  }
  if (mood === "Okay") {
    return ["Solve a puzzle to engage your mind", "Take a short walk"];
  }
  if (mood === "Good" || mood === "Excellent") {
    return ["Share your gratitude with a friend", "Do 10 jumping jacks!"];
  }
  return ["Stay positive!"];
};

const MoodRecommendations: React.FC<MoodRecommendationsProps> = ({ mood, feedback }) => {
  const [recs, setRecs] = useState<string[]>([]);

  useEffect(() => {
    getRecommendations(mood, feedback).then(setRecs);
  }, [mood, feedback]);

  return (
    <motion.div
      className="mt-6 p-4 rounded-lg bg-secondary/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="font-bold mb-2">Personalized Recommendations</h4>
      <ul className="list-disc ml-6">
        {recs.map((rec, idx) => (
          <li key={idx}>{rec}</li>
        ))}
      </ul>
      {feedback && <p className="mt-2 text-muted-foreground">Game feedback: {feedback}</p>}
    </motion.div>
  );
};

export default MoodRecommendations;
