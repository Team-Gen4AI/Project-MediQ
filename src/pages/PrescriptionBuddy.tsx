import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const API_KEY = "AIzaSyAnLd2k_trNK5FRk_SGDgzBEqlLRYs-ESE";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const PrescriptionBuddy = () => {
  const [language, setLanguage] = useState("english");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Helper to convert file to base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Extract JSON safely from Gemini output
  const extractJson = (text: string) => {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : "{}";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setLoading(true);
    try {
      const base64Image = await toBase64(file);

      // Send image to Gemini model
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a medical assistant. Analyze the uploaded prescription image and return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "summary": "Brief overview of the prescription",
  "medicines": [{"name": "Medicine Name", "dosage": "500mg", "timing": "Twice a day", "duration": "5 days"}],
  "sideEffects": ["Side effect 1", "Side effect 2"],
  "foodInteractions": {"avoid": ["Item to avoid"], "recommended": ["Recommended item"]}
}
Provide medicine names, dosage, duration, and timing accurately. The explanation should be in ${language} language. Return ONLY the JSON object, nothing else.`
                },
                {
                  inlineData: {
                    mimeType: file.type,
                    data: base64Image.split(",")[1],
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `API error: ${response.status} ${response.statusText}`;
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Check for API errors in response
      if (result.error) {
        throw new Error(result.error.message || "API returned an error");
      }
      
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!rawText) {
        throw new Error("No response from API. Please check your API key and try again.");
      }

      console.log("Gemini raw output:", rawText); // For debugging

      // Try to parse JSON from response
      let parsedAnalysis;
      try {
        // First try: remove markdown code blocks and parse
        const cleanedText = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        parsedAnalysis = JSON.parse(cleanedText);
      } catch {
        try {
          // Second try: extract JSON from text using regex
          const jsonMatch = extractJson(rawText);
          if (jsonMatch && jsonMatch !== "{}") {
            parsedAnalysis = JSON.parse(jsonMatch);
          } else {
            throw new Error("No valid JSON found");
          }
        } catch {
          // Fallback: create a basic structure from the text
          parsedAnalysis = {
            summary: rawText.substring(0, 200) + "...",
            medicines: [],
            sideEffects: [],
            foodInteractions: { avoid: [], recommended: [] }
          };
          toast.warning("Could not parse structured data, showing raw analysis");
        }
      }

      // Validate the parsed data has required fields
      if (!parsedAnalysis.summary && !parsedAnalysis.medicines) {
        throw new Error("Invalid response format from API");
      }

      setAnalysis(parsedAnalysis);
      toast.success("Prescription analyzed successfully!");
    } catch (error: any) {
      console.error("Error analyzing prescription:", error);
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
      } else if (errorMessage.includes("parse") || errorMessage.includes("JSON")) {
        toast.error("Could not parse API response. The prescription image might be unclear. Try uploading a clearer image.");
      } else {
        toast.error(`Failed to analyze prescription: ${errorMessage}`);
      }
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
            <CardTitle>Upload Your Prescription</CardTitle>
            <CardDescription>
              We'll analyze it and explain everything in your preferred language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Preferred Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="prescription-upload"
                disabled={loading}
              />
              <label htmlFor="prescription-upload" className="cursor-pointer">
                {loading ? (
                  <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                ) : (
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                )}
                <p className="text-lg font-medium mb-2">
                  {loading ? "Analyzing your prescription..." : "Click to upload prescription"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {loading ? "This may take a few moments" : "Supports JPG, PNG files"}
                </p>
              </label>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-6 animate-scale-in">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Prescription Analysis</CardTitle>
                <CardDescription className="text-base">
                  {analysis.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Medicines:</h3>
                  <div className="space-y-4">
                    {analysis.medicines?.map((med: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/50 space-y-2">
                        <p className="font-semibold text-primary">{med.name}</p>
                        <div className="grid sm:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dosage:</span>
                            <p className="font-medium">{med.dosage}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Timing:</span>
                            <p className="font-medium">{med.timing}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <p className="font-medium">{med.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Possible Side Effects:</h3>
                  <ul className="space-y-2">
                    {analysis.sideEffects?.map((effect: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <h4 className="font-semibold mb-2 text-red-700">Avoid:</h4>
                    <ul className="space-y-1">
                      {analysis.foodInteractions?.avoid?.map((item: string, i: number) => (
                        <li key={i} className="text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="font-semibold mb-2 text-green-700">Recommended:</h4>
                    <ul className="space-y-1">
                      {analysis.foodInteractions?.recommended?.map((item: string, i: number) => (
                        <li key={i} className="text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default PrescriptionBuddy;
