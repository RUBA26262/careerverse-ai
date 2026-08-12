import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassCard className="p-8">
          <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-starlight/60 mb-6">Log in to continue your career journey.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-starlight/60 font-mono">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="focus-ring w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm"
                placeholder="you@school.edu"
              />
            </div>
            <div>
              <label className="text-xs text-starlight/60 font-mono">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="focus-ring w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-comet text-sm">{error}</p>}

            <button
              type="submit" disabled={busy}
              className="focus-ring w-full py-2.5 rounded-lg bg-gradient-to-r from-nebula to-aurora font-medium hover:brightness-110 transition-all disabled:opacity-50"
            >
              {busy ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-starlight/50 mt-6 text-center">
            New here? <Link to="/signup" className="text-aurora hover:underline">Create an account</Link>
          </p>
        </GlassCard>
      </motion.div>
    </main>
  )
}
