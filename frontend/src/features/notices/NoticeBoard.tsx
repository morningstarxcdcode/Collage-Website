import React, { useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/button";
import { ShieldCheck, Calendar } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  isVerified: boolean; // Blockchain verified
  category: "Global" | "Department" | "Year";
  department?: string;
}

const MOCK_NOTICES: Notice[] = [
  {
    id: "1",
    title: "End Semester Exam Schedule Released",
    content:
      "The end semester examinations for 1st Year CSE will commence from 15th May. Check the attached schedule.",
    date: "2024-04-20",
    priority: "high",
    isVerified: true,
    category: "Year",
    department: "CSE",
  },
  {
    id: "2",
    title: 'Annual Cultural Fest - "Aura 2024"',
    content:
      "We are excited to announce Aura 2024! Registration is open for all students.",
    date: "2024-04-18",
    priority: "medium",
    isVerified: false,
    category: "Global",
  },
  {
    id: "3",
    title: "Library Maintenance Shutdown",
    content:
      "The central library will remain closed on Sunday for maintenance.",
    date: "2024-04-19",
    priority: "low",
    isVerified: true, // Admin signed
    category: "Global",
  },
];

export const NoticeBoard: React.FC = () => {
  const [filter, setFilter] = useState<"All" | "Priority" | "Verified">("All");

  // In real app, these come from User Context
  const userDept = "CSE";

  const filteredNotices = MOCK_NOTICES.filter((notice) => {
    if (filter === "Verified" && !notice.isVerified) return false;
    if (filter === "Priority" && notice.priority !== "high") return false;

    // Role-based logic (simplified)
    if (notice.category === "Global") return true;
    if (notice.category === "Department" && notice.department === userDept)
      return true;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Notice Board
        </h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "All" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("All")}
          >
            All
          </Button>
          <Button
            variant={filter === "Verified" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("Verified")}
          >
            <ShieldCheck className="w-4 h-4" /> Verified Only
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotices.map((notice) => (
          <GlassCard key={notice.id} className="relative overflow-hidden group">
            {/* Blockchain Verification Badge */}
            {notice.isVerified && (
              <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-bl-lg backdrop-blur-md border-l border-b border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Blockchain Verified
              </div>
            )}

            <div className="flex items-start justify-between mb-4 mt-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full border ${
                  notice.priority === "high"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {notice.category}
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {notice.date}
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">
              {notice.title}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {notice.content}
            </p>

            <Button variant="outline" size="sm" className="w-full mt-auto">
              Read Full Notice
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
