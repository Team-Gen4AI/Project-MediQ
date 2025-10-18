import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, Star, Heart } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const HospitalFinder = () => {
  const [location, setLocation] = useState("");
  const [treatment, setTreatment] = useState("");
  const [budget, setBudget] = useState("");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchHospitals = async () => {
    if (!location || !treatment || !budget) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement AI-powered hospital search
      const mockHospitals = [
        {
          name: "City General Hospital",
          distance: "1.2 km",
          fees: "₹500 - ₹1000",
          rating: "4.5",
          address: "123 Main Street, City Center",
        },
        {
          name: "MediCare Clinic",
          distance: "2.8 km",
          fees: "₹300 - ₹800",
          rating: "4.2",
          address: "456 Park Avenue, North District",
        },
        {
          name: "HealthPlus Medical Center",
          distance: "3.5 km",
          fees: "₹400 - ₹900",
          rating: "4.7",
          address: "789 Health Street, East Zone",
        },
      ];

      setHospitals(mockHospitals);
      toast.success("Found nearby hospitals!");
    } catch (error) {
      toast.error("Failed to search hospitals");
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
            <CardTitle>Find Budget-Friendly Healthcare</CardTitle>
            <CardDescription>
              Search for hospitals within your budget and location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Location</label>
                <Input
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type of Treatment</label>
                <Select value={treatment} onValueChange={setTreatment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Consultation</SelectItem>
                    <SelectItem value="emergency">Emergency Care</SelectItem>
                    <SelectItem value="specialist">Specialist Consultation</SelectItem>
                    <SelectItem value="dental">Dental Care</SelectItem>
                    <SelectItem value="diagnostic">Diagnostic Tests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expected Budget (₹)</label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Under ₹500</SelectItem>
                  <SelectItem value="medium">₹500 - ₹1500</SelectItem>
                  <SelectItem value="high">₹1500 - ₹3000</SelectItem>
                  <SelectItem value="premium">Above ₹3000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={searchHospitals}
              disabled={loading}
              className="w-full gradient-medical hover:gradient-hover"
            >
              {loading ? "Searching..." : "Search Hospitals"}
            </Button>
          </CardContent>
        </Card>

        {hospitals.length > 0 && (
          <div className="space-y-4 animate-scale-in">
            {hospitals.map((hospital, index) => (
              <Card key={index} className="card-medical hover:scale-102 transition-transform">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{hospital.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {hospital.address}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-semibold text-primary">{hospital.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fees Range</p>
                      <p className="font-semibold">{hospital.fees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <p className="font-semibold">{hospital.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                    <Button className="flex-1 gradient-medical">
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HospitalFinder;
