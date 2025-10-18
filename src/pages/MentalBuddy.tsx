import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import MoodGame from "@/components/mood/MoodGame";
import MoodRecommendations from "@/components/mood/MoodRecommendations";
import { MoodType } from "@/components/mood/types";

const moodOptions: { value: number; emoji: string; label: MoodType; color: string }[] = [
  { value: 1, emoji: "😢", label: "Very Bad", color: "from-red-500 to-red-600" },
  { value: 2, emoji: "😕", label: "Bad", color: "from-orange-500 to-orange-600" },
  { value: 3, emoji: "😐", label: "Okay", color: "from-yellow-500 to-yellow-600" },
  { value: 4, emoji: "🙂", label: "Good", color: "from-green-500 to-green-600" },
  { value: 5, emoji: "😊", label: "Excellent", color: "from-emerald-500 to-emerald-600" },
];

const getSupportText = (mood: MoodType) => {
  switch (mood) {
    case "Very Bad":
    case "Bad":
      return "Get Calming Support";
    case "Okay":
      return "Get Engaging Support";
    case "Good":
    case "Excellent":
      return "Get Positive Support";
    default:
      return "Get Personalized Support";
  }
};

// 🎵 Music samples for each mood
const moodMusicSamples: Record<
  MoodType,
  { name: string; url: string }[]
> = {
  "Very Bad": [
    { name: "Tomorrow (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-tomorrow.mp3" },
    { name: "Slow Motion (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3" },
  ],
  "Bad": [
    { name: "November (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-november.mp3" },
    { name: "Relaxing (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3" },
  ],
  "Okay": [
    { name: "Once Again (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-onceagain.mp3" },
    { name: "Sunny (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3" },
  ],
  "Good": [
    { name: "Happy Rock (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-happyrock.mp3" },
    { name: "Energy (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-energy.mp3" },
  ],
  "Excellent": [
    { name: "Funday (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-funday.mp3" },
    { name: "Ukulele (Bensound)", url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3" },
  ],
};

const MentalBuddy = () => {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFeedback, setGameFeedback] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMoodSelect = (value: number, label: MoodType) => {
    setMoodRating(value);
    setSelectedMood(label);
    setGameStarted(true);
    setShowRecommendations(false);
    setGameFeedback("");
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentSong(null);
  };

  const handleGameComplete = (feedback: string) => {
    setGameFeedback(feedback);
    setShowRecommendations(true);
  };

  const handlePlaySong = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.muted = isMuted;
    audio.play();

    setCurrentSong(url);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="card-medical mb-6 animate-fade-up">
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>
              Select your mood and let us help you feel better
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Mood Selection */}
            <div className="grid grid-cols-5 gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value, mood.label)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    moodRating === mood.value
                      ? `border-primary bg-gradient-to-br ${mood.color} text-white shadow-lg`
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <p className="text-xs font-medium">{mood.label}</p>
                </button>
              ))}
            </div>

            {/* Breathing / Game Section */}
            {gameStarted && selectedMood && (
              <MoodGame mood={selectedMood} onGameComplete={handleGameComplete} />
            )}

            {/* Recommendations */}
            {showRecommendations && selectedMood && (
              <MoodRecommendations mood={selectedMood} feedback={gameFeedback} />
            )}

            {/* Music Player Section */}
            {selectedMood && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3 text-center">
                  🎵 {getSupportText(selectedMood)} – Music Samples
                </h3>
                <ul className="space-y-2">
                  {moodMusicSamples[selectedMood].map((track) => (
                    <li
                      key={track.url}
                      className={`p-3 rounded-lg border hover:bg-secondary/20 cursor-pointer transition-all ${
                        currentSong === track.url ? "bg-secondary/30 border-primary" : "border-border"
                      }`}
                      onClick={() => handlePlaySong(track.url)}
                    >
                      {track.name}
                    </li>
                  ))}
                </ul>

                {currentSong && (
                  <div className="mt-4 text-center space-x-4">
                    <Button onClick={isPlaying ? handlePause : handleResume} variant="outline">
                      {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                    </Button>
                    <Button onClick={toggleMute} variant="outline">
                      {isMuted ? "🔇 Unmute" : "🔊 Mute"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MentalBuddy;
