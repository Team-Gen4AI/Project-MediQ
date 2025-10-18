import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const MentalBuddy = () => {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [suggestions, setSuggestions] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const moodOptions = [
    { value: 1, emoji: "😢", label: "Very Bad", color: "from-red-500 to-red-600" },
    { value: 2, emoji: "😕", label: "Bad", color: "from-orange-500 to-orange-600" },
    { value: 3, emoji: "😐", label: "Okay", color: "from-yellow-500 to-yellow-600" },
    { value: 4, emoji: "🙂", label: "Good", color: "from-green-500 to-green-600" },
    { value: 5, emoji: "😊", label: "Excellent", color: "from-emerald-500 to-emerald-600" },
  ];

  const analyzeMood = async () => {
    if (moodRating === null) {
      toast.error("Please select your mood");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement AI analysis via edge function
      const mockSuggestions = {
        activities: [
          "Try 10 minutes of deep breathing exercises",
          "Take a short walk in nature",
          "Listen to calming music",
          "Practice gratitude journaling",
        ],
        therapists: moodRating <= 2 ? [
          { name: "Dr. Sarah Johnson", distance: "2.5 km", specialty: "Anxiety & Depression" },
          { name: "Dr. Michael Chen", distance: "3.1 km", specialty: "Stress Management" },
        ] : null,
        motivationalMessage: "Remember, every day is a new beginning. You're doing great by taking care of your mental health! 💪",
        meditationLinks: [
          "5-minute guided meditation",
          "Relaxing nature sounds",
        ],
      };

      setSuggestions(mockSuggestions);

      // Save to database
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("mood_reports").insert({
          user_id: session.user.id,
          mood_rating: moodRating,
          notes: notes,
          ai_suggestions: JSON.stringify(mockSuggestions),
        });
      }

      toast.success("Mood recorded successfully!");
    } catch (error) {
      toast.error("Failed to analyze mood");
    } finally {
      setLoading(false);
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
            <div className="grid grid-cols-5 gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setMoodRating(mood.value)}
                  className={`
                    p-4 rounded-xl border-2 transition-all hover:scale-105
                    ${moodRating === mood.value
                      ? `border-primary bg-gradient-to-br ${mood.color} text-white shadow-lg`
                      : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <p className="text-xs font-medium">{mood.label}</p>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tell us more (optional)
              </label>
              <Textarea
                placeholder="What's on your mind today?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={analyzeMood}
              disabled={loading || moodRating === null}
              className="w-full gradient-medical hover:gradient-hover"
            >
              {loading ? "Analyzing..." : "Get Personalized Support"}
            </Button>
          </CardContent>
        </Card>

        {suggestions && (
          <div className="space-y-6 animate-scale-in">
            <Card className="card-medical bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-center">
                  {suggestions.motivationalMessage}
                </p>
              </CardContent>
            </Card>

            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Recommended Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {suggestions.activities.map((activity: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {suggestions.therapists && (
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle>Nearby Therapists</CardTitle>
                  <CardDescription>
                    Consider reaching out to a professional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestions.therapists.map((therapist: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/50">
                        <p className="font-semibold">{therapist.name}</p>
                        <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                        <p className="text-sm text-primary mt-1">{therapist.distance} away</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Meditation & Relaxation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestions.meditationLinks.map((link: string, i: number) => (
                    <Button key={i} variant="outline" className="w-full justify-start">
                      🎵 {link}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MentalBuddy;
