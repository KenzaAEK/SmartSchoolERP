
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import AIOrientation from './pages/student/AIOrientation';
import StudentGrades from './pages/student/StudentGrades';
import WeeklySchedule from './pages/student/WeeklySchedule';
import StudentDashboard from './pages/student/StudentDashboard';
import ScheduleOptimizer from './pages/admin/ScheduleOptimizer';
import PredictiveDashboard from './pages/admin/PredictiveDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import DeliberationBoard from './pages/admin/DeliberationBoard';
import ImportCenter from './pages/admin/ImportCenter';
import ReportCenter from './pages/admin/ReportCenter';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import GradeEntry from './pages/teacher/GradeEntry';
import AttendanceSheet from './pages/teacher/AttendanceSheet';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/dashboard" element={
            user.role === UserRole.STUDENT ? <StudentDashboard /> : 
            user.role === UserRole.TEACHER ? <TeacherDashboard /> :
            <Navigate to="/stats" />
          } />
          
          {/* Student Routes */}
          {user.role === UserRole.STUDENT && (
            <>
              <Route path="/orientation" element={<AIOrientation />} />
              <Route path="/grades" element={<StudentGrades />} />
              <Route path="/schedule-view" element={<WeeklySchedule />} />
            </>
          )}

          {/* Teacher Routes */}
          {user.role === UserRole.TEACHER && (
            <>
              <Route path="/teacher/grades" element={<GradeEntry />} />
              <Route path="/attendance" element={<AttendanceSheet />} />
            </>
          )}

          {/* Admin Routes */}
          {user.role === UserRole.ADMIN && (
            <>
              <Route path="/stats" element={<PredictiveDashboard />} />
              <Route path="/admin/reports" element={<ReportCenter />} />
              <Route path="/admin/deliberations" element={<DeliberationBoard />} />
              <Route path="/admin/import" element={<ImportCenter />} />
              <Route path="/schedule" element={<ScheduleOptimizer />} />
              <Route path="/admin/students" element={<StudentManagement />} />
              <Route path="/admin/teachers" element={<TeacherManagement />} />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
