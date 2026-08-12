import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import { useAuth } from '../AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', grade: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signup(form)
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
          <h1 className="font-display text-2xl font-bold mb-1">Start your journey</h1>
          <p className="text-sm text-starlight/60 mb-6">Takes under a minute — no credit card, ever.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-starlight/60 font-mono">Full name</label>
              <input required value={form.name} onChange={update('name')}
                className="focus-ring w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm"
                placeholder="Aditi Sharma" />
            </div>
            <div>
              <label className="text-xs text-starlight/60 font-mono">Email</label>
              <input type="email" required value={form.email} onChange={update('email')}
                className="focus-ring w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm"
                placeholder="you@school.edu" />
            </div>
            <div>
              <label className="text-xs text-starlight/60 font-mono">Grade / class</label>
              <input value={form.grade} onChange={update('grade')}
                className="focus-ring w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm"
                placeholder="Grade 10" />
            </div>
            <div>
              <label className="text-xs text-starlight/60 font-mono">Password</label>
              <input type="password" required value={form.password} onChange={update('password')}
                className="focus-ring w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm"
                placeholder="At least 6 characters" />
            </div>

            {error && <p className="text-comet text-sm">{error}</p>}

            <button
              type="submit" disabled={busy}
              className="focus-ring w-full py-2.5 rounded-lg bg-gradient-to-r from-nebula to-aurora font-medium hover:brightness-110 transition-all disabled:opacity-50"
            >
              {busy ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p className="text-sm text-starlight/50 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-aurora hover:underline">Log in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </main>
  )
}
