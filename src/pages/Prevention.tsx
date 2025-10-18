import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, ThermometerSun, Droplets, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const Prevention = () => {

  const alerts = [
    {
      title: "High Dengue Risk This Week",
      severity: "high",
      description: "Increased cases reported in your area due to recent rains",
      icon: Droplets,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Flu Season Alert",
      severity: "medium",
      description: "Common flu cases rising. Get vaccinated if you haven't already",
      icon: ThermometerSun,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Air Quality Warning",
      severity: "medium",
      description: "Pollution levels high. Avoid outdoor activities",
      icon: Wind,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const preventionTips = [
    {
      category: "Monsoon Diseases",
      tips: [
        "Drink only boiled or filtered water",
        "Avoid street food and raw vegetables",
        "Use mosquito repellents and nets",
        "Keep your surroundings clean and dry",
      ],
    },
    {
      category: "Seasonal Flu",
      tips: [
        "Wash hands frequently with soap",
        "Avoid close contact with sick people",
        "Cover mouth when coughing or sneezing",
        "Stay hydrated and get adequate rest",
      ],
    },
    {
      category: "General Health",
      tips: [
        "Maintain a balanced diet rich in vitamins",
        "Exercise regularly for at least 30 minutes",
        "Get 7-8 hours of quality sleep",
        "Stay up to date with vaccinations",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Current Alerts */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🚨 Health Alerts</h2>
            <Button variant="outline" size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Subscribe to Alerts
            </Button>
          </div>

          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Card
                key={index}
                className="card-medical animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${alert.color}`}>
                        <alert.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {alert.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={alert.severity === "high" ? "destructive" : "secondary"}
                      className="capitalize"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Prevention Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">💡 Prevention Tips</h2>
          <div className="space-y-6">
            {preventionTips.map((section, index) => (
              <Card
                key={index}
                className="card-medical animate-scale-in"
                style={{ animationDelay: `${(index + alerts.length) * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle>{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.tips.map((tip, tipIndex) => (
                      <li
                        key={tipIndex}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Weekly Tips Card */}
        <Card className="card-medical bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Weekly Prevention Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Based on weather patterns and regional health data, we recommend focusing on:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge>Hydration</Badge>
                <span className="text-sm">Drink at least 8 glasses of water daily</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Mosquito Control</Badge>
                <span className="text-sm">Use repellents, especially during dawn and dusk</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Immunity</Badge>
                <span className="text-sm">Include citrus fruits and vegetables in your diet</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Prevention;
