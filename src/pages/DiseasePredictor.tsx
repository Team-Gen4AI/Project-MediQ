import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const DiseasePredictor = () => {
  const navigate = useNavigate();
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const addSymptom = () => {
    const value = symptomInput.trim();
    if (!value) return;
    if (symptoms.includes(value.toLowerCase())) {
      toast.error("Symptom already added");
      return;
    }
    setSymptoms([...symptoms, value.toLowerCase()]);
    setSymptomInput("");
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }
    setLoading(true);
    try {
      // Call Gemini API for real-time disease prediction
      const API_KEY = "AIzaSyAnLd2k_trNK5FRk_SGDgzBEqlLRYs-ESE";
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
      const prompt = `Given these symptoms: ${symptoms.join(", ")}, predict the most likely disease, its severity (mild, moderate, severe), whether a doctor is needed, a short description, and 2-3 recommendations. Respond in a structured JSON format like:
{
  "disease": "Disease Name",
  "severity": "mild|moderate|severe",
  "needsDoctor": true/false,
  "description": "Brief description",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `API error: ${response.status} ${response.statusText}`;
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Check for API errors in response
      if (data.error) {
        throw new Error(data.error.message || "API returned an error");
      }
      
      let resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!resultText) {
        throw new Error("No response from API. Please check your API key and try again.");
      }
      
      let result;
      try {
        // Try to parse as JSON first (remove markdown code blocks if present)
        const cleanedText = resultText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        result = JSON.parse(cleanedText);
      } catch {
        // Improved fallback: extract severity from plain text using regex and markdown patterns
        let severity = "unknown";
        // Try to match markdown or bolded severity
        const severityRegex = /(?:Severity\s*[:\-]?\s*\*\*|\*\*Severity:\*\*)\s*(mild|moderate|severe|low|mid|high)/i;
        const severityMatch = resultText.match(severityRegex);
        if (severityMatch) {
          severity = severityMatch[1].toLowerCase();
        } else {
          // Try to match plain text
          const plainSeverityRegex = /severity\s*[:\-]?\s*(mild|moderate|severe|low|mid|high)/i;
          const plainSeverityMatch = resultText.match(plainSeverityRegex);
          if (plainSeverityMatch) severity = plainSeverityMatch[1].toLowerCase();
        }
        // Extract disease
        let disease = "See analysis below";
        const diseaseRegex = /Most Likely Disease\s*[:\-]?\s*\*\*([^*]+)\*\*/i;
        const diseaseMatch = resultText.match(diseaseRegex);
        if (diseaseMatch) disease = diseaseMatch[1].trim();
        // Extract recommendations
        let recommendations = [];
        const recommendationsRegex = /Recommendations\s*[:\-]?\s*([\s\S]+)/i;
        const recommendationsMatch = resultText.match(recommendationsRegex);
        if (recommendationsMatch) {
          recommendations = recommendationsMatch[1].split(/\n|\d+\.|\•|\-/).map(s => s.trim()).filter(Boolean);
        }
        // Extract doctor needed
        let needsDoctor = false;
        const doctorRegex = /Doctor Needed\s*[:\-]?\s*\*\*(.+?)\*\*/i;
        const doctorMatch = resultText.match(doctorRegex);
        if (doctorMatch) needsDoctor = /yes|true|immediately|monitor closely/i.test(doctorMatch[1]);
        result = {
          disease,
          severity,
          needsDoctor,
          description: resultText,
          recommendations,
        };
      }
      setPrediction(result);
      // Save to localStorage (optional - can be enhanced later)
      try {
        const savedPredictions = JSON.parse(localStorage.getItem('disease_predictions') || '[]');
        savedPredictions.push({
          id: Date.now(),
          symptoms: symptoms.join(","),
          prediction: result,
          severity: result.severity,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('disease_predictions', JSON.stringify(savedPredictions));
      } catch (err) {
        // Silently fail if localStorage is not available
        console.log('Could not save prediction to localStorage');
      }
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Error analyzing symptoms:", error);
      const errorMessage = error?.message || "Unknown error occurred";
      
      // Provide helpful error messages
      if (errorMessage.includes("API key") || errorMessage.includes("403") || errorMessage.includes("401")) {
        toast.error("Invalid API key. Please check the API configuration.");
      } else if (errorMessage.includes("429") || errorMessage.includes("quota")) {
        toast.error("API quota exceeded. Solutions: 1) Wait 24 hours for quota reset, 2) Check Google Cloud Console for usage, 3) Upgrade your API plan, or 4) Use a different API key.", {
          duration: 8000,
        });
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(`Failed to analyze symptoms: ${errorMessage}`);
      }
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
            <CardTitle>Enter Your Symptoms</CardTitle>
            <CardDescription>
              Enter a symptom (e.g., fever, cough, headache)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a symptom (e.g., fever, cough, headache)"
                value={symptomInput}
                onChange={e => setSymptomInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addSymptom(); }}
                className="flex-1"
              />
              <Button onClick={addSymptom} className="gradient-medical px-4">+ Add</Button>
            </div>
            {symptoms.length > 0 && (
              <div className="mt-2">
                <span className="font-semibold">Your Symptoms:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {symptoms.map((symptom, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1">
                      {symptom}
                      <button type="button" onClick={() => removeSymptom(symptom)} className="ml-1 text-purple-500 hover:text-purple-700">
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Button
              onClick={analyzeSymptoms}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white text-lg mt-4"
            >
              {loading ? "Analyzing..." : "Predict Possible Conditions"}
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
                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                    {prediction.disease && (
                      <li>Most Likely Disease: {prediction.disease}</li>
                    )}
                    {prediction.severity && prediction.severity !== "unknown" && (
                      <li>Severity: {prediction.severity.charAt(0).toUpperCase() + prediction.severity.slice(1)}</li>
                    )}
                    {typeof prediction.needsDoctor !== "undefined" && (
                      <li>Doctor Needed: {prediction.needsDoctor ? "Yes" : "No"}</li>
                    )}
                    {(() => {
                      // Extract short description from the analysis text if available
                      const descMatch = prediction.description.match(/Short Description\s*[:\-]?\s*\*\*(.+?)\*\*/i);
                      if (descMatch) return <li>Short Description: {descMatch[1]}</li>;
                      return null;
                    })()}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recommendations:</h3>
                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                    {prediction.recommendations && prediction.recommendations.length > 0 ? (
                      prediction.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))
                    ) : (
                      <li>No recommendations available.</li>
                    )}
                  </ul>
                </div>
                {prediction.needsDoctor && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="font-semibold text-destructive">
                      ⚠️ We recommend consulting a doctor for proper diagnosis and treatment
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
