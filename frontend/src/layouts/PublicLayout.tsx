import { Outlet, Link } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { ServerStatus } from "../features/public/ServerStatus";

export default function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">
              EduNexus <span className="text-primary">NextGen</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/academics"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Academics
            </Link>
            <Link
              to="/admissions"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Admissions
            </Link>
            <Link
              to="/research"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Research
            </Link>
            <Link
              to="/campus"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Campus Life
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                ERP Login
              </Button>
            </Link>
            <Link to="/admissions/apply">
              <Button variant="premium" size="sm">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-b border-white/10 animate-slide-up">
            <div className="px-6 py-4 space-y-4 flex flex-col">
              <Link to="/academics" className="text-sm font-medium">
                Academics
              </Link>
              <Link to="/admissions" className="text-sm font-medium">
                Admissions
              </Link>
              <Link to="/login" className="text-sm font-medium">
                ERP Login
              </Link>
              <Button variant="premium" className="w-full">
                Apply Now
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/10 py-12">
        <div className="container mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>
            &copy; 2024 EduNexus/Indian Institute of Technology (NextGen). All
            rights reserved.
          </p>
        </div>
      </footer>
      <ServerStatus />
    </div>
  );
}
