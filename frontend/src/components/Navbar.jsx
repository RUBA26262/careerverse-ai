import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">

      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="font-display font-bold text-lg tracking-tight flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-aurora shadow-[0_0_12px_2px_rgba(58,166,255,0.8)]" />

          CareerVerse

          <span className="text-gradient">
            AI
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-7 text-sm text-starlight/70 font-body">

          <a
            href="/#how-it-works"
            className="hover:text-starlight transition-colors"
          >
            How it works
          </a>

          <a
            href="/#features"
            className="hover:text-starlight transition-colors"
          >
            Features
          </a>

          {/* DASHBOARD */}
          {user && (
            <Link
              to="/dashboard"
              className="hover:text-starlight transition-colors"
            >
              Dashboard
            </Link>
          )}

          {/* RESUME ANALYZER */}
          {user && (
            <Link
              to="/resume-analyzer"
              className="text-aurora hover:text-starlight transition-colors"
            >
              Resume AI
            </Link>
          )}

          {/* RESUME BUILDER - NEW */}
          {user && (
            <Link
              to="/resume-builder"
              className="hover:text-starlight transition-colors"
            >
              📄 Resume Builder
            </Link>
          )}

          {/* AI MENTOR */}
          {user && (
            <Link
              to="/mentor"
              className="hover:text-starlight transition-colors"
            >
              AI Mentor
            </Link>
          )}

        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-3">

          {user ? (

            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="focus-ring text-sm px-4 py-2 rounded-full border border-white/15 text-starlight/80 hover:bg-white/5 transition-colors"
            >
              Sign out
            </button>

          ) : (

            <>

              <Link
                to="/login"
                className="focus-ring text-sm px-4 py-2 rounded-full text-starlight/80 hover:text-starlight transition-colors"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="focus-ring text-sm px-4 py-2 rounded-full bg-gradient-to-r from-nebula to-aurora font-medium hover:brightness-110 transition-all"
              >
                Get started
              </Link>

            </>

          )}

        </div>

      </nav>

    </header>
  )
}   