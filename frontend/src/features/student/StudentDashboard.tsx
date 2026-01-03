import React from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/button";
import { Clock, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import { useAuthService } from "../../services/AuthService";

const StudentDashboard: React.FC = () => {
  const { userIdentity } = useAuthService();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-cyan-400">Student</span>
          </h1>
          <p className="text-slate-400">
            Roll No: 2024CSE001 |{" "}
            {userIdentity.isConnected ? (
              <span className="text-emerald-400">
                Wallet Linked: {userIdentity.address?.slice(0, 6)}...
                {userIdentity.address?.slice(-4)}
              </span>
            ) : (
              <span className="text-amber-400">Wallet Not Connected</span>
            )}
          </p>
        </div>
        {!userIdentity.isConnected && (
          <Button variant="default">Connect Wallet</Button>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="from-blue-900/20 to-cyan-900/20 bg-gradient-to-br">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-400 text-sm">Attendance</h4>
              <p className="text-2xl font-bold text-white">85%</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="from-purple-900/20 to-pink-900/20 bg-gradient-to-br">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-400 text-sm">CGPA</h4>
              <p className="text-2xl font-bold text-white">9.2</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="from-amber-900/20 to-orange-900/20 bg-gradient-to-br">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-500/20 text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-400 text-sm">Pending Fees</h4>
              <p className="text-2xl font-bold text-white">₹ 45,000</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="from-emerald-900/20 to-teal-900/20 bg-gradient-to-br">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-400 text-sm">Next Exam</h4>
              <p className="text-xl font-bold text-white">15 May</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline / Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-semibold text-white">Recent Activity</h3>
          {/* Mock Timeline */}
          <GlassCard>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Line */}
                  {i !== 3 && (
                    <div className="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-slate-700" />
                  )}

                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center shrink-0 z-10">
                    <span className="text-cyan-400 text-xs font-mono">{i}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">
                      Semester Fee Payment
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Transaction verified on Polygon Network
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">
                      2 Days ago • Tx: 0x8f...21a
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white">Quick Actions</h3>
          <GlassCard className="space-y-4">
            <Button
              className="w-full justify-between group"
              variant="secondary"
            >
              Pay Semester Fees
              <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Button>
            <Button
              className="w-full justify-between group"
              variant="secondary"
            >
              Exam Registration
              <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Button>
            <Button
              className="w-full justify-between group"
              variant="secondary"
            >
              View Verified Docs
              <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
