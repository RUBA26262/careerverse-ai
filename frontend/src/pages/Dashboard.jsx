import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import { useAuth } from '../AuthContext'
import { api } from '../api'

const timeline = [
  { label: 'Account created', done: true },
  { label: 'Talk to your AI mentor', done: false, to: '/mentor' },
  { label: 'Complete the psychometric assessment', done: false, to: '/assessment' },
  { label: 'See your career matches', done: false, to: '/career-match' },
  { label: 'Analyze your resume with AI', done: false, to: '/resume-analyzer' },
  { label: 'Get your personalized roadmap', done: false, to: '/career-match' }
]

export default function Dashboard() {
  const { user } = useAuth()
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getLatestAssessment()
      .then(setAssessment)
      .catch(() => setAssessment(null))
      .finally(() => setLoading(false))
  }, [])

  const steps = timeline.map((t, i) => {
    if (i === 0) {
      return { ...t, done: true }
    }

    if (i === 2 && assessment) {
      return { ...t, done: true }
    }

    return t
  })

  const completedCount = steps.filter((s) => s.done).length
  const progress = Math.round(
    (completedCount / steps.length) * 100
  )

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs uppercase tracking-widest text-aurora">
          CareerVerse AI
        </p>

        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">
          Welcome back,{' '}
          <span className="text-gradient">
            {user?.name?.split(' ')[0] || 'explorer'}
          </span>
        </h1>

        <p className="text-starlight/60 mt-2">
          Here's where your career journey stands today.
        </p>
      </motion.div>


      {/* Progress + Journey */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        {/* Progress */}
        <GlassCard className="p-6 md:col-span-1">

          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold">
              Career Progress
            </h2>

            <span className="text-xs text-aurora">
              {completedCount}/{steps.length}
            </span>
          </div>

          <div className="relative w-32 h-32 mx-auto">

            <svg
              viewBox="0 0 120 120"
              className="w-full h-full -rotate-90"
            >

              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="10"
              />

              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#progGrad)"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={
                  2 *
                  Math.PI *
                  52 *
                  (1 - progress / 100)
                }
                strokeLinecap="round"
              />

              <defs>
                <linearGradient
                  id="progGrad"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#3AA6FF"
                  />

                  <stop
                    offset="100%"
                    stopColor="#6C4FF0"
                  />
                </linearGradient>
              </defs>

            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-bold">
                {progress}%
              </span>

              <span className="text-[10px] text-starlight/40 uppercase tracking-widest">
                complete
              </span>
            </div>

          </div>

          <p className="text-center text-xs text-starlight/50 mt-5">
            Keep exploring to improve your career readiness.
          </p>

        </GlassCard>


        {/* Journey */}
        <GlassCard className="p-6 md:col-span-2">

          <div className="flex items-center justify-between mb-5">

            <h2 className="font-display font-semibold">
              Your Journey
            </h2>

            <span className="text-xs text-starlight/40">
              Career roadmap
            </span>

          </div>

          <ul className="space-y-4">

            {steps.map((s, index) => (

              <li
                key={s.label}
                className="flex items-center gap-3 text-sm"
              >

                <div
                  className={`
                    w-7 h-7 rounded-full
                    flex items-center justify-center
                    border
                    ${
                      s.done
                        ? 'bg-aurora/10 border-aurora/30 text-aurora'
                        : 'bg-white/5 border-white/10 text-starlight/30'
                    }
                  `}
                >
                  {s.done ? '✓' : index + 1}
                </div>

                <span
                  className={
                    s.done
                      ? 'text-starlight/90'
                      : 'text-starlight/50'
                  }
                >
                  {s.label}
                </span>

                {!s.done && s.to && (
                  <Link
                    to={s.to}
                    className="ml-auto text-xs text-aurora hover:underline"
                  >
                    Start →
                  </Link>
                )}

              </li>

            ))}

          </ul>

        </GlassCard>

      </div>


      {/* Main tools */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">

        {/* AI Mentor */}
        <Link to="/mentor">

          <GlassCard className="p-6 h-full hover:border-aurora/40 transition-all group">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-2xl bg-aurora/10 border border-aurora/20 flex items-center justify-center text-xl">
                🤖
              </div>

              <span className="text-aurora opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>

            </div>

            <h3 className="font-display font-semibold mt-5 mb-2">
              AI Career Mentor
            </h3>

            <p className="text-sm text-starlight/60">
              Chat about what you love, what worries you,
              and what you want to become.
            </p>

          </GlassCard>

        </Link>


        {/* Assessment */}
        <Link to={assessment ? '/career-match' : '/assessment'}>

          <GlassCard className="p-6 h-full hover:border-aurora/40 transition-all group">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-2xl bg-nebula/10 border border-nebula/20 flex items-center justify-center text-xl">
                🧠
              </div>

              <span className="text-aurora opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>

            </div>

            <h3 className="font-display font-semibold mt-5 mb-2">

              {assessment
                ? 'View Career Matches'
                : 'Take the Assessment'}

            </h3>

            <p className="text-sm text-starlight/60">

              {loading
                ? 'Checking your progress…'
                : assessment
                  ? 'Your assessment is complete. Explore your recommended careers.'
                  : 'Discover your strengths, interests and career direction.'}

            </p>

          </GlassCard>

        </Link>


        {/* Resume Analyzer */}
        <Link to="/resume-analyzer">

          <GlassCard className="p-6 h-full hover:border-aurora/40 transition-all group relative overflow-hidden">

            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-aurora/10 blur-2xl" />

            <div className="flex items-start justify-between relative">

              <div className="w-11 h-11 rounded-2xl bg-aurora/10 border border-aurora/20 flex items-center justify-center text-xl">
                📄
              </div>

              <span className="text-aurora opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>

            </div>

            <p className="text-[10px] uppercase tracking-widest text-aurora mt-5">
              New AI Tool
            </p>

            <h3 className="font-display font-semibold mt-1 mb-2">
              AI Resume Analyzer
            </h3>

            <p className="text-sm text-starlight/60">
              Upload your resume and get an ATS score,
              skill analysis, missing skills and improvement
              suggestions.
            </p>

            <div className="mt-5 text-xs text-aurora">
              Analyze my resume →
            </div>

          </GlassCard>

        </Link>

      </div>


      {/* Additional tools */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <Link to="/career-match">

          <GlassCard className="p-6 hover:border-aurora/40 transition-all group">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                🎯
              </div>

              <div className="flex-1">

                <h3 className="font-display font-semibold">
                  Career Match
                </h3>

                <p className="text-sm text-starlight/50 mt-1">
                  See which careers best match your
                  personality and interests.
                </p>

              </div>

              <span className="text-aurora">
                →
              </span>

            </div>

          </GlassCard>

        </Link>


        <GlassCard className="p-6 opacity-80">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
              🏆
            </div>

            <div>

              <h3 className="font-display font-semibold">
                Achievements
              </h3>

              <p className="text-sm text-starlight/50 mt-1">
                Badges, streaks and career milestones
                will unlock as you progress.
              </p>

            </div>

          </div>

          <div className="mt-4 text-xs text-starlight/30">
            Coming soon
          </div>

        </GlassCard>

      </div>

    </main>
  )
}