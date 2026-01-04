import { ArrowRight, Play } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
        {/* Placeholder for Video - using CSS pattern for now to simulate texture */}
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2886&auto=format&fit=crop')] bg-cover bg-center opacity-50 scale-105 animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Admissions Open 2024-25
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight animate-slide-up delay-100">
          Where Future Leaders <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Define Tomorrow
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200">
          Experience India's first AI-driven campus ecosystem. Integrating
          world-class academics with next-generation technology.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 animate-slide-up delay-300">
          <Button
            variant="premium"
            size="lg"
            className="w-full md:w-auto hover:scale-105 transition-transform"
          >
            Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full md:w-auto border-white/20 hover:bg-white/10"
          >
            Virtual Campus Tour <Play className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Ticker */}
      <div className="absolute bottom-0 w-full border-t border-white/10 bg-black/50 backdrop-blur-md py-6 z-20">
        <div className="container mx-auto px-6 flex flex-wrap justify-center md:justify-around gap-8">
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-white">#1</p>
            <p className="text-xs text-zinc-400 uppercase tracking-widest">
              Innovation Rank
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-white">100%</p>
            <p className="text-xs text-zinc-400 uppercase tracking-widest">
              Digital Campus
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-white">50Cr+</p>
            <p className="text-xs text-zinc-400 uppercase tracking-widest">
              Research Funding
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
