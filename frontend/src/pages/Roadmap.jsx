import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import { api } from '../api'

export default function Roadmap() {
  const { careerId } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setData(null)
    api.getRoadmap(careerId).then(setData).catch(() => setError('Could not load this roadmap.'))
  }, [careerId])

  if (error) {
    return <main className="max-w-lg mx-auto px-6 py-24 text-center text-comet text-sm">{error}</main>
  }
  if (!data) {
    return <main className="max-w-2xl mx-auto px-6 py-24 text-center text-starlight/50 font-mono text-sm">Building your roadmap…</main>
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/career-match" className="text-xs text-aurora hover:underline">← Back to matches</Link>
      <motion.h1
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold mt-4"
      >
        Roadmap to <span className="text-gradient">{data.career}</span>
      </motion.h1>
      <p className="text-starlight/60 mt-2 max-w-xl">{data.summary}</p>

      <div className="mt-10 relative pl-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-aurora via-nebula to-comet" />
        {data.steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.05 }}
            className="relative mb-6"
          >
            <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-ink border-2 border-aurora flex items-center justify-center text-[10px] font-mono text-aurora">
              {i + 1}
            </div>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">{step.title}</h3>
                <span className="text-xs font-mono text-starlight/40 uppercase">{step.stage}</span>
              </div>
              <p className="text-sm text-starlight/60 mt-1.5">{step.detail}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
