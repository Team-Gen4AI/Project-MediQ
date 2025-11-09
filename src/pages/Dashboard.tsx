import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, Brain, MapPin, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.fullName);
        setLoading(false);
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    const user = getCurrentUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUserName(user.fullName);
    setLoading(false);
  };


  const features = [
    {
      icon: Activity,
      title: "Disease Predictor",
      description: "AI-powered symptom analysis and disease prediction",
      path: "/disease-predictor",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "Prescription Buddy",
      description: "Upload and understand your prescriptions",
      path: "/prescription-buddy",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "Mental Buddy",
      description: "Track your mood and get personalized support",
      path: "/mental-buddy",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Find Hospitals",
      description: "Locate budget-friendly healthcare nearby",
      path: "/hospital-finder",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Prevention",
      description: "Seasonal disease alerts and prevention tips",
      path: "/prevention",
      color: "from-orange-500 to-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-up">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-xl text-muted-foreground">
            Your health journey continues here
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="card-medical cursor-pointer hover:scale-105 transition-transform animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Stats - Placeholder for user data */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Previous Predictions", count: 0, icon: Activity },
            { label: "Saved Prescriptions", count: 0, icon: FileText },
            { label: "Mood Reports", count: 0, icon: Brain },
            { label: "Favorite Hospitals", count: 0, icon: MapPin },
          ].map((stat, index) => (
            <Card key={index} className="card-medical">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.count}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
