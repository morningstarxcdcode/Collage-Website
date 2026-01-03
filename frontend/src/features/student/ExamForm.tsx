import React, { useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/button";
import { FileText, CheckCircle } from "lucide-react";

export const ExamForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  // Mock Subjects
  const subjects = [
    { code: "CS101", name: "Data Structures", selected: true }, // Mandatory
    { code: "CS102", name: "Database Management", selected: true },
    { code: "CS103", name: "Operating Systems", selected: true },
    { code: "HU101", name: "Professional Ethics", selected: false }, // Elective
    { code: "HU102", name: "Environmental Science", selected: false },
  ];

  const [selectedElectives, setSelectedElectives] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // Mock submission
  };

  const toggleElective = (code: string) => {
    setSelectedElectives((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  if (submitted) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-6">
        <GlassCard className="text-center max-w-md w-full py-12">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Registration Successful!
          </h2>
          <p className="text-slate-400 mb-6">
            Your exam form has been submitted and verified.
          </p>
          <div className="bg-slate-900/50 p-4 rounded-lg text-left text-sm text-slate-300">
            <p>
              <strong>Total Subjects:</strong> {3 + selectedElectives.length}
            </p>
            <p>
              <strong>Transaction ID:</strong> #EX-2024-8921
            </p>
          </div>
          <Button
            className="mt-8 w-full"
            variant="outline"
            onClick={() => setSubmitted(false)}
          >
            Download Hall Ticket
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Exam Registration
        </h2>
        <p className="text-slate-400">Semester 4 - End Term Examinations</p>
      </header>

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mandatory Subjects */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Core Subjects (Mandatory)
            </h3>
            <div className="space-y-3">
              {subjects
                .filter((s) => s.selected)
                .map((sub) => (
                  <div
                    key={sub.code}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <span className="text-white font-medium">{sub.name}</span>
                    <span className="text-slate-500 text-sm font-mono">
                      {sub.code}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Electives */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
              Choose Electives (Any 1)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects
                .filter((s) => !s.selected)
                .map((sub) => (
                  <div
                    key={sub.code}
                    onClick={() => toggleElective(sub.code)}
                    className={`cursor-pointer p-4 rounded-lg border transition-all ${
                      selectedElectives.includes(sub.code)
                        ? "bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/10"
                        : "bg-slate-800/30 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-500 text-xs font-mono">
                        {sub.code}
                      </span>
                      {selectedElectives.includes(sub.code) && (
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <p
                      className={`font-medium ${selectedElectives.includes(sub.code) ? "text-white" : "text-slate-300"}`}
                    >
                      {sub.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400">Exam Fee Total</span>
              <span className="text-2xl font-bold text-white">₹ 3,000</span>
            </div>
            <Button
              type="submit"
              variant="default"
              className="w-full h-12 text-lg"
            >
              Register & Pay
            </Button>
            <p className="text-center text-xs text-slate-500 mt-4">
              By registering, you confirm your attendance for the upcoming
              examinations.
            </p>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
