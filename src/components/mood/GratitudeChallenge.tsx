import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GratitudeChallenge: React.FC<{ onComplete: (feedback: string) => void }> = ({ onComplete }) => {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      setItems([...items, input.trim()]);
      setInput("");
    }
  };

  useEffect(() => {
    if (items.length === 3) {
      onComplete("Gratitude challenge complete!");
    }
  }, [items]);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold mb-2">List 3 things you're grateful for:</h3>
      <div className="flex gap-2 mb-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type here..."
        />
        <button className="bg-primary text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
      </div>
      <ul className="list-disc ml-6">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
};

export default GratitudeChallenge;
