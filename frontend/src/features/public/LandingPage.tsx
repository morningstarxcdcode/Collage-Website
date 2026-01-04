import Hero from "./Hero";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      {/* Additional sections (About, Stats) would go here */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bento Grid Placeholders */}
            <div className="h-64 rounded-2xl bg-zinc-900 border border-white/5 p-8 hover:border-primary/50 transition-colors group">
              <h3 className="text-2xl font-display font-bold mb-4 text-white">
                Research First
              </h3>
              <p className="text-zinc-400">
                Leading the nation in patents and publications per faculty.
              </p>
            </div>
            <div className="h-64 rounded-2xl bg-zinc-900 border border-white/5 p-8 hover:border-primary/50 transition-colors group md:col-span-2">
              <h3 className="text-2xl font-display font-bold mb-4 text-white">
                Global Placements
              </h3>
              <p className="text-zinc-400">
                Partnering with Fortune 500 companies to launch careers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
