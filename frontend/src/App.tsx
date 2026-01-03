import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import LandingPage from "./features/public/LandingPage";
import StudentDashboard from "./features/student/StudentDashboard";
import { FeePayment } from "./features/student/FeePayment";
import { ExamForm } from "./features/student/ExamForm";
import { LibraryBorrowing } from "./features/student/LibraryBorrowing";
import { NoticeBoard } from "./features/notices/NoticeBoard";
import { LibraryDashboard } from "./features/library/LibraryDashboard";
import { MarksEntry } from "./features/teacher/MarksEntry";
import { AttendanceMarking } from "./features/teacher/AttendanceMarking";
import { TeacherReports } from "./features/teacher/TeacherReports";
import { DepartmentOverview } from "./features/hod/DepartmentOverview";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiAdapter } from "./config/reown";

// Setup QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/fees" element={<FeePayment />} />
              <Route path="/student/exams" element={<ExamForm />} />
              <Route path="/student/library" element={<LibraryBorrowing />} />

              {/* Teacher Routes */}
              <Route path="/teacher/marks" element={<MarksEntry />} />
              <Route path="/teacher/attendance" element={<AttendanceMarking />} />
              <Route path="/teacher/reports" element={<TeacherReports />} />

              {/* HOD Routes */}
              <Route path="/hod/overview" element={<DepartmentOverview />} />

              {/* Library Routes */}
              <Route path="/library/dashboard" element={<LibraryDashboard />} />

              {/* Other Routes */}
              <Route path="/notices" element={<NoticeBoard />} />

              <Route
                path="/academics"
                element={
                  <div className="p-20 text-center">
                    Academics Module Loading...
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="p-20 text-center">
                    Login Module Loading...
                  </div>
                }
              />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
