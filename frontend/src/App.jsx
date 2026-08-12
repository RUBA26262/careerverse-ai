import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Mentor from './pages/Mentor'
import Assessment from './pages/Assessment'
import CareerMatch from './pages/CareerMatch'
import Roadmap from './pages/Roadmap'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import ResumeBuilder from './pages/ResumeBuilder'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  return (
    <AuthProvider>

      <div className="min-h-screen bg-ink bg-nebula-gradient font-body">

        <Navbar />

        <Routes>

          {/* =========================
              LANDING
          ========================= */}

          <Route
            path="/"
            element={<Landing />}
          />

          {/* =========================
              AUTH
          ========================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* =========================
              DASHBOARD
          ========================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* =========================
              AI MENTOR
          ========================= */}

          <Route
            path="/mentor"
            element={
              <ProtectedRoute>
                <Mentor />
              </ProtectedRoute>
            }
          />

          {/* =========================
              ASSESSMENT
          ========================= */}

          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <Assessment />
              </ProtectedRoute>
            }
          />

          {/* =========================
              CAREER MATCH
          ========================= */}

          <Route
            path="/career-match"
            element={
              <ProtectedRoute>
                <CareerMatch />
              </ProtectedRoute>
            }
          />

          {/* =========================
              ROADMAP
          ========================= */}

          <Route
            path="/roadmap/:careerId"
            element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            }
          />

          {/* =========================
              RESUME ANALYZER
          ========================= */}

          <Route
            path="/resume-analyzer"
            element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            }
          />

          {/* =========================
              RESUME BUILDER - NEW
          ========================= */}

          <Route
            path="/resume-builder"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />

          {/* =========================
              PARENT
          ========================= */}

          <Route
            path="/parent"
            element={
              <ComingSoon
                title="Parent Dashboard"
                description="Track your child's progress, strengths and monthly growth reports."
              />
            }
          />

          {/* =========================
              TEACHER
          ========================= */}

          <Route
            path="/teacher"
            element={
              <ComingSoon
                title="Teacher Dashboard"
                description="Class analytics, career distribution and skill reports for your students."
              />
            }
          />

          {/* =========================
              ADMIN
          ========================= */}

          <Route
            path="/admin"
            element={
              <ComingSoon
                title="Admin Console"
                description="Manage students, careers, questions and platform analytics."
              />
            }
          />

          {/* =========================
              SIMULATIONS
          ========================= */}

          <Route
            path="/simulations"
            element={
              <ComingSoon
                title="Career Simulations"
                description="Live a day in the life of an engineer, doctor, pilot or designer."
              />
            }
          />

          {/* =========================
              404
          ========================= */}

          <Route
            path="*"
            element={
              <ComingSoon
                title="Page not found"
                description="That corner of the universe hasn't been mapped yet."
              />
            }
          />

        </Routes>

      </div>

    </AuthProvider>
  )
}