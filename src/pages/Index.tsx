import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-3xl animate-fade-up">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 rounded-2xl gradient-medical shadow-lg">
            <Activity className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-6xl font-bold gradient-medical bg-clip-text text-transparent">
            MediQ
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            From Symptoms to Solutions
          </h2>
          <p className="text-2xl text-muted-foreground">
            Your All-in-One AI Health Companion
          </p>
        </div>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get instant disease predictions, understand your prescriptions, track your mental wellness,
          find affordable healthcare, and stay protected with preventive health alerts.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="gradient-medical hover:gradient-hover text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-8">
          {[
            "🩺 Disease Predictor",
            "💊 Prescription Buddy",
            "🧠 Mental Buddy",
            "🏥 Hospital Finder",
            "🛡️ Prevention Tips",
          ].map((feature, i) => (
            <div
              key={i}
              className="card-medical p-4 text-center animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="text-sm font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
