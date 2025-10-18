import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";

const MOOD_TRACKS: Record<string, { src: string; color: string; label: string }> = {
  "Very Bad": {
    src: "/assets/music/calming-piano.mp3",
    color: "from-blue-400 to-blue-700",
    label: "Calming Piano"
  },
  "Bad": {
    src: "/assets/music/calming-piano.mp3",
    color: "from-blue-400 to-blue-700",
    label: "Calming Piano"
  },
  "Okay": {
    src: "/assets/music/focus-upbeat.mp3",
    color: "from-teal-400 to-teal-600",
    label: "Gentle Upbeat"
  },
  "Good": {
    src: "/assets/music/positive-energy.mp3",
    color: "from-green-400 to-green-600",
    label: "Positive Energy"
  },
  "Excellent": {
    src: "/assets/music/positive-energy.mp3",
    color: "from-green-400 to-green-600",
    label: "Positive Energy"
  }
};

export interface MoodMusicPlayerProps {
  mood: string;
  supportType: string;
  onRelaxation?: (delta: number) => void;
}

const MoodMusicPlayer: React.FC<MoodMusicPlayerProps> = ({ mood, supportType, onRelaxation }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showControls, setShowControls] = useState(false);
  const [relaxDelta, setRelaxDelta] = useState<number | null>(null);
  const howlRef = useRef<Howl | null>(null);
  const prevMood = useRef<string | null>(null);

  useEffect(() => {
    // Stop previous track
    if (howlRef.current) {
      howlRef.current.fade(volume, 0, 800);
      setTimeout(() => howlRef.current?.stop(), 900);
    }
    // Play new track
    const track = MOOD_TRACKS[mood];
    if (track) {
      howlRef.current = new Howl({
        src: [track.src],
        volume,
        loop: true,
        html5: true,
        onplay: () => setPlaying(true),
        onend: () => setPlaying(false),
        onstop: () => setPlaying(false)
      });
      howlRef.current.fade(0, volume, 1200);
      howlRef.current.play();
      setPlaying(true);
      setShowControls(true);
      // Simulate relaxation delta
      if (prevMood.current && prevMood.current !== mood) {
        setRelaxDelta(7); // 7% improvement
        onRelaxation?.(7);
      } else {
        setRelaxDelta(null);
      }
      prevMood.current = mood;
    }
    return () => {
      howlRef.current?.stop();
      setPlaying(false);
    };
    // eslint-disable-next-line
  }, [mood, supportType]);

  useEffect(() => {
    howlRef.current?.volume(volume);
  }, [volume]);

  const handleToggle = () => {
    if (playing) {
      howlRef.current?.fade(volume, 0, 800);
      setTimeout(() => {
        howlRef.current?.pause();
        setPlaying(false);
      }, 900);
    } else {
      howlRef.current?.play();
      howlRef.current?.fade(0, volume, 1200);
      setPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(
        "fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2",
        "bg-gradient-to-br p-4 rounded-2xl shadow-xl border border-primary",
        MOOD_TRACKS[mood]?.color || "from-blue-400 to-blue-700"
      )}
      style={{ minWidth: 260 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.8, boxShadow: "0 0 0 0 #00bcd4" }}
          animate={{ scale: playing ? 1.1 : 1, boxShadow: playing ? "0 0 24px 4px #00bcd4" : "0 0 0 0 #00bcd4" }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center"
        >
          <span className="text-white text-lg font-bold">🎵</span>
        </motion.div>
        <div>
          <div className="font-semibold text-white">{MOOD_TRACKS[mood]?.label || "Mood Music"}</div>
          <div className="text-xs text-white/80">{supportType} Support</div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleToggle}
          className="p-2 rounded-full bg-primary/80 hover:bg-primary/90 text-white"
        >
          {playing ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="w-24 accent-primary"
        />
      </div>
      <AnimatePresence>
        {relaxDelta && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 text-sm text-white font-medium"
          >
            You seem {relaxDelta}% calmer than before! 😊
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MoodMusicPlayer;
