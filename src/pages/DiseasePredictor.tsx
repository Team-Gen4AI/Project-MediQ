import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const DiseasePredictor = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSymptomsplaceholder = async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter your symptoms");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement edge function call to Lovable AI
      // For now, showing placeholder
      const mockResult = {
        disease: "Common Cold",
        severity: "mild",
        needsDoctor: false,
        description: "Based on your symptoms, you may have a common cold. This is usually mild and resolves on its own.",
        recommendations: [
          "Rest and stay hydrated",
          "Use over-the-counter pain relievers if needed",
          "Monitor your symptoms for any worsening",
        ],
      };

      setPrediction(mockResult);
      
      // Save to database
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("disease_predictions").insert({
          user_id: session.user.id,
          symptoms: symptoms,
          prediction: JSON.stringify(mockResult),
          severity: mockResult.severity,
        });
      }
      
      toast.success("Analysis complete!");
    } catch (error: any) {
      toast.error("Failed to analyze symptoms");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "from-green-500 to-emerald-500";
      case "moderate": return "from-yellow-500 to-orange-500";
      case "severe": return "from-red-500 to-pink-500";
      default: return "from-blue-500 to-cyan-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="card-medical mb-6 animate-fade-up">
          <CardHeader>
            <CardTitle>Describe Your Symptoms</CardTitle>
            <CardDescription>
              Tell us what you're experiencing, and our AI will analyze your symptoms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="E.g., I have a headache, fever, and sore throat for the past 2 days..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[150px]"
            />
            <Button
              onClick={analyzeSymptomsplaceholder}
              disabled={loading}
              className="w-full gradient-medical hover:gradient-hover"
            >
              {loading ? "Analyzing..." : "Analyze Symptoms"}
            </Button>
          </CardContent>
        </Card>

        {prediction && (
          <div className="space-y-6 animate-scale-in">
            <Card className="card-medical">
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getSeverityColor(prediction.severity)} flex items-center justify-center mb-4`}>
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{prediction.disease}</CardTitle>
                <CardDescription className="text-lg">
                  Severity: <span className="font-semibold capitalize">{prediction.severity}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Analysis:</h3>
                  <p className="text-muted-foreground">{prediction.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Recommendations:</h3>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {prediction.needsDoctor && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="font-semibold text-destructive">
                      ⚠ We recommend consulting a doctor for proper diagnosis and treatment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/hospital-finder")}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Find Nearby Hospitals
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiseasePredictor;