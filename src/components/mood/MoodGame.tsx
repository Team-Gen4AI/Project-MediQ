import { MoodType } from "./types";
import BreathingGame from "./BreathingGame";
import GratitudeChallenge from "./GratitudeChallenge";
import TriviaGame from "./TriviaGame";

interface MoodGameProps {
  mood: MoodType;
  onGameComplete: (feedback: string) => void;
}

const MoodGame: React.FC<MoodGameProps> = ({ mood, onGameComplete }) => {
  if (mood === "Very Bad" || mood === "Bad") {
    return <BreathingGame onComplete={onGameComplete} />;
  }
  if (mood === "Okay") {
    return <TriviaGame onComplete={onGameComplete} />;
  }
  if (mood === "Good" || mood === "Excellent") {
    return <GratitudeChallenge onComplete={onGameComplete} />;
  }
  return null;
};

export default MoodGame;
