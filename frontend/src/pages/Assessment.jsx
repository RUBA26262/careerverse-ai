import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import { api } from '../api'

const scale = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' }
]

export default function Assessment() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getQuestions().then((data) => {
      setQuestions(data.questions)
      setLoading(false)
    }).catch(() => setError('Could not load the assessment. Please try again.'))
  }, [])

  const current = questions[index]
  const progress = questions.length ? Math.round((index / questions.length) * 100) : 0

  async function choose(value) {
    const nextAnswers = { ...answers, [current.id]: value }
    setAnswers(nextAnswers)

    if (index < questions.length - 1) {
      setIndex(index + 1)
    } else {
      setSubmitting(true)
      try {
        await api.submitAssessment(nextAnswers)
        navigate('/career-match')
      } catch (err) {
        setError(err.message)
        setSubmitting(false)
      }
    }
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto px-6 py-24 text-center text-starlight/50 font-mono text-sm">Loading assessment…</main>
  }

  if (error) {
    return <main className="max-w-2xl mx-auto px-6 py-24 text-center text-comet text-sm">{error}</main>
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-starlight/50 font-mono mb-2">
          <span>Question {index + 1} of {questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-nebula to-aurora"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="p-8">
            <span className="text-xs font-mono text-aurora/70 uppercase tracking-wide">{current.dimension}</span>
            <h2 className="font-display text-xl font-semibold mt-2 mb-8 leading-snug">{current.text}</h2>

            <div className="space-y-2">
              {scale.map((s) => (
                <button
                  key={s.value}
                  onClick={() => choose(s.value)}
                  disabled={submitting}
                  className="focus-ring w-full text-left px-4 py-3 rounded-xl border border-white/10 hover:border-aurora/50 hover:bg-white/5 transition-colors text-sm disabled:opacity-50"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {submitting && (
        <p className="text-center text-starlight/50 text-sm mt-6 font-mono">Calculating your career matches…</p>
      )}
    </main>
  )
}
