import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BreathingGame: React.FC<{ onComplete: (feedback: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = ["Inhale", "Hold", "Exhale", "Hold"];
  const durations = [4000, 2000, 4000, 2000];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => setStep(step + 1), durations[step]);
      return () => clearTimeout(timer);
    } else {
      onComplete("Completed breathing exercise");
    }
  }, [step]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold"
        animate={{ scale: step % 2 === 0 ? 1.2 : 0.8 }}
        transition={{ duration: durations[step] / 1000 }}
      >
        {steps[step] || "Done!"}
      </motion.div>
      <p className="mt-4 text-muted-foreground">Follow the rhythm to relax.</p>
    </motion.div>
  );
};

export default BreathingGame;
