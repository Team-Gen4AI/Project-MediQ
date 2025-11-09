import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Activity, Brain, FileText, Heart, Hospital, Shield, LayoutDashboard, LogOut } from "lucide-react";
import mediqLogo from "@/assets/mediq-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await authService.signOut();
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/disease-predictor", label: "Disease Predictor", icon: Activity },
    { path: "/prescription-buddy", label: "Prescription Buddy", icon: FileText },
    { path: "/mental-buddy", label: "Mental Buddy", icon: Brain },
    { path: "/hospital-finder", label: "Hospital Finder", icon: Hospital },
    { path: "/prevention", label: "Prevention", icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <img src={mediqLogo} alt="MediQ Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MediQ
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              size="sm"
              className="gap-2"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
